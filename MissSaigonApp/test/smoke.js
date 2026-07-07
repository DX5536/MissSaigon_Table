/* Smoke test: loads the app in jsdom (served over http) and exercises
   the core flows without needing a real browser.
   Run with: node test/smoke.js  (expects a static server at SMOKE_URL)
*/
const { JSDOM } = require("jsdom");

const APP_URL = process.env.SMOKE_URL || "http://localhost:8791/index.html";

(async () => {
  const errors = [];
  const dom = await JSDOM.fromURL(APP_URL, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.addEventListener("error", (e) => errors.push(e.error ? e.error.stack : e.message));
      window.navigator.vibrate = () => {};
    },
  });
  const { window } = dom;

  await new Promise((resolve) => {
    if (window.document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve);
  });
  await new Promise((r) => setTimeout(r, 50));

  function assert(cond, msg) {
    if (!cond) throw new Error("ASSERT FAILED: " + msg);
    console.log("OK  -", msg);
  }

  const doc = window.document;

  const cards = doc.querySelectorAll(".table-card");
  assert(cards.length === 19, "floor plan renders 19 cards (got " + cards.length + ")");

  const firstCard = doc.querySelector('.table-card[data-table-id="A2"]');
  assert(!!firstCard, "table A2 card exists");
  firstCard.dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  assert(doc.getElementById("view-order").classList.contains("active"), "order view opens on click");
  assert(doc.getElementById("order-table-name").textContent.includes("A2"), "header shows correct table");

  const searchInput = doc.getElementById("search-input");
  searchInput.value = "13";
  searchInput.dispatchEvent(new window.Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  const results = doc.querySelectorAll("#search-results .menu-row");
  assert(results.length > 0, "search for 13 returns results");
  const codes = Array.from(results).map((r) => r.querySelector(".mr-code").textContent);
  assert(codes[0] === "13", "exact code 13 ranked first, got: " + codes.slice(0, 5).join(","));
  results[0].dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  let receiptItems = doc.querySelectorAll("#receipt-list .receipt-item");
  assert(receiptItems.length === 1, "one line item added after selecting search result");
  assert(doc.getElementById("bottom-value").textContent.trim() === "5,00 €", "line total is 5,00 EUR for item 13");

  searchInput.value = "13";
  searchInput.dispatchEvent(new window.Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  doc.querySelectorAll("#search-results .menu-row")[0].dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  receiptItems = doc.querySelectorAll("#receipt-list .receipt-item");
  assert(receiptItems.length === 1, "adding same item again merges into one line instead of duplicating");
  assert(receiptItems[0].querySelector(".ri-qty").textContent === "2", "quantity is now 2");
  assert(doc.getElementById("bottom-value").textContent.trim() === "10,00 €", "total updated to 10,00 EUR");

  searchInput.value = "V7 Garnelen";
  searchInput.dispatchEvent(new window.Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  const v7results = doc.querySelectorAll("#search-results .menu-row");
  assert(v7results.length > 0, "V7 Garnelen alias search returns a result");
  assert(v7results[0].querySelector(".mr-code").textContent === "V7a", "V7 Garnelen resolves to V7a");

  searchInput.value = "S1";
  searchInput.dispatchEvent(new window.Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  doc.querySelectorAll("#search-results .menu-row")[0].dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  assert(!doc.getElementById("variant-modal").classList.contains("hidden"), "variant modal opens for S1");
  const variantBtns = doc.querySelectorAll("#variant-modal-actions .btn");
  assert(variantBtns.length === 2, "variant modal shows 2 size options");
  variantBtns[1].dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  assert(doc.getElementById("variant-modal").classList.contains("hidden"), "variant modal closes after pick");
  receiptItems = doc.querySelectorAll("#receipt-list .receipt-item");
  assert(receiptItems.length === 2, "soup line added as its own row");

  const customName = doc.getElementById("custom-name");
  const customPrice = doc.getElementById("custom-price");
  customName.value = "Trinkgeld";
  customName.dispatchEvent(new window.Event("input", { bubbles: true }));
  customPrice.value = "8.50";
  customPrice.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert(customPrice.value === "8,50", "period auto-converted to comma live, got " + customPrice.value);
  doc.getElementById("btn-add-custom").dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  receiptItems = doc.querySelectorAll("#receipt-list .receipt-item");
  assert(receiptItems.length === 3, "custom item added as new row");
  const lastRow = receiptItems[receiptItems.length - 1];
  assert(lastRow.querySelector(".ri-line-total").textContent.trim() === "8,50 €", "custom item price parsed as 8,50 EUR");

  assert(doc.getElementById("bottom-value").textContent.trim() === "25,50 €", "grand total is 25,50 EUR");
  assert(
    doc.getElementById("order-total-value").textContent.replace(/ /g, " ").trim() === "25,50 €",
    "header total matches"
  );

  doc.getElementById("chk-split").checked = true;
  doc.getElementById("chk-split").dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  const checkboxes = doc.querySelectorAll("#receipt-list .ri-check");
  assert(checkboxes.length === 3 && !checkboxes[0].disabled, "split mode reveals per-item checkboxes");
  checkboxes[2].checked = true;
  checkboxes[2].dispatchEvent(new window.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  assert(doc.getElementById("bottom-value").textContent.trim() === "8,50 €", "selected subtotal shows 8,50 EUR");
  assert(!doc.getElementById("btn-pay").disabled, "pay button enabled once something is selected");
  doc.getElementById("btn-pay").dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  const stillList = doc.querySelectorAll("#receipt-list .receipt-item");
  assert(stillList.length === 3, "table stays open after partial payment");
  assert(
    doc.getElementById("order-total-value").textContent.replace(/ /g, " ").trim() === "17,00 €",
    "remaining total after partial pay is 17,00 EUR"
  );

  const remainingChecks = doc.querySelectorAll("#receipt-list .ri-check:not(:disabled)");
  remainingChecks.forEach((cb) => {
    cb.checked = true;
    cb.dispatchEvent(new window.Event("change", { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 10));
  doc.getElementById("btn-pay").dispatchEvent(new window.Event("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  assert(doc.getElementById("view-floor").classList.contains("active"), "app returns to floor plan once table fully paid");
  const a2CardAfter = doc.querySelector('.table-card[data-table-id="A2"]');
  assert(a2CardAfter.querySelector(".t-status").textContent === "Frei", "table A2 shows Frei again after full payment");

  await new Promise((r) => setTimeout(r, 600));
  const raw = window.localStorage.getItem("missaigon_state_v1");
  assert(raw !== null && raw.indexOf("orders") !== -1, "state persisted to localStorage");

  if (errors.length) {
    console.error("Runtime errors captured during test:");
    errors.forEach((e) => console.error(e));
    process.exit(1);
  }

  console.log("All smoke tests passed.");
  process.exit(0);
})().catch((err) => {
  console.error("SMOKE TEST FAILURE:", err);
  process.exit(1);
});
