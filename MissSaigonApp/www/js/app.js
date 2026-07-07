/* Miss Saigon – Order Tracker app logic */
(function () {
  "use strict";

  const MENU = window.MissSaigonMenu;
  const TABLES = window.MissSaigonTables.TABLES;
  const STORAGE_KEY = "missaigon_state_v1";
  const HOLD_MS = 10000;

  // ---------------------------------------------------------------
  // State
  // ---------------------------------------------------------------
  /** @type {{orders: Object<string, {items: any[], splitMode: boolean, updatedAt: number}>}} */
  let state = { orders: {} };
  let currentTableId = null;
  let saveTimer = null;

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function euro(cents) {
    const n = (cents || 0) / 100;
    return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  function parseGermanMoney(str) {
    if (str == null) return NaN;
    let s = String(str).trim();
    s = s.replace(/[^0-9,.\-]/g, "");
    s = s.replace(/\./g, ",");
    // if multiple commas, keep only the last as decimal separator
    const parts = s.split(",");
    if (parts.length > 2) {
      const last = parts.pop();
      s = parts.join("") + "," + last;
    }
    s = s.replace(",", ".");
    const val = parseFloat(s);
    if (isNaN(val)) return NaN;
    return Math.round(val * 100);
  }

  function ensureOrder(tableId) {
    if (!state.orders[tableId]) {
      state.orders[tableId] = { items: [], splitMode: false, updatedAt: Date.now() };
    }
    return state.orders[tableId];
  }

  function sumUnpaid(order) {
    return order.items.reduce((s, it) => (it.paid ? s : s + it.unitPrice * it.qty), 0);
  }
  function sumSelected(order) {
    return order.items.reduce((s, it) => (!it.paid && it.selected ? s + it.unitPrice * it.qty : s), 0);
  }
  function sumAll(order) {
    return order.items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  }

  function tableStatus(tableId) {
    const order = state.orders[tableId];
    if (!order || order.items.length === 0) return "empty";
    if (order.splitMode && order.items.some((it) => it.paid)) return "split";
    return "occupied";
  }

  // ---------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------
  function saveStateNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      flashSaveIndicator();
    } catch (e) {
      /* storage unavailable - fail silently, app still works in-memory */
    }
  }
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveStateNow, 350);
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.orders) return parsed;
      }
    } catch (e) {
      /* ignore corrupt storage */
    }
    return null;
  }
  function flashSaveIndicator() {
    const el = document.getElementById("save-indicator");
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 600);
  }

  // ---------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------
  let toastTimer = null;
  function toast(msg, ms) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms || 2200);
  }

  // ---------------------------------------------------------------
  // Confirm modal (generic)
  // ---------------------------------------------------------------
  function confirmDialog(title, text, onConfirm) {
    const overlay = document.getElementById("confirm-modal");
    document.getElementById("confirm-modal-title").textContent = title;
    document.getElementById("confirm-modal-text").textContent = text;
    overlay.classList.remove("hidden");
    const okBtn = document.getElementById("confirm-modal-ok");
    const cancelBtn = document.getElementById("confirm-modal-cancel");
    function close() {
      overlay.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
    }
    function onOk() {
      close();
      onConfirm();
    }
    function onCancel() {
      close();
    }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  }

  // ---------------------------------------------------------------
  // Variant modal (e.g. Klein/Groß soups)
  // ---------------------------------------------------------------
  function variantDialog(item, onPick) {
    const overlay = document.getElementById("variant-modal");
    document.getElementById("variant-modal-title").textContent = item.code + " – " + item.name;
    const actions = document.getElementById("variant-modal-actions");
    actions.innerHTML = "";
    item.variants.forEach((v) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-accent";
      btn.textContent = v.label + " – " + euro(v.price);
      btn.addEventListener("click", () => {
        overlay.classList.add("hidden");
        onPick(v);
      });
      actions.appendChild(btn);
    });
    overlay.classList.remove("hidden");
    document.getElementById("variant-modal-cancel").onclick = () => overlay.classList.add("hidden");
  }

  // ---------------------------------------------------------------
  // Order mutation
  // ---------------------------------------------------------------
  function addLine(tableId, def) {
    const order = ensureOrder(tableId);
    if (!order.splitMode) {
      const existing = order.items.find(
        (it) => !it.paid && !it.custom && it.code === def.code && it.variantLabel === (def.variantLabel || null)
      );
      if (existing) {
        existing.qty += 1;
        order.updatedAt = Date.now();
        scheduleSave();
        renderOrder(tableId);
        renderFloor();
        toast("Menge erhöht: " + existing.name);
        return;
      }
    }
    order.items.push({
      uid: uid(),
      code: def.code || null,
      name: def.name,
      unitPrice: def.unitPrice,
      qty: 1,
      paid: false,
      selected: false,
      variantLabel: def.variantLabel || null,
      custom: !!def.custom,
    });
    order.updatedAt = Date.now();
    scheduleSave();
    renderOrder(tableId);
    renderFloor();
    toast("Hinzugefügt: " + (def.code ? def.code + " – " : "") + def.name);
  }

  function changeQty(tableId, itemUid, delta) {
    const order = state.orders[tableId];
    if (!order) return;
    const it = order.items.find((x) => x.uid === itemUid);
    if (!it || it.paid) return;
    it.qty = Math.max(1, it.qty + delta);
    order.updatedAt = Date.now();
    scheduleSave();
    renderOrder(tableId);
    renderFloor();
  }

  function removeLine(tableId, itemUid) {
    const order = state.orders[tableId];
    if (!order) return;
    order.items = order.items.filter((x) => x.uid !== itemUid);
    order.updatedAt = Date.now();
    scheduleSave();
    renderOrder(tableId);
    renderFloor();
  }

  function toggleSelected(tableId, itemUid, val) {
    const order = state.orders[tableId];
    if (!order) return;
    const it = order.items.find((x) => x.uid === itemUid);
    if (!it || it.paid) return;
    it.selected = val;
    updateOrderBottomBar(tableId);
  }

  function setSplitMode(tableId, on) {
    const order = ensureOrder(tableId);
    order.splitMode = on;
    if (!on) order.items.forEach((it) => (it.selected = false));
    scheduleSave();
    renderOrder(tableId);
    renderFloor();
  }

  function clearTable(tableId) {
    delete state.orders[tableId];
    scheduleSave();
    renderFloor();
  }

  function paySelected(tableId) {
    const order = state.orders[tableId];
    if (!order) return;
    const toPay = order.items.filter((it) => !it.paid && it.selected);
    if (toPay.length === 0) return;
    const amount = toPay.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    toPay.forEach((it) => {
      it.paid = true;
      it.selected = false;
    });
    order.updatedAt = Date.now();
    const allPaid = order.items.every((it) => it.paid);
    scheduleSave();
    if (allPaid) {
      const label = tableLabel(tableId);
      delete state.orders[tableId];
      scheduleSave();
      toast(label + " komplett bezahlt – " + euro(sumOfList(toPay.concat(order.items))));
      renderFloor();
      showView("view-floor");
    } else {
      toast("Teilzahlung erhalten: " + euro(amount));
      renderOrder(tableId);
      renderFloor();
    }
  }

  function sumOfList(list) {
    // not used for accuracy beyond toast text; kept simple
    return list.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  }

  function payFull(tableId) {
    const order = state.orders[tableId];
    if (!order || order.items.length === 0) return;
    const amount = sumUnpaid(order);
    const label = tableLabel(tableId);
    delete state.orders[tableId];
    scheduleSave();
    toast(label + " bezahlt – " + euro(amount));
    renderFloor();
    if (currentTableId === tableId) showView("view-floor");
  }

  function tableLabel(tableId) {
    const t = TABLES.find((x) => x.id === tableId);
    return t ? t.label : tableId;
  }

  // ---------------------------------------------------------------
  // Floor plan rendering
  // ---------------------------------------------------------------
  const holdCancelers = {};

  function renderFloor() {
    const grids = {
      out: document.getElementById("grid-outdoor"),
      a: document.getElementById("grid-indoor-a"),
      b: document.getElementById("grid-indoor-b"),
      c: document.getElementById("grid-indoor-c"),
      d: document.getElementById("grid-indoor-d"),
      ta: document.getElementById("grid-takeaway"),
    };
    Object.values(grids).forEach((g) => (g.innerHTML = ""));

    TABLES.forEach((table) => {
      const grid = grids[table.col];
      if (!grid) return;
      grid.appendChild(createTableCard(table));
    });
  }

  function createTableCard(table) {
    const status = tableStatus(table.id);
    const order = state.orders[table.id];
    const shape = table.seats === 4 ? "shape-rect" : table.seats === 2 ? "shape-square" : "shape-ticket";
    const card = document.createElement("button");
    card.className = "table-card " + shape + " status-" + status;
    card.type = "button";
    card.dataset.tableId = table.id;

    const fill = document.createElement("div");
    fill.className = "hold-fill";
    card.appendChild(fill);

    const hint = document.createElement("div");
    hint.className = "hold-hint";
    hint.textContent = "Bezahlt...";
    card.appendChild(hint);

    const name = document.createElement("div");
    name.className = "t-name";
    name.textContent = table.label;
    card.appendChild(name);

    if (table.seats > 0) {
      const seats = document.createElement("div");
      seats.className = "t-seats";
      seats.textContent = table.seats + " Plätze";
      card.appendChild(seats);
    }

    const total = document.createElement("div");
    total.className = "t-total";
    total.textContent = order && order.items.length > 0 ? euro(sumUnpaid(order)) : "–";
    card.appendChild(total);

    const statusEl = document.createElement("div");
    statusEl.className = "t-status";
    statusEl.textContent = status === "empty" ? "Frei" : status === "split" ? "Teilzahlung" : "Belegt";
    card.appendChild(statusEl);

    attachCardHandlers(card, table, status);
    return card;
  }

  function attachCardHandlers(card, table, status) {
    if (status === "empty") {
      card.addEventListener("click", () => openOrder(table.id));
      return;
    }
    const fill = card.querySelector(".hold-fill");
    let done = false;
    let holding = false;

    function cleanup(resetFast) {
      card.classList.remove("holding");
      fill.style.transition = resetFast ? "width 150ms ease" : "width 150ms ease";
      fill.style.width = "0%";
      holding = false;
    }

    function startHold() {
      done = false;
      holding = true;
      card.classList.add("holding");
      fill.style.transition = "none";
      fill.style.width = "0%";
      // force reflow so the transition below actually animates from 0
      void fill.offsetWidth;
      fill.style.transition = "width " + HOLD_MS + "ms linear";
      fill.style.width = "100%";
      holdCancelers[table.id] = setTimeout(() => {
        done = true;
        cleanup(true);
        if (navigator.vibrate) navigator.vibrate([40, 40, 80]);
        payFull(table.id);
      }, HOLD_MS);
    }

    function cancelHold(openAfter) {
      if (done) return;
      clearTimeout(holdCancelers[table.id]);
      cleanup(false);
      if (openAfter) openOrder(table.id);
    }

    card.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      startHold();
    });
    card.addEventListener("pointerup", () => cancelHold(true));
    card.addEventListener("pointerleave", () => cancelHold(false));
    card.addEventListener("pointercancel", () => cancelHold(false));
  }

  // ---------------------------------------------------------------
  // Order view rendering
  // ---------------------------------------------------------------
  function showView(id) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  function openOrder(tableId) {
    currentTableId = tableId;
    const table = TABLES.find((t) => t.id === tableId);
    document.getElementById("order-table-name").textContent = table.label;
    document.getElementById("order-table-seats").textContent = table.seats > 0 ? table.seats + " Plätze" : "Abholung";
    document.getElementById("search-input").value = "";
    document.getElementById("custom-name").value = "";
    document.getElementById("custom-price").value = "";
    renderSearchResults("");
    renderCategoryBrowser();
    renderOrder(tableId);
    showView("view-order");
  }

  function renderOrder(tableId) {
    const order = ensureOrder(tableId);
    document.getElementById("chk-split").checked = order.splitMode;
    const list = document.getElementById("receipt-list");
    list.classList.toggle("split-active", order.splitMode);
    list.innerHTML = "";

    const emptyMsg = document.getElementById("receipt-empty");
    emptyMsg.classList.toggle("show", order.items.length === 0);

    order.items.forEach((it) => {
      list.appendChild(renderReceiptRow(tableId, it));
    });

    document.getElementById("order-total-value").innerHTML = euro(sumUnpaid(order)).replace(" ", "&nbsp;");
    updateOrderBottomBar(tableId);
  }

  function renderReceiptRow(tableId, it) {
    const li = document.createElement("li");
    li.className = "receipt-item" + (it.paid ? " paid" : "");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.className = "ri-check";
    chk.checked = !!it.selected;
    chk.disabled = it.paid;
    chk.addEventListener("change", () => toggleSelected(tableId, it.uid, chk.checked));
    li.appendChild(chk);

    const main = document.createElement("div");
    main.className = "ri-main";
    const nameLine = document.createElement("div");
    nameLine.className = "ri-name";
    nameLine.innerHTML = (it.code ? '<span class="ri-code">' + escapeHtml(it.code) + "</span>" : "") + escapeHtml(it.name) + (it.variantLabel ? " (" + escapeHtml(it.variantLabel) + ")" : "");
    main.appendChild(nameLine);
    const unitLine = document.createElement("div");
    unitLine.className = "ri-unit";
    unitLine.textContent = euro(it.unitPrice) + " / Stück";
    main.appendChild(unitLine);
    li.appendChild(main);

    if (!it.paid) {
      const qtyBox = document.createElement("div");
      qtyBox.className = "ri-qty-box";
      const minus = document.createElement("button");
      minus.className = "qty-btn";
      minus.type = "button";
      minus.textContent = "−";
      minus.addEventListener("click", () => changeQty(tableId, it.uid, -1));
      const qty = document.createElement("div");
      qty.className = "ri-qty";
      qty.textContent = it.qty;
      const plus = document.createElement("button");
      plus.className = "qty-btn";
      plus.type = "button";
      plus.textContent = "+";
      plus.addEventListener("click", () => changeQty(tableId, it.uid, 1));
      qtyBox.appendChild(minus);
      qtyBox.appendChild(qty);
      qtyBox.appendChild(plus);
      li.appendChild(qtyBox);
    }

    const lineTotal = document.createElement("div");
    lineTotal.className = "ri-line-total";
    lineTotal.textContent = euro(it.unitPrice * it.qty);
    li.appendChild(lineTotal);

    if (!it.paid) {
      const rm = document.createElement("button");
      rm.className = "ri-remove";
      rm.type = "button";
      rm.textContent = "✕";
      rm.addEventListener("click", () => removeLine(tableId, it.uid));
      li.appendChild(rm);
    }

    return li;
  }

  function updateOrderBottomBar(tableId) {
    const order = state.orders[tableId];
    if (!order) return;
    const infoEl = document.getElementById("bottom-info");
    const valueEl = document.getElementById("bottom-value");
    const payBtn = document.getElementById("btn-pay");

    if (order.splitMode) {
      const sel = sumSelected(order);
      infoEl.textContent = "Ausgewählt";
      valueEl.textContent = euro(sel);
      payBtn.textContent = "Bezahlen (Auswahl)";
      payBtn.disabled = sel === 0;
    } else {
      const total = sumUnpaid(order);
      infoEl.textContent = "Gesamtbetrag";
      valueEl.textContent = euro(total);
      payBtn.textContent = "Bezahlen";
      payBtn.disabled = total === 0;
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------------------------------------------------------------
  // Search / category browser
  // ---------------------------------------------------------------
  function searchMenu(query) {
    const q = MENU.normalize(query);
    if (!q) return [];
    const tokens = q.split(" ").filter(Boolean);
    const results = [];
    MENU.ITEMS.forEach((it) => {
      let score = -1;
      if (it._codeSearch === q) score = 0;
      else if (it._codeSearch.startsWith(q)) score = 1;
      else if (tokens.every((t) => it._search.indexOf(t) !== -1)) score = 2;
      if (score >= 0) results.push({ it, score });
    });
    results.sort((a, b) => a.score - b.score || a.it.code.localeCompare(b.it.code, "de"));
    return results.slice(0, 30).map((r) => r.it);
  }

  function renderSearchResults(query) {
    const box = document.getElementById("search-results");
    box.innerHTML = "";
    if (!query.trim()) return;
    const matches = searchMenu(query);
    if (matches.length === 0) {
      const none = document.createElement("div");
      none.className = "receipt-empty show";
      none.style.padding = "0.6rem 0";
      none.textContent = "Kein Treffer – unten als sonstigen Posten hinzufügen?";
      box.appendChild(none);
      return;
    }
    matches.forEach((it) => box.appendChild(renderMenuRow(it)));
  }

  function renderMenuRow(it) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "menu-row";
    row.innerHTML =
      '<span class="mr-code">' + escapeHtml(it.code) + "</span>" +
      '<span class="mr-name">' + escapeHtml(it.name) + "</span>" +
      '<span class="mr-price">' + (it.variants ? "ab " + euro(Math.min(...it.variants.map((v) => v.price))) : euro(it.price)) + "</span>";
    row.addEventListener("click", () => {
      if (!currentTableId) return;
      if (it.variants) {
        variantDialog(it, (v) => {
          addLine(currentTableId, { code: it.code, name: it.name, unitPrice: v.price, variantLabel: v.label });
        });
      } else {
        addLine(currentTableId, { code: it.code, name: it.name, unitPrice: it.price });
      }
    });
    return row;
  }

  function renderCategoryBrowser() {
    const box = document.getElementById("category-browser");
    box.innerHTML = "";
    MENU.CATEGORIES.forEach((cat) => {
      const items = MENU.ITEMS.filter((it) => it.cat === cat.key);
      if (items.length === 0) return;
      const block = document.createElement("div");
      block.className = "cat-block";
      const head = document.createElement("button");
      head.type = "button";
      head.className = "cat-head";
      head.innerHTML = "<span>" + escapeHtml(cat.label) + "</span><span class=\"chev\">›</span>";
      const itemsWrap = document.createElement("div");
      itemsWrap.className = "cat-items";
      items.forEach((it) => itemsWrap.appendChild(renderMenuRow(it)));
      head.addEventListener("click", () => block.classList.toggle("open"));
      block.appendChild(head);
      block.appendChild(itemsWrap);
      box.appendChild(block);
    });
  }

  // ---------------------------------------------------------------
  // Custom item input (auto period -> comma)
  // ---------------------------------------------------------------
  function attachAutoComma(input) {
    input.addEventListener("input", () => {
      if (input.value.indexOf(".") !== -1) {
        const pos = input.selectionStart;
        input.value = input.value.replace(/\./g, ",");
        try {
          input.setSelectionRange(pos, pos);
        } catch (e) {
          /* some input types don't support selection range */
        }
      }
    });
  }

  // ---------------------------------------------------------------
  // Wire up static UI
  // ---------------------------------------------------------------
  function wireUi() {
    document.getElementById("btn-back").addEventListener("click", () => {
      showView("view-floor");
      currentTableId = null;
    });

    document.getElementById("search-input").addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
    document.getElementById("btn-clear-search").addEventListener("click", () => {
      document.getElementById("search-input").value = "";
      renderSearchResults("");
    });

    document.getElementById("chk-split").addEventListener("change", (e) => {
      if (!currentTableId) return;
      setSplitMode(currentTableId, e.target.checked);
    });

    document.getElementById("btn-clear-table").addEventListener("click", () => {
      if (!currentTableId) return;
      const order = state.orders[currentTableId];
      if (!order || order.items.length === 0) {
        showView("view-floor");
        return;
      }
      confirmDialog(
        "Tisch leeren?",
        "Alle Artikel dieser Bestellung werden entfernt, ohne dass bezahlt wird. Das kann nicht rückgängig gemacht werden.",
        () => {
          clearTable(currentTableId);
          showView("view-floor");
        }
      );
    });

    document.getElementById("btn-pay").addEventListener("click", () => {
      if (!currentTableId) return;
      const order = state.orders[currentTableId];
      if (!order) return;
      if (order.splitMode) {
        paySelected(currentTableId);
      } else {
        payFull(currentTableId);
      }
    });

    const customPriceInput = document.getElementById("custom-price");
    attachAutoComma(customPriceInput);

    document.getElementById("btn-add-custom").addEventListener("click", () => {
      if (!currentTableId) return;
      const nameInput = document.getElementById("custom-name");
      const priceInput = document.getElementById("custom-price");
      const name = nameInput.value.trim();
      const cents = parseGermanMoney(priceInput.value);
      if (!name) {
        toast("Bitte eine Bezeichnung eingeben");
        nameInput.focus();
        return;
      }
      if (isNaN(cents) || cents < 0) {
        toast("Bitte einen gültigen Betrag eingeben");
        priceInput.focus();
        return;
      }
      addLine(currentTableId, { name, unitPrice: cents, custom: true });
      nameInput.value = "";
      priceInput.value = "";
      nameInput.focus();
    });
  }

  // ---------------------------------------------------------------
  // Clock
  // ---------------------------------------------------------------
  function tickClock() {
    const el = document.getElementById("clock");
    el.textContent = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }

  // ---------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------
  function boot() {
    const restored = loadState();
    if (restored) {
      state = restored;
      toast("Letzter Stand wiederhergestellt");
    }
    wireUi();
    renderFloor();
    tickClock();
    setInterval(tickClock, 15000);

    // Autosave every 30s regardless of activity
    setInterval(saveStateNow, 30000);
    // Save immediately when app is minimized / tab hidden / closed
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveStateNow();
    });
    window.addEventListener("pagehide", saveStateNow);
    window.addEventListener("beforeunload", saveStateNow);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
