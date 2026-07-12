import { describe, expect, it } from "vitest";
import { transformZoneRowToZoneData } from "./mysqlApi";

describe("transformZoneRowToZoneData", () => {
  it("maps a MySQL zone row to the UI zone shape", () => {
    const zone = transformZoneRowToZoneData({
      id: "zone-1",
      zone_name: "North Chennai",
      zone_region: "Industrial & Port Area",
      latitude: 13.1482,
      longitude: 80.2619,
      temperature: 35.4,
      humidity: 69.2,
      aqi: 118,
      energy_consumption: 2420,
      energy_variance: 310,
      carbon_emission: 1984,
      sustainability_score: 62,
      wind_speed: 8.4,
      zone_area: 40,
      trend_temperature: "↑",
      trend_aqi: "↓",
      trend_energy: "→",
      prediction_tomorrow: "Expect warmer conditions",
      ai_suggestion: "Monitor air quality",
      last_updated: "2026-07-12T00:00:00.000Z",
    });

    expect(zone.name).toBe("North Chennai");
    expect(zone.zone_name).toBe("North Chennai");
    expect(zone.energy_consumption).toBe(2420);
    expect(zone.sustainability_score).toBe(62);
    expect(zone.ai_suggestion).toBe("Monitor air quality");
  });
});
