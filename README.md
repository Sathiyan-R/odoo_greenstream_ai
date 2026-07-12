# GreenStream AI

## Introduction

GreenStream AI is a real-time environmental control tower and ESG command center. It combines live environmental telemetry, energy and carbon tracking, and governance/social reporting in a single dashboard. The project includes a React + Vite frontend, a Node/Express backend that can proxy or serve MySQL data, and utility modules for ESG scoring, gamification, and report generation.

## Key Features

- **Live Dashboard:** Real-time display of weather, AQI, energy usage, and anomaly alerts.
- **Environmental Map:** Interactive map view showing zone-level metrics and carbon footprints.
- **ESG Command Center:** Environmental, Social and Governance dashboards with scores, department rankings, and leaderboards.
- **Report Generation:** PDF export of ESG summaries and environmental reports (uses jsPDF).
- **Gamification:** Badges, challenges, leaderboards, and reward redemption flows to encourage sustainable behavior.
- **Carbon Accounting:** Emission factor tracking, carbon transactions, and simple carbon calculation utilities.
- **Notifications:** In-app notifications and email flag support for compliance and CSR updates.

## Where to find things

- Frontend: `src/` (React + Vite)
- Backend (MySQL API): `mysql-server/` (Node/Express)
- ESG helpers: `src/lib/esgData.ts` and `src/types/esg.ts`

## Quick start

1. Install dependencies in the frontend and backend folders.

Frontend:

```bash
cd greenstream-ai
npm install
npm run dev -- --host 0.0.0.0
```

Backend (example):

```bash
cd mysql-server
npm install
# set MYSQL_* env vars then
node server.js
```

## License

This repository is provided as-is for development and demonstration purposes.
