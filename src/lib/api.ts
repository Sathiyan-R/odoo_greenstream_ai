export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  wind_speed: number;
  clouds: number;
}

export interface AirQualityData {
  city: string;
  aqi: number;
  main_pollutant: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
}

export interface ForecastData {
  city: string;
  avgTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  condition: string;
  simulated: boolean;
}

export interface EnergyReading {
  buildingId: string;
  energyUsage: number;
  solarProduction: number;
  trafficIndex: number;
  timestamp: number;
}

export interface CarbonData {
  totalEmissions: number;
  emissionsByBuilding: { buildingId: string; emissions: number }[];
}

export interface PredictionData {
  predictedEnergy: number;
  predictedCarbon: number;
  riskLevel: "Low" | "Medium" | "High";
  factors: string[];
}

const EMISSION_FACTOR = 0.82; // kgCO2 per kWh

// City coordinates for Open-Meteo API
const cityCoords: Record<string, { lat: number; lon: number }> = {
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Delhi": { lat: 28.7041, lon: 77.1025 },
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 },
};

// Weather code to description mapping (WMO standard)
const weatherCodeMap: Record<number, string> = {
  0: "Clear", 1: "Partly Cloudy", 2: "Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Foggy", 
  51: "Drizzle", 53: "Drizzle", 55: "Drizzle", 56: "Freezing Drizzle", 57: "Freezing Drizzle",
  61: "Rain", 63: "Rain", 65: "Rain", 66: "Freezing Rain", 67: "Freezing Rain",
  71: "Snow", 73: "Snow", 75: "Snow", 77: "Snow Grains",
  80: "Rain", 81: "Rain", 82: "Heavy Rain", 
  85: "Snow", 86: "Snow",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
};

export async function fetchWeather(city = "Chennai"): Promise<WeatherData> {
  try {
    const coords = cityCoords[city] || cityCoords["Chennai"];
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,weather_code,wind_speed_10m`
    );
    const data = await res.json();
    
    if (!res.ok || !data.current) throw new Error("Weather API error");
    
    const current = data.current;
    return {
      city,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      condition: weatherCodeMap[current.weather_code] || "Unknown",
      description: weatherCodeMap[current.weather_code]?.toLowerCase() || "unknown",
      wind_speed: current.wind_speed_10m,
      clouds: current.cloud_cover,
    };
  } catch (e) {
    console.error("Weather fetch failed:", e);
    throw e;
  }
}

export async function fetchAirQuality(
  city = "Chennai",
  state = "Tamil Nadu",
  country = "India"
): Promise<AirQualityData> {
  try {
    const coords = cityCoords[city] || cityCoords["Chennai"];
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`
    );
    const data = await res.json();
    
    if (!res.ok || !data.current) throw new Error("Air Quality API error");
    
    const current = data.current;
    const pollutants = {
      "PM10": current.pm10,
      "PM2.5": current.pm2_5,
      "CO": current.carbon_monoxide,
      "NO2": current.nitrogen_dioxide,
      "O3": current.ozone,
    };
    
    let mainPollutant = "PM2.5";
    let maxValue = 0;
    for (const [pollutant, value] of Object.entries(pollutants)) {
      if (value > maxValue) {
        maxValue = value;
        mainPollutant = pollutant;
      }
    }
    
    const pm25 = current.pm2_5;
    let aqi = 0;
    if (pm25 <= 12) aqi = pm25 * 50 / 12;
    else if (pm25 <= 35.4) aqi = 50 + (pm25 - 12) * 50 / 23.4;
    else if (pm25 <= 55.4) aqi = 100 + (pm25 - 35.4) * 50 / 20;
    else if (pm25 <= 150.4) aqi = 150 + (pm25 - 55.4) * 50 / 95;
    else aqi = 200 + (pm25 - 150.4) * 50 / 100;
    
    return {
      city,
      aqi: Math.round(aqi),
      main_pollutant: mainPollutant,
      temperature: null as any,
      humidity: null as any,
      wind_speed: null as any,
    };
  } catch (e) {
    console.error("Air quality fetch failed:", e);
    throw e;
  }
}

