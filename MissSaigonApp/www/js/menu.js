/* Miss Saigon – Menu data
   Transcribed from: MissSaigon_A3_8SeitigZickZag_105x297Flyer_Ver3_09.05.2026.pdf (gültig ab Mai 2026)
   Prices stored in CENTS (integers) to avoid floating point errors.
   `variants` is used for items that have more than one price (e.g. Klein/Groß soups).
   `aliases` are extra search tokens so staff can type alternative spellings
   (e.g. typing "V7 Garnelen" should find "V7a Sommerrollen mit Garnelen").
*/

(function (global) {
  "use strict";

  // helper: euros -> cents
  const c = (euros) => Math.round(euros * 100);

  /** @typedef {{code:string,name:string,price?:number,variants?:{label:string,price:number}[],aliases?:string[],cat:string}} MenuItem */

  /** @type {{key:string,label:string}[]} */
  const CATEGORIES = [
    { key: "mittag", label: "Mittagstisch (Mo–Fr 11:30–15:00)" },
    { key: "vegan", label: "Vegan Food" },
    { key: "curry", label: "Curry Spezialität" },
    { key: "curryzus", label: "Curry-Zusätze" },
    { key: "viet", label: "Vietnamesische Gerichte" },
    { key: "salat", label: "Salat" },
    { key: "reisband", label: "Gebratene Reisbandnudeln" },
    { key: "vorspeise", label: "Vorspeisen" },
    { key: "suppen", label: "Suppen (Klein/Groß)" },
    { key: "nudelnreis", label: "Gebratene Nudeln & Reis" },
    { key: "backhuhn", label: "Gebackenes Huhn mit Reis" },
    { key: "brathuhn", label: "Gebratenes Huhn mit Reis" },
    { key: "backente", label: "Gebackene Ente mit Reis" },
    { key: "garnelen", label: "Gebratene Garnelen mit Reis" },
    { key: "vegetarisch", label: "Vegetarisches Wok-Gemüse mit Reis" },
    { key: "glasnudeln", label: "Gebratene Glasnudeln" },
    { key: "nachtisch", label: "Nachtisch" },
    { key: "extras", label: "Extras" },
    { key: "getraenke", label: "Getränke" },
  ];

  /** @type {MenuItem[]} */
  const ITEMS = [
    // ---------------- Mittagstisch ----------------
    { cat: "mittag", code: "M1", name: "Hongkong-Huhn (ohne versch. Gemüse)", price: c(7.9) },
    { cat: "mittag", code: "M2", name: "Java-Huhn (ohne versch. Gemüse)", price: c(7.9) },
    { cat: "mittag", code: "M3", name: "Huhn Szechuan-Art", price: c(8.5) },
    { cat: "mittag", code: "M4", name: "Hühnerfleisch Chop-Suey", price: c(8.5) },
    { cat: "mittag", code: "M5", name: "Hühnerfleisch gebraten, Schwarzbohnen", price: c(8.5) },
    { cat: "mittag", code: "M6", name: "Hühnerfleisch gebraten, Cashewnüsse", price: c(9.5) },
    { cat: "mittag", code: "M7", name: "Ente Hongkong-Art (ohne versch. Gemüse)", price: c(10.5) },
    { cat: "mittag", code: "M8", name: "Ente Shanghai", price: c(10.9) },
    { cat: "mittag", code: "M9", name: "Ente Indonesia (ohne versch. Gemüse)", price: c(10.9) },
    { cat: "mittag", code: "M10", name: "Ente Canton-Art", price: c(10.9) },
    { cat: "mittag", code: "M11", name: "Ente Szechuan-Art", price: c(10.9) },
    { cat: "mittag", code: "M12", name: "Tom-Yam Tofu", price: c(8.5) },
    { cat: "mittag", code: "M13", name: "Laos Eintopf", price: c(8.5) },
    { cat: "mittag", code: "M14", name: "Hühnerfleisch Suppe", price: c(8.5) },
    { cat: "mittag", code: "M15", name: "Schrimps Bali-Art", price: c(10.5), aliases: ["garnelen"] },
    { cat: "mittag", code: "M16", name: "Schrimps Szechuan-Art", price: c(10.5), aliases: ["garnelen"] },
    { cat: "mittag", code: "M17", name: "Schrimps Chop-Suey", price: c(10.5), aliases: ["garnelen"] },
    { cat: "mittag", code: "M18", name: "Nudeln Szechuan", price: c(6.0) },
    { cat: "mittag", code: "M19", name: "Thai Nudeln", price: c(6.0) },
    { cat: "mittag", code: "M20", name: "Chinanudeln mit Hühnerfleisch", price: c(8.0) },
    { cat: "mittag", code: "M21", name: "Nudeln Szechuan mit Hühnerfleisch", price: c(8.5) },
    { cat: "mittag", code: "M22", name: "Gemüse Shanghai-Art", price: c(8.5) },
    { cat: "mittag", code: "M23", name: "Fitnessteller", price: c(8.5) },
    { cat: "mittag", code: "M24", name: "Buddha-Teller mit Tofu", price: c(8.5) },
    { cat: "mittag", code: "M-Nudel", name: "Nudelbeilage anstatt Reis (Zuschlag)", price: c(0.5) },

    // ---------------- Vegan Food (alle 8,50 €) ----------------
    { cat: "vegan", code: "Vegan1", name: "Gemüse Shanghai-Art, dunkle Soße", price: c(8.5), aliases: ["vegan 1"] },
    { cat: "vegan", code: "Vegan2", name: "Gemüse Mongolei-Art, sehr scharf", price: c(8.5), aliases: ["vegan 2"] },
    { cat: "vegan", code: "Vegan3", name: "Gemüse Bombay-Art, Kormasoße/Kokosmilch/Rosinen", price: c(8.5), aliases: ["vegan 3"] },
    { cat: "vegan", code: "Vegan4", name: "Gemüse Indien-Art, Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 4"] },
    { cat: "vegan", code: "Vegan5", name: "Gemüse Sri Lanka-Art, Bhuma Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 5"] },
    { cat: "vegan", code: "Vegan6", name: "Gemüse Bali-Art, rotes Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 6"] },
    { cat: "vegan", code: "Vegan7", name: "Gemüse Thailand-Art, grünes Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 7"] },
    { cat: "vegan", code: "Vegan8", name: "Gemüse Phuket-Art, Ananas süß-pikant", price: c(8.5), aliases: ["vegan 8"] },
    { cat: "vegan", code: "Vegan9", name: "Gemüse Masama-Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 9"] },
    { cat: "vegan", code: "Vegan10", name: "Gemüse Singapur-Art, Malacca-Nyonya-Rotcurry", price: c(8.5), aliases: ["vegan 10"] },
    { cat: "vegan", code: "Vegan11", name: "Gemüse Hongkong-Art, Ananas süß-sauer", price: c(8.5), aliases: ["vegan 11"] },
    { cat: "vegan", code: "Vegan12", name: "Gemüse Mango-Curry, süß", price: c(8.5), aliases: ["vegan 12"] },
    { cat: "vegan", code: "Vegan13", name: "Gemüse Malaysia-Art, Laksa-Curry & Kokosmilch", price: c(8.5), aliases: ["vegan 13"] },
    { cat: "vegan", code: "Vegan-Tofu", name: "Vegan: mit Tofu (Zuschlag)", price: c(1.0), aliases: ["vegan tofu"] },

    // ---------------- Curry Spezialität (alle 8,50 €, Reis oder Chinanudeln) ----------------
    { cat: "curry", code: "Curry1", name: "Thailand Grün-Curry", price: c(8.5), aliases: ["curry 1"] },
    { cat: "curry", code: "Curry2", name: "Mango Gelb-Curry, süß", price: c(8.5), aliases: ["curry 2"] },
    { cat: "curry", code: "Curry3", name: "Malaysia Laksa-Curry", price: c(8.5), aliases: ["curry 3"] },
    { cat: "curry", code: "Curry4", name: "Singapur Nyonya-Curry", price: c(8.5), aliases: ["curry 4"] },
    { cat: "curry", code: "Curry5", name: "Masaman-Curry", price: c(8.5), aliases: ["curry 5"] },
    { cat: "curry", code: "Curry6", name: "India Tikka Masala-Curry", price: c(8.5), aliases: ["curry 6"] },
    { cat: "curry", code: "Curry7", name: "Bombay Korma-Curry", price: c(8.5), aliases: ["curry 7"] },
    { cat: "curry", code: "Curry8", name: "Mongolai-Curry", price: c(8.5), aliases: ["curry 8"] },
    { cat: "curry", code: "Curry9", name: "Tibet-Curry & Kokosmilch", price: c(8.5), aliases: ["curry 9"] },
    { cat: "curry", code: "Curry10", name: "Sri Lanka-Curry", price: c(8.5), aliases: ["curry 10"] },

    { cat: "curryzus", code: "CZ-Tofu", name: "Curry-Zusatz: mit Tofu", price: c(1.0) },
    { cat: "curryzus", code: "CZ-Huhn", name: "Curry-Zusatz: geback./gebrat. Huhn", price: c(2.0) },
    { cat: "curryzus", code: "CZ-Garnelen", name: "Curry-Zusatz: mit Garnelen", price: c(3.0), aliases: ["shrimps"] },
    { cat: "curryzus", code: "CZ-Ente", name: "Curry-Zusatz: mit gebackener Ente", price: c(4.0) },

    // ---------------- Vietnamesische Gerichte ----------------
    { cat: "viet", code: "V1", name: "Pho Ga", price: c(8.5) },
    { cat: "viet", code: "V2", name: "Pho Tofu", price: c(8.5) },
    { cat: "viet", code: "V5", name: "Bun Ga", price: c(12.0) },
    { cat: "viet", code: "V5A", name: "Bun Tom", price: c(12.0), aliases: ["garnelen"] },
    { cat: "viet", code: "V5B", name: "Bun Cha Lua", price: c(12.0) },
    { cat: "viet", code: "V6", name: "Bun Nem", price: c(11.5) },
    { cat: "viet", code: "V6A", name: "Bun Tofu", price: c(12.0) },
    { cat: "viet", code: "V7a", name: "Sommerrollen mit Garnelen", price: c(7.0), aliases: ["v7 garnelen", "v7 a"] },
    { cat: "viet", code: "V7b", name: "Sommerrollen mit Hühnerfleisch", price: c(7.0), aliases: ["v7 hühnerfleisch", "v7 huhn", "v7 b"] },
    { cat: "viet", code: "V7c", name: "Sommerrollen mit Tofu (auch vegan ohne Ei)", price: c(7.0), aliases: ["v7 tofu", "v7 c", "v7 vegan"] },

    // ---------------- Salat ----------------
    { cat: "salat", code: "Salat1", name: "Gemischter Salat", price: c(7.5), aliases: ["salat 1"] },
    { cat: "salat", code: "Salat2", name: "Tofu-Salat", price: c(9.5), aliases: ["salat 2"] },
    { cat: "salat", code: "Salat3", name: "Hühnerfleisch-Salat", price: c(9.5), aliases: ["salat 3"] },
    { cat: "salat", code: "Salat4", name: "Entenbrustsalat", price: c(12.0), aliases: ["salat 4"] },
    { cat: "salat", code: "Salat5", name: "Garnelensalat", price: c(12.0), aliases: ["salat 5"] },

    // ---------------- Gebratene Reisbandnudeln ----------------
    { cat: "reisband", code: "N1", name: "Reisbandnudeln vegetarisch", price: c(9.5) },
    { cat: "reisband", code: "N2", name: "Reisbandnudeln mit Tofu", price: c(10.5) },
    { cat: "reisband", code: "N3", name: "Reisbandnudeln mit Hühnerfleisch", price: c(10.5) },
    { cat: "reisband", code: "N5", name: "Reisbandnudeln mit Garnelen", price: c(12.0) },
    { cat: "reisband", code: "N6", name: "Reisbandnudeln mit Hühnerfleisch & Garnelen", price: c(12.5) },

    // ---------------- Vorspeisen ----------------
    { cat: "vorspeise", code: "11", name: "Mini-Frühlingsrollen (5 Stk.)", price: c(3.0) },
    { cat: "vorspeise", code: "11B", name: "Gemüse Gyoza (6 Stk.)", price: c(5.0) },
    { cat: "vorspeise", code: "11C", name: "Veg. Vietnam-Frühlingsrollen (2 Stk.)", price: c(5.0) },

    // ---------------- Suppen (Klein / Groß) ----------------
    { cat: "suppen", code: "S1", name: "Peking-Suppe", variants: [{ label: "Klein", price: c(3.5) }, { label: "Groß", price: c(7.0) }] },
    { cat: "suppen", code: "S2", name: "Gyoza-Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S3", name: "Vegetarische Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S4", name: "Tom-Yam Tofu Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S5", name: "Kokos-Tofu Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S6", name: "Kokos-Nudelsuppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S7", name: "Kokos-Vegetarische Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S8", name: "Nudelsuppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S9", name: "Hühnerfleischsuppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S10", name: "Tom-Yam Kung", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }], aliases: ["garnelen"] },
    { cat: "suppen", code: "S11", name: "Laos Eintopf Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S12", name: "Tom-Kagai Suppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },
    { cat: "suppen", code: "S13", name: "Garnelensuppe", variants: [{ label: "Klein", price: c(6.0) }, { label: "Groß", price: c(8.5) }] },

    // ---------------- Gebratene Nudeln & Reis ----------------
    { cat: "nudelnreis", code: "13", name: "Chinanudeln", price: c(5.0) },
    { cat: "nudelnreis", code: "13A", name: "Nudeln Indonesia", price: c(6.0) },
    { cat: "nudelnreis", code: "13B", name: "Nudeln Szechuan", price: c(6.0) },
    { cat: "nudelnreis", code: "13C", name: "Thai Nudeln", price: c(6.0) },
    { cat: "nudelnreis", code: "13D", name: "Java Nudeln", price: c(6.0) },
    { cat: "nudelnreis", code: "14", name: "Chinanudeln mit Hühnerfleisch (ohne Soße)", price: c(8.0) },
    { cat: "nudelnreis", code: "14A", name: "Nudeln Vietnam mit Gemüse & Ei", price: c(7.0) },
    { cat: "nudelnreis", code: "14B", name: "Nudeln Szechuan mit Hühnerfleisch & Gemüse", price: c(8.5) },
    { cat: "nudelnreis", code: "14C", name: "Thai Nudeln mit Hühnerfleisch & Gemüse", price: c(8.5) },
    { cat: "nudelnreis", code: "14D", name: "Java Nudeln mit Hühnerfleisch & Gemüse", price: c(8.5) },
    { cat: "nudelnreis", code: "16", name: "Bakmi Goreng", price: c(9.0) },
    { cat: "nudelnreis", code: "17", name: "Bakmi Goreng mit Garnelen & Gemüse", price: c(10.5) },
    { cat: "nudelnreis", code: "18", name: "Nudeln mit Tofu & Gemüse", price: c(7.0) },
    { cat: "nudelnreis", code: "19", name: "Gebratener Reis mit Hühnerfleisch", price: c(8.5) },
    { cat: "nudelnreis", code: "19A", name: "Vegetarischer gebratener Reis", price: c(8.0) },
    { cat: "nudelnreis", code: "19B", name: "Veg. gebratener Reis mit Tofu", price: c(8.5) },
    { cat: "nudelnreis", code: "20", name: "Gebratener Reis mit Garnelen", price: c(10.5) },

    // ---------------- Gebackenes Huhn mit Reis ----------------
    { cat: "backhuhn", code: "21", name: "Hongkong-Huhn", price: c(7.9) },
    { cat: "backhuhn", code: "21A", name: "Hongkong-Huhn & Chinanudeln", price: c(7.9) },
    { cat: "backhuhn", code: "22", name: "Java-Huhn mit Erdnuss-Soße, süß", price: c(8.5) },
    { cat: "backhuhn", code: "23", name: "Huhn Brokkoli", price: c(8.5) },
    { cat: "backhuhn", code: "24", name: "Huhn Bali-Art", price: c(8.5) },
    { cat: "backhuhn", code: "24A", name: "Huhn Thailand-Art", price: c(8.5) },
    { cat: "backhuhn", code: "24B", name: "Huhn Massaman", price: c(8.5) },
    { cat: "backhuhn", code: "25", name: "Huhn Mango", price: c(8.5) },
    { cat: "backhuhn", code: "26", name: "Huhn Szechuan-Art", price: c(8.5) },
    { cat: "backhuhn", code: "27", name: "Huhn Canton-Art", price: c(8.5) },
    { cat: "backhuhn", code: "28", name: "Huhn Cashewnüssen", price: c(9.5) },
    { cat: "backhuhn", code: "29", name: "Huhn Saigon-Art", price: c(8.5) },
    { cat: "backhuhn", code: "21x", name: "Extra Portion gebackenes Huhn", price: c(4.5) },

    // ---------------- Gebratenes Huhn mit Reis ----------------
    { cat: "brathuhn", code: "30", name: "Hühnerfleisch Chop-Suey", price: c(8.5) },
    { cat: "brathuhn", code: "30A", name: "Hühnerfleisch Zwiebeln", price: c(8.5) },
    { cat: "brathuhn", code: "31", name: "Hühnerfleisch Schwarzbohnen", price: c(8.5) },
    { cat: "brathuhn", code: "32", name: "Hühnerfleisch Curry", price: c(8.5) },
    { cat: "brathuhn", code: "33", name: "Hühnerfleisch Brokkoli", price: c(8.5) },
    { cat: "brathuhn", code: "34", name: "Hühnerfleisch Cashewnüssen", price: c(9.5) },
    { cat: "brathuhn", code: "35", name: "Hühnerfleisch Mango-Soße, süß", price: c(8.5) },
    { cat: "brathuhn", code: "36", name: "Hühnerfleisch Erdnuss-Soße, süß", price: c(8.5) },
    { cat: "brathuhn", code: "37", name: "Hühnerfleisch Szechuan-Art", price: c(8.5) },
    { cat: "brathuhn", code: "38", name: "Hühnerfleisch Indonesia", price: c(8.5) },
    { cat: "brathuhn", code: "30x", name: "Extra Portion gebratenes Huhn", price: c(4.5) },

    // ---------------- Gebackene Ente mit Reis ----------------
    { cat: "backente", code: "39", name: "Hongkong-Ente", price: c(10.5) },
    { cat: "backente", code: "39A", name: "Hongkong-Ente & Chinanudeln", price: c(10.5) },
    { cat: "backente", code: "40", name: "Ente Brokkoli", price: c(10.5) },
    { cat: "backente", code: "41", name: "Ente Shanghai", price: c(10.9) },
    { cat: "backente", code: "42", name: "Ente Bali-Art", price: c(10.9) },
    { cat: "backente", code: "44", name: "Ente Indonesia", price: c(10.9) },
    { cat: "backente", code: "45", name: "Ente Mango", price: c(10.9) },
    { cat: "backente", code: "46", name: "Ente Thailand-Art", price: c(10.9) },
    { cat: "backente", code: "47", name: "Ente Canton-Art", price: c(10.9) },
    { cat: "backente", code: "48", name: "Ente Cashewnüssen", price: c(11.9) },
    { cat: "backente", code: "49", name: "Ente Schwarzbohnen", price: c(10.9) },
    { cat: "backente", code: "50", name: "Ente Szechuan-Art", price: c(10.9) },
    { cat: "backente", code: "50B", name: "Ente Massaman", price: c(11.9) },
    { cat: "backente", code: "39x", name: "Extra Portion gebackene Ente", price: c(6.5) },

    // ---------------- Gebratene Garnelen mit Reis ----------------
    { cat: "garnelen", code: "55", name: "Shrimps Mango", price: c(10.5) },
    { cat: "garnelen", code: "56", name: "Shrimps Chop-Suey", price: c(10.5) },
    { cat: "garnelen", code: "57", name: "Shrimps Bali-Art", price: c(10.5) },
    { cat: "garnelen", code: "58", name: "Shrimps Szechuan-Art", price: c(10.5) },
    { cat: "garnelen", code: "55x", name: "Extra Portion Garnelen", price: c(5.0) },

    // ---------------- Vegetarisches Wok-Gemüse mit Reis ----------------
    { cat: "vegetarisch", code: "70", name: "Fitnessteller", price: c(8.5) },
    { cat: "vegetarisch", code: "70A", name: "Gemüse Shanghai-Art", price: c(8.5) },
    { cat: "vegetarisch", code: "70B", name: "Gemüse Erdnuss mit Tofu", price: c(8.5) },
    { cat: "vegetarisch", code: "72", name: "Gemüse Brokkoli", price: c(8.5) },
    { cat: "vegetarisch", code: "73", name: "Buddha-Teller", price: c(8.5) },
    { cat: "vegetarisch", code: "74", name: "Gemüse Bali-Art", price: c(8.5) },
    { cat: "vegetarisch", code: "75", name: "Gemüse Mango", price: c(8.5) },
    { cat: "vegetarisch", code: "75A", name: "Gemüse Massaman", price: c(9.5) },
    { cat: "vegetarisch", code: "75B", name: "Gemüse Cashewnüssen", price: c(9.5) },
    { cat: "vegetarisch", code: "75C", name: "Gemüse mit Tofu", price: c(9.5) },
    { cat: "vegetarisch", code: "70x", name: "Extra Portion Tofu", price: c(1.0) },

    // ---------------- Gebratene Glasnudeln ----------------
    { cat: "glasnudeln", code: "76", name: "Veg. Gebratene Glasnudeln", price: c(8.9) },
    { cat: "glasnudeln", code: "76A", name: "Gebratene Glasnudeln mit Hühnerfleisch", price: c(9.5) },
    { cat: "glasnudeln", code: "76B", name: "Gebratene Glasnudeln mit Tofu", price: c(9.5) },
    { cat: "glasnudeln", code: "76C", name: "Gebratene Glasnudeln mit Garnelen", price: c(11.5) },

    // ---------------- Nachtisch ----------------
    { cat: "nachtisch", code: "90", name: "Gebackene Banane mit Honig", price: c(4.0) },
    { cat: "nachtisch", code: "90A", name: "Knusprige Klebreisbanane mit Kokosmilch", price: c(4.0) },

    // ---------------- Extras ----------------
    { cat: "extras", code: "EX1", name: "Soße ohne Gemüse", price: c(1.0) },
    { cat: "extras", code: "EX2", name: "Gekochte Soße mit versch. Gemüse", price: c(3.5) },
    { cat: "extras", code: "EX3", name: "Extra Portion gekochter Reis", price: c(2.5) },
    { cat: "extras", code: "EX4", name: "Gebratener Reis oder Glasnudeln als Beilage", price: c(4.0) },
    { cat: "extras", code: "EX5", name: "Cashewnüsse", price: c(1.0) },

    // ---------------- Getränke (nicht auf der Karte) ----------------
    { cat: "getraenke", code: "G1", name: "Glas Softdrink 0,2l", price: c(1.5) },
    { cat: "getraenke", code: "G2", name: "Glas Softdrink 0,4l", price: c(3.0) },
    { cat: "getraenke", code: "G3", name: "Dose Softdrink / Flasche Apfelsaft / Ice Tea", price: c(2.5) },
    { cat: "getraenke", code: "G4", name: "Dose Asiasaft", price: c(3.0) },
    { cat: "getraenke", code: "G5", name: "Asia Bier", price: c(4.0) },
    { cat: "getraenke", code: "G6", name: "Becks / Vitamalz", price: c(2.5) },
    { cat: "getraenke", code: "G7", name: "Weißbier", price: c(3.0) },
    { cat: "getraenke", code: "G8", name: "Flasche Wasser", price: c(2.0) },
    { cat: "getraenke", code: "G9", name: "Tasse Tee / Kaffee", price: c(2.0) },
  ];

  // Precompute normalized search text for each item.
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  ITEMS.forEach((it) => {
    const parts = [it.code, it.name, ...(it.aliases || [])];
    it._search = normalize(parts.join(" "));
    it._codeSearch = normalize(it.code);
  });

  global.MissSaigonMenu = { CATEGORIES, ITEMS, normalize };
})(window);
