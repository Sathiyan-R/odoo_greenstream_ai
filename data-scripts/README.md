# GreenStream AI Data Scripts

Python scripts for fetching real environmental data from Open-Meteo APIs.

## Scripts

### weatherdata.py
Fetches current weather data for Chennai:
- Temperature
- Humidity
- Apparent temperature (feels like)
- Cloud cover
- Wind speed

Run: `python weatherdata.py`

### aqi.py
Fetches current air quality data for Chennai:
- PM10 and PM2.5 levels
- Carbon monoxide
- Nitrogen dioxide
- Ozone

Run: `python aqi.py`

## Setup

Install dependencies:
```bash
pip install -r requirements.txt
```

## Integration

These scripts fetch live data from Open-Meteo free APIs (no API key required).
The frontend app in `/src` uses the same APIs directly via `src/lib/api.ts` for real-time dashboard updates.

Both Python scripts and the React frontend pull data from:
- **Weather**: `https://api.open-meteo.com/v1/forecast`
- **Air Quality**: `https://air-quality-api.open-meteo.com/v1/air-quality`
