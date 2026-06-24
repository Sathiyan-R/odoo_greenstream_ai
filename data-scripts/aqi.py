import requests

url = "https://air-quality-api.open-meteo.com/v1/air-quality"

params = {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "current": [
        "pm10",
        "pm2_5",
        "carbon_monoxide",
        "nitrogen_dioxide",
        "ozone"
    ]
}

response = requests.get(url, params=params)

print(response.json())
