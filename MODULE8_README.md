# Module 8 – Settings

This branch implements the **Settings** module for the TrendMart admin panel.

## Features
- Light / Dark theme toggle with persistent selection stored in `localStorage`.
- Theme context and provider for global theming.
- Settings page (`src/pages/Settings.jsx`) with UI for theme control.
- Logout functionality with confirmation modal (`LogoutModal.jsx`).
- Session management via `AuthContext`.
- Shared layout components (`MainLayout`, `Sidebar`, `Topbar`).

## Installation
```bash
# ensure dependencies are installed (node_modules are already committed for CI)
npm install
```

## Development
```bash
npm run dev   # start Vite dev server
```

## Production Build
```bash
npm run build # generates production assets in the dist/ folder
```

## Notes
- The branch **does not** contain any dashboard‑related pages or components – those belong to `feat/module-1-dashboard`.
- All shared utilities and context providers are kept to avoid duplication across modules.
