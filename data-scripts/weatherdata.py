import openmeteo_requests
import requests_cache
from retry_requests import retry

# Setup cache and retry
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)

openmeteo = openmeteo_requests.Client(session=retry_session)

# Open-Meteo Forecast API
url = "https://api.open-meteo.com/v1/forecast"

params = {
    "latitude": 13.0827,      # Chennai
    "longitude": 80.2707,
    "current": [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "cloud_cover",
        "wind_speed_10m"
    ]
}

responses = openmeteo.weather_api(url, params=params)

response = responses[0]

print("====================================")
print("      GREENSTREAM AI WEATHER")
print("====================================")

current = response.Current()

temperature = current.Variables(0).Value()
humidity = current.Variables(1).Value()
feels_like = current.Variables(2).Value()
cloud_cover = current.Variables(3).Value()
wind_speed = current.Variables(4).Value()

print(f"Temperature      : {temperature:.1f} °C")
print(f"Humidity         : {humidity:.1f} %")
print(f"Feels Like       : {feels_like:.1f} °C")
print(f"Cloud Cover      : {cloud_cover:.1f} %")
print(f"Wind Speed       : {wind_speed:.1f} km/h")
