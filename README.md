# Interactive Dashboard

Stack: Vanilla JS + Chart.js (CDN)

Overview
- Simple dashboard with a time series chart and summary table.
- Filters for date range (3/6/12 months) and dataset toggles.
- No build step, runs directly in the browser.

Getting Started
- Open `src/index.html` in your browser.
- Or start a local server (optional):
  - PowerShell: `cd src; powershell -Command "Start-Process -FilePath msedge.exe -ArgumentList index.html"`
  - Python (if installed): `cd src && python -m http.server 8080`
  - Then visit `http://localhost:8080/index.html`.

Features
- Line chart of metrics per day with moving average.
- Toggle series: `Visits`, `Signups`, `Conversions`.
- Date range presets: 3, 6, 12 months.
- Summary table with totals and conversion rate.

Project Structure
- `src/index.html` – markup and controls.
- `src/styles.css` – basic styles.
- `src/main.js` – data generation, chart rendering, UI logic.

Notes
- Chart.js is pulled from CDN; no dependency installation required.
- Works offline once cached, but first load requires internet for CDN.
