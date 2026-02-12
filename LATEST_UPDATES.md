# Frontend Refinement Updates

I have refined the frontend typography to match a more premium and aesthetic "Miamor Coffee" theme as requested.

## Typography Updates
1.  **Brand Font**: Swapped `Playfair Display` for **`Cinzel`** (a classic Roman serif) for the "MIAMOR" logo and main page titles (like "Tetapan Bilik", "Dashboard", "Kitchen Board").
2.  **Display Font**: Introduced **`DM Serif Display`** for large headings and sub-headers.
3.  **Body Font**: Swapped `Lato` for **`Urbanist`**, a modern, geometric sans-serif.

## Files Updated
*   `index.html`: Added new font imports.
*   `tailwind.config.js`: Updated font family definitions.
*   `Header.jsx` & `Sidebar.jsx`: Updated logos to `font-brand`.
*   `RoomManagement.jsx`: Updated "Tetapan Bilik" title.
*   `StaffDashboard.jsx`, `KitchenBoard.jsx`, `CustomerPage.jsx`: Updated main page titles and headers.

## Verification
You can verify the new look by running `npm run dev` and checking the headers and logos. The "Miamor" and "Tetapan Bilik" text should now stand out with the new `Cinzel` font.
