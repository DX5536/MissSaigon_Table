/* Miss Saigon - Seating plan data
   Derived from the restaurant's floor-plan sketch:
   - Blue rectangle = 4-seat table
   - Green square   = 2-seat table
   - Outdoor zone (left, blue background) has 3x 4-seat tables
   - Indoor zone (pink background) has 11 tables across 4 columns:
       a: green(2), blue(4), blue(4) stacked
       b: two blue(4) tables side by side at the top
       c: two blue(4) tables stacked, sitting lower / between column b's pair
       d: blue(4) on top, then three green(2) stacked
   - Plus 5 generic "Takeaway" slots (no seats) for to-go orders
*/
(function (global) {
  "use strict";

  const TABLES = [
    // Outdoor zone - 3x 4-seat tables
    { id: "O1", label: "Terrasse 1", zone: "outdoor", col: "out", seats: 4 },
    { id: "O2", label: "Terrasse 2", zone: "outdoor", col: "out", seats: 4 },
    { id: "O3", label: "Terrasse 3", zone: "outdoor", col: "out", seats: 4 },

    // Indoor column A (left-most indoor column)
    { id: "A1", label: "Tisch A1", zone: "indoor", col: "a", seats: 2 },
    { id: "A2", label: "Tisch A2", zone: "indoor", col: "a", seats: 4 },
    { id: "A3", label: "Tisch A3", zone: "indoor", col: "a", seats: 4 },

    // Indoor column B - top pair (two 4-seat tables side by side, as sketched)
    { id: "B1", label: "Tisch B1", zone: "indoor", col: "b", seats: 4 },
    { id: "B2", label: "Tisch B2", zone: "indoor", col: "b", seats: 4 },

    // Indoor column C - centre stack, sits lower / between B1 and B2
    { id: "C1", label: "Tisch C1", zone: "indoor", col: "c", seats: 4 },
    { id: "C2", label: "Tisch C2", zone: "indoor", col: "c", seats: 4 },

    // Indoor column D (right-most indoor column)
    { id: "D1", label: "Tisch D1", zone: "indoor", col: "d", seats: 4 },
    { id: "D2", label: "Tisch D2", zone: "indoor", col: "d", seats: 2 },
    { id: "D3", label: "Tisch D3", zone: "indoor", col: "d", seats: 2 },
    { id: "D4", label: "Tisch D4", zone: "indoor", col: "d", seats: 2 },

    // Takeaway slots
    { id: "TA1", label: "Takeout 1", zone: "takeaway", col: "ta", seats: 0 },
    { id: "TA2", label: "Takeout 2", zone: "takeaway", col: "ta", seats: 0 },
    { id: "TA3", label: "Takeout 3", zone: "takeaway", col: "ta", seats: 0 },
    { id: "TA4", label: "Takeout 4", zone: "takeaway", col: "ta", seats: 0 },
    { id: "TA5", label: "Takeout 5", zone: "takeaway", col: "ta", seats: 0 },
  ];

  global.MissSaigonTables = { TABLES };
})(window);