export async function fetchForecast(city = "Chennai"): Promise<ForecastData> {
  try {
    const coords = cityCoords[city] || cityCoords["Chennai"];
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,weather_code,wind_speed_10m_max&timezone=auto`
    );
    const data = await res.json();
    
    if (!res.ok || !data.daily) throw new Error("Forecast API error");
    
    const daily = data.daily;
    if (daily.time.length > 1) {
      const idx = 1;
      const avgTemp = (daily.temperature_2m_max[idx] + daily.temperature_2m_min[idx]) / 2;
      
      return {
        city,
        avgTemp: Math.round(avgTemp * 10) / 10,
        maxTemp: daily.temperature_2m_max[idx],
        humidity: daily.relative_humidity_2m_max[idx],
        windSpeed: daily.wind_speed_10m_max[idx],
        clouds: 0,
        condition: weatherCodeMap[daily.weather_code[idx]] || "Unknown",
        simulated: false,
      };
    }
    throw new Error("Insufficient forecast data");
  } catch (e) {
    console.error("Forecast fetch failed:", e);
    throw e;
  }
}

export function generateEnergyReading(): EnergyReading[] {
  const buildings = ["Building A", "Building B", "Building C", "Building D"];
  return buildings.map((buildingId) => ({
    buildingId,
    energyUsage: 200 + Math.random() * 600,
    solarProduction: 50 + Math.random() * 200,
    trafficIndex: Math.random() * 100,
    timestamp: Date.now(),
  }));
}

export function calculateCarbon(readings: EnergyReading[]): CarbonData {
  const emissionsByBuilding = readings.map((r) => ({
    buildingId: r.buildingId,
    emissions: (r.energyUsage - r.solarProduction * 0.3) * EMISSION_FACTOR,
  }));
  return {
    totalEmissions: emissionsByBuilding.reduce((s, b) => s + b.emissions, 0),
    emissionsByBuilding,
  };
}

export interface AnomalyAlert {
  buildingId: string;
  type: "energy_spike" | "aqi_high" | "solar_drop";
  value: number;
  message: string;
}

export function detectAnomalies(
  current: EnergyReading[],
  previous: EnergyReading[],
  rollingAvgUsage: number,
  aqi: number
): AnomalyAlert[] {
  const anomalies: AnomalyAlert[] = [];

  // Energy spike > 20% above rolling average
  current.forEach((c) => {
    const prev = previous.find((p) => p.buildingId === c.buildingId);
    if (rollingAvgUsage > 0) {
      const avgPerBuilding = rollingAvgUsage / 4;
      const spikePercent = ((c.energyUsage - avgPerBuilding) / avgPerBuilding) * 100;
      if (spikePercent > 20) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "energy_spike",
          value: Math.round(spikePercent),
          message: `Energy spike +${Math.round(spikePercent)}% above rolling avg`,
        });
      }
    } else if (prev) {
      const change = ((c.energyUsage - prev.energyUsage) / prev.energyUsage) * 100;
      if (change > 20) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "energy_spike",
          value: Math.round(change),
          message: `Energy spike +${Math.round(change)}% vs previous`,
        });
      }
    }

    // Solar drop > 30%
    if (prev && prev.solarProduction > 0) {
      const solarDrop = ((prev.solarProduction - c.solarProduction) / prev.solarProduction) * 100;
      if (solarDrop > 30) {
        anomalies.push({
          buildingId: c.buildingId,
          type: "solar_drop",
          value: Math.round(solarDrop),
          message: `Solar output dropped ${Math.round(solarDrop)}%`,
        });
      }
    }
  });

  // AQI > 4 (on the 1-5 IQAir scale, or >150 US AQI)
  if (aqi > 150) {
    anomalies.push({
      buildingId: "Environment",
      type: "aqi_high",
      value: aqi,
      message: `AQI dangerously high at ${aqi}`,
    });
  }

  return anomalies;
}

export function generatePrediction(
  forecast: ForecastData | null,
  currentAvgUsage: number,
  aqi: number
): PredictionData {
  let predictedEnergy = currentAvgUsage || 1800;
  const factors: string[] = [];
  let riskScore = 0;

  if (forecast) {
    // Temperature impact
    if (forecast.maxTemp > 32) {
      predictedEnergy *= 1.15;
      factors.push(`High temp (${forecast.maxTemp}°C) → +15% HVAC load`);
      riskScore += 2;
    } else if (forecast.maxTemp > 28) {
      predictedEnergy *= 1.08;
      factors.push(`Warm temp (${forecast.maxTemp}°C) → +8% cooling`);
      riskScore += 1;
    }

    // Cloud cover → solar impact
    if (forecast.clouds > 70) {
      factors.push(`High cloud cover (${forecast.clouds}%) → reduced solar`);
      riskScore += 1;
    }

    // Wind impact on renewable
    if (forecast.windSpeed > 6) {
      factors.push(`Strong wind (${forecast.windSpeed}m/s) → good for wind energy`);
      riskScore -= 1;
    }
  }

  // AQI impact
  if (aqi > 100) {
    factors.push(`Elevated AQI (${aqi}) → environmental risk`);
    riskScore += 2;
  }

  const predictedCarbon = predictedEnergy * EMISSION_FACTOR;
  const riskLevel: PredictionData["riskLevel"] =
    riskScore >= 3 ? "High" : riskScore >= 1 ? "Medium" : "Low";

  if (factors.length === 0) {
    factors.push("Conditions normal — no significant risk factors");
  }

  return {
    predictedEnergy: Math.round(predictedEnergy),
    predictedCarbon: Math.round(predictedCarbon),
    riskLevel,
    factors,
  };
}

export type DashboardState = {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  forecast: ForecastData | null;
  energyReadings: EnergyReading[];
  carbon: CarbonData | null;
  anomalies: AnomalyAlert[];
  energyHistory: { time: string; usage: number; solar: number }[];
  sustainabilityScore: number;
  prediction: PredictionData | null;
  rollingAvgUsage: number;
};
