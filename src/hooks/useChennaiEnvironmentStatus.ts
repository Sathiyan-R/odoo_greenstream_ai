import { useEffect, useState, useRef, useCallback } from "react";
import { ZoneData } from "@/types/map";
import { useDashboardData } from "./useDashboardData";
import { fetchZonesFromMySQL } from "@/lib/mysqlApi";

// Fallback zone definitions with coordinates
const fallbackZones = [
  {
    id: "zone-1",
    zone_name: "North Chennai",
    zone_region: "Industrial & Port Area",
    latitude: 13.1482,
    longitude: 80.2619,
  },
  {
    id: "zone-2",
    zone_name: "Central Chennai",
    zone_region: "Urban Core & Commercial",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: "zone-3",
    zone_name: "South Chennai",
    zone_region: "IT Corridor & Residential",
    latitude: 12.9249,
    longitude: 80.2270,
  },
  {
    id: "zone-4",
    zone_name: "OMR / IT Corridor",
    zone_region: "Technology Hub",
    latitude: 12.9352,
    longitude: 80.2430,
  },
  {
    id: "zone-5",
    zone_name: "Industrial Belt",
    zone_region: "Manufacturing Zone",
    latitude: 13.1143,
    longitude: 80.1548,
  },
];

export function useChennaiEnvironmentStatus() {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fallback to live API data
  const { state: dashboardState } = useDashboardData();

  // Update zones using live API data
  const updateZonesFromAPI = useCallback(() => {
    const totalEnergy = dashboardState.energyReadings.reduce(
      (sum, r) => sum + r.energyUsage,
      0
    );
    const baseTemp = dashboardState.weather?.temperature || 32;
    const baseAqi = dashboardState.airQuality?.aqi || 120;

    const updatedZones: ZoneData[] = fallbackZones.map((baseZone, index) => {
      // Zone-specific multipliers
      const isIndustrial = baseZone.zone_region.includes("Industrial");
      const isIT = baseZone.zone_region.includes("IT") || baseZone.zone_region.includes("Technology");
      const isCoastal = baseZone.zone_region.includes("Coastal");

      const tempOffset = isIndustrial ? 3 : isIT ? 2.5 : isCoastal ? -1 : 0;
      const aqiMultiplier = isIndustrial ? 1.5 : isIT ? 1.4 : isCoastal ? 0.7 : 1.0;
      const energyBase = isIndustrial ? 2500 : isIT ? 2100 : 850;

      // Add variation
      const variation = (Math.random() - 0.5) * 2;
      const temperature = parseFloat((baseTemp + tempOffset + variation).toFixed(2));
      const aqi = Math.round(baseAqi * aqiMultiplier + variation * 10);
      const energyReading = dashboardState.energyReadings[index % dashboardState.energyReadings.length];
      const energy_consumption = energyReading
        ? parseFloat((energyReading.energyUsage * (energyBase / 850)).toFixed(2))
        : energyBase;
      const carbon_emission = parseFloat((energy_consumption * 0.82).toFixed(2));

      // Calculate sustainability score
      const aqiScore = Math.max(0, 100 - aqi / 2);
      const energyScore = Math.max(0, 100 - energy_consumption / 30);
      const tempScore = Math.max(0, 100 - (temperature - 25) * 5);
      const sustainability_score = Math.round(
        aqiScore * 0.5 + energyScore * 0.3 + tempScore * 0.2
      );

      // Generate trends (simple random for now)
      const trends = ["↑", "↓", "→"];
      const trend_temperature = trends[Math.floor(Math.random() * trends.length)];
      const trend_aqi = trends[Math.floor(Math.random() * trends.length)];
      const trend_energy = trends[Math.floor(Math.random() * trends.length)];

      // Calculate humidity (typically higher in coastal areas and industrial zones)
      const humidity = isCoastal ? 68 + Math.random() * 10 : 65 + Math.random() * 8;

      // Wind speed varies by zone and time
      const windSpeedBase = isCoastal ? 12 : isIndustrial ? 6 : 9;
      const wind_speed = windSpeedBase + (Math.random() - 0.5) * 4;

      // Energy variance
      const energy_variance = energy_consumption * (0.12 + Math.random() * 0.08);

      // Zone area estimation
      const zone_area = isIndustrial ? 40 : isIT ? 50 : isCoastal ? 55 : 45;

      return {
        ...baseZone,
        temperature,
        humidity: Math.round(humidity * 10) / 10,
        aqi,
        energy_consumption,
        energy_variance,
        carbon_emission,
        wind_speed: Math.round(wind_speed * 10) / 10,
        zone_area,
        sustainability_score,
        trend_temperature,
        trend_aqi,
        trend_energy,
        prediction_tomorrow:
          trend_aqi === "↑"
            ? "Air quality may worsen. Temperature expected to rise."
            : "Stable conditions expected with minor variations.",
        ai_suggestion:
          sustainability_score < 50
            ? "Critical: Immediate intervention required. Increase renewable energy adoption and monitor emissions closely."
            : sustainability_score < 70
            ? "Alert: Consider implementing energy efficiency measures and air quality monitoring."
            : "Continue monitoring current sustainable practices.",
        last_updated: new Date().toISOString(),
        // Legacy compatibility
        name: baseZone.zone_name,
        lat: baseZone.latitude,
        lng: baseZone.longitude,
        energy: energy_consumption,
        carbon: carbon_emission,
        area: baseZone.zone_region,
      };
    });

    setZones(updatedZones);
    setLastUpdated(new Date());
    setLoading(false);
    setIsLive(true);
    setTimeout(() => setIsLive(false), 2000);
  }, [dashboardState]);

  // Fetch initial data
  const fetchZones = useCallback(async () => {
    try {
      const data = await fetchZonesFromMySQL();
      if (data && data.length > 0) {
        setZones(data);
        setLastUpdated(new Date());
        setLoading(false);
        setError(null);
      } else {
        console.log("No data in MySQL, using fallback with live API data");
        setError(null);
        updateZonesFromAPI();
      }
    } catch (error) {
      console.error("Error fetching from MySQL:", error);
      setError(error as Error);
      updateZonesFromAPI();
    }
  }, [updateZonesFromAPI]);

  useEffect(() => {
    fetchZones();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchZones]);

  // Polling interval
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      fetchZones();
    }, 60000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchZones]);

  const refresh = () => {
    setError(null);
    fetchZones();
  };

  return { zones, loading, lastUpdated, isLive, error, refresh };
}
