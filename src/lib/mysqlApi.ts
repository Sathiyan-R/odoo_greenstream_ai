import type { ZoneData } from "@/types/map";

export interface MySQLZoneRow {
  id: string;
  zone_name: string;
  zone_region: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number | null;
  aqi: number;
  energy_consumption: number;
  energy_variance: number | null;
  carbon_emission: number;
  sustainability_score: number;
  wind_speed: number | null;
  zone_area: number | null;
  trend_temperature: string | null;
  trend_aqi: string | null;
  trend_energy: string | null;
  prediction_tomorrow: string | null;
  ai_suggestion: string | null;
  last_updated: string | null;
}

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

export function transformZoneRowToZoneData(row: MySQLZoneRow): ZoneData {
  const latitude = parseNumber(row.latitude, 0);
  const longitude = parseNumber(row.longitude, 0);
  const temperature = parseNumber(row.temperature, 0);
  const humidity = row.humidity === null ? 65 : parseNumber(row.humidity, 65);
  const aqi = parseNumber(row.aqi, 0);
  const energy_consumption = parseNumber(row.energy_consumption, 0);
  const energy_variance = row.energy_variance === null ? null : parseNumber(row.energy_variance, energy_consumption * 0.15);
  const carbon_emission = parseNumber(row.carbon_emission, 0);
  const sustainability_score = parseNumber(row.sustainability_score, 0);
  const wind_speed = row.wind_speed === null ? 8 : parseNumber(row.wind_speed, 8);
  const zone_area = row.zone_area === null ? 50 : parseNumber(row.zone_area, 50);

  return {
    id: row.id,
    zone_name: row.zone_name,
    zone_region: row.zone_region,
    latitude,
    longitude,
    temperature,
    humidity,
    aqi,
    energy_consumption,
    energy_variance: energy_variance ?? energy_consumption * 0.15,
    carbon_emission,
    sustainability_score,
    wind_speed,
    zone_area,
    trend_temperature: row.trend_temperature ?? "→",
    trend_aqi: row.trend_aqi ?? "→",
    trend_energy: row.trend_energy ?? "→",
    prediction_tomorrow: row.prediction_tomorrow ?? "Stable conditions expected with minor variations.",
    ai_suggestion: row.ai_suggestion ?? "Continue monitoring current sustainable practices.",
    last_updated: row.last_updated ?? new Date().toISOString(),
    name: row.zone_name,
    lat: latitude,
    lng: longitude,
    energy: energy_consumption,
    carbon: carbon_emission,
    area: row.zone_region,
  };
}

export async function fetchZonesFromMySQL(apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"): Promise<ZoneData[]> {
  const response = await fetch(`${apiBaseUrl}/chennai-environment-status`);

  if (!response.ok) {
    throw new Error(`Failed to load MySQL zone data: ${response.status}`);
  }

  const data = (await response.json()) as MySQLZoneRow[];
  return data.map(transformZoneRowToZoneData);
}
