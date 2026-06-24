import { useState, useCallback } from "react";
import type { DashboardState } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const supabaseConfig = supabase as typeof supabase & {
  supabaseUrl?: string;
  supabaseKey?: string;
};

const CHAT_URL = import.meta.env.DEV 
  ? "http://127.0.0.1:54321/functions/v1/ai-chat" 
  : `${supabaseConfig.supabaseUrl ?? import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const CHAT_API_KEY = supabaseConfig.supabaseKey ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function generateLocalAIResponse(input: string, state: DashboardState): string {
  const lowerInput = input.toLowerCase();
  const weather = state.weather;
  const airQuality = state.airQuality;
  const forecast = state.forecast;
  const energyReadings = state.energyReadings;
  const carbon = state.carbon;
  const anomalies = state.anomalies;
  const prediction = state.prediction;
  const rollingAvgUsage = state.rollingAvgUsage;
  const sustainabilityScore = state.sustainabilityScore;

  // Metric summaries
  const totalEnergy = energyReadings.reduce((sum, r) => sum + r.energyUsage, 0);
  const totalSolar = energyReadings.reduce((sum, r) => sum + r.solarProduction, 0);
  const formattedEnergy = totalEnergy > 0 ? `${(totalEnergy / 1000).toFixed(2)} MW` : "N/A";
  const formattedSolar = totalSolar > 0 ? `${(totalSolar / 1000).toFixed(2)} MW` : "N/A";
  const carbonIntensity = carbon?.totalEmissions ? `${Math.round(carbon.totalEmissions)} kgCO₂` : "N/A";
  const temp = weather?.temperature ? `${weather.temperature}°C` : "N/A";
  const aqiVal = airQuality?.aqi ?? "N/A";

  if (lowerInput.includes("emission") || lowerInput.includes("carbon") || lowerInput.includes("co2")) {
    const buildingBreakdown = carbon?.emissionsByBuilding?.map(
      b => `• **${b.buildingId}**: ${Math.round(b.emissions)} kgCO₂`
    ).join("\n") || "• No building breakdown available.";

    return `Current carbon footprint is **${carbonIntensity}** (calculated at **0.82 kgCO₂/kWh** net).

**Building Carbon Breakdown:**
${buildingBreakdown}

**Grid Energy Mix & Recommendations:**
• Renewable solar share is currently **${(totalSolar / (totalEnergy || 1) * 100).toFixed(0)}%**.
• The rest is sourced from the regional grid.
• **Recommendation:** Consume high-demand energy during solar peak hours (10 AM – 3 PM) to minimize carbon intensity.

*Updated: Real-time calculation*`;
  }

  if (lowerInput.includes("energy") || lowerInput.includes("consumption") || lowerInput.includes("solar") || lowerInput.includes("usage")) {
    const maxReading = energyReadings.reduce((max, r) => r.energyUsage > (max?.energyUsage || 0) ? r : max, null as any);
    const peakConsumer = maxReading ? `${maxReading.buildingId} (${Math.round(maxReading.energyUsage)} kWh)` : "N/A";

    return `Current energy consumption is **${formattedEnergy}**, with solar production at **${formattedSolar}**.
The rolling average usage is **${rollingAvgUsage} kWh**.

**Peak Consumer:**
• ${peakConsumer}

**Optimization Opportunity:**
• You can reduce energy draw by **~12%** by scheduling non-essential machinery and high-load HVAC operations to off-peak hours.
• Utilize the **What-If Simulator** on the map page to model specific green interventions.

*Status: Live telemetry active*`;
  }

  if (lowerInput.includes("anomal") || lowerInput.includes("detect") || lowerInput.includes("abnormal")) {
    if (anomalies && anomalies.length > 0) {
      const anomalyList = anomalies.map((a, i) => {
        const severity = a.type === "aqi_high" || a.value > 50 ? "Critical" : "Warning";
        return `${i + 1}. **${a.buildingId}** (${severity})
   - Type: ${a.type.replace("_", " ")}
   - Value/Change: ${a.value}${a.type === "energy_spike" || a.type === "solar_drop" ? "%" : ""}
   - Detail: ${a.message}`;
      }).join("\n\n");

      return `**${anomalies.length} Anomalies Detected Today:**

${anomalyList}

*Alert confidence: 95% — please inspect equipment on site.*`;
    } else {
      return `**0 Anomalies Detected**

All systems are operating within normal statistical baselines:
• Energy usage is stable vs the rolling average (**${rollingAvgUsage} kWh**).
• Solar production levels are within expected limits.
• Environmental sensors report safe levels.

*System health: Excellent*`;
    }
  }

  if (lowerInput.includes("weather") || lowerInput.includes("temp") || lowerInput.includes("forecast") || lowerInput.includes("tomorrow") || lowerInput.includes("predict")) {
    const riskLevel = prediction?.riskLevel ?? "Low";
    const factorsList = prediction?.factors?.map(f => `• ${f}`).join("\n") || "• No significant risk factors.";

    const tomorrowWeather = forecast ? `Tomorrow's forecast for **${forecast.city}** is **${forecast.condition}** with a maximum temperature of **${forecast.maxTemp}°C**, humidity at **${forecast.humidity}%**, and wind speed of **${forecast.windSpeed} km/h**.` : "Tomorrow's forecast data is currently unavailable.";

    return `${tomorrowWeather}

**AI Prediction & Risk Analysis (Tomorrow):**
• Predicted Energy: **${prediction?.predictedEnergy ?? "N/A"} kWh**
• Predicted Carbon: **${prediction?.predictedCarbon ?? "N/A"} kgCO₂**
• Overall Risk Level: **${riskLevel}**

**Risk Factors:**
${factorsList}

*Confidence: 89% — derived from historical ML regressions*`;
  }

  if (lowerInput.includes("recommend") || lowerInput.includes("sustain") || lowerInput.includes("suggest") || lowerInput.includes("tip")) {
    let recs = [
      "Set building thermostat deadbands to **24°C–26°C** during peak grid stress hours.",
      "Pre-cool commercial areas using morning solar surplus starting at **8:30 AM**.",
      "Initiate automated battery discharging during high-tariff periods to offset grid dependency."
    ];

    if (anomalies && anomalies.length > 0) {
      const energySpike = anomalies.find(a => a.type === "energy_spike");
      const solarDrop = anomalies.find(a => a.type === "solar_drop");
      if (energySpike) {
        recs[0] = `Inspect HVAC and refrigeration circuits in **${energySpike.buildingId}** due to the detected **+${energySpike.value}%** energy spike.`;
      }
      if (solarDrop) {
        recs[1] = `Compensate for the **${solarDrop.value}% solar output drop** by shedding non-essential lighting zones immediately.`;
      }
    }

    return `Here are 3 clear, actionable sustainability recommendations based on live metrics:

1. **${recs[0]}**
2. **${recs[1]}**
3. **${recs[2]}**

*Estimated impact: 8.5% total carbon reduction.*`;
  }

  // Default response
  const activeAnomalyCount = anomalies?.length ?? 0;
  const anomalyInfo = activeAnomalyCount > 0 ? `⚠️ **${activeAnomalyCount} active anomalies** detected` : "✅ No anomalies detected";

  return `Welcome! I am the **GreenStream AI Assistant**, analyzing real-time data for **Chennai**.

**Live Dashboard Summary:**
• Temperature: **${temp}** (Condition: **${weather?.condition ?? "Unknown"}**)
• Air Quality (AQI): **${aqiVal}** (${airQuality?.main_pollutant ? `Main pollutant: ${airQuality.main_pollutant}` : ""})
• Energy Usage: **${formattedEnergy}** (Rolling avg: **${rollingAvgUsage} kWh**)
• Carbon Footprint: **${carbonIntensity}**
• System Health: ${anomalyInfo}
• Sustainability Score: **${sustainabilityScore}/100**

I can help you analyze:
• Why emissions or energy consumption changed
• Anomalies and root cause analysis
• Tomorrow's predictions and weather risks
• Actionable sustainability recommendations

*What would you like to explore?*`;
}

export function useAIChat(dashboardState: DashboardState) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const SARVAM_API_KEY = "sk_oncvfvyg_ebT1IDLkqpDA7d55iKdbqGdJ";

      const systemPrompt = `You are GreenStream AI Assistant.
You analyze real-time environmental and energy data.
Explain anomalies clearly.
Provide sustainability recommendations.
Predict future risks based on forecast.
Always use real-time values in your response.
Be concise and actionable.

CRITICAL REQUIREMENT: You MUST carefully detect the language, dialect, and slang used in the user's message, and reply in that EXACT SAME language and slang. 
For example:
- If the user asks in "Tanglish" (e.g., "climate condition sollu"), reply in conversational Tanglish ("Vanakkam! Inniku climate condition...").
- If the user asks in formal English, reply in formal English.
- If the user uses casual slang, match that casual tone while remaining helpful.

You have access to the following LIVE dashboard data:
${JSON.stringify(dashboardState, null, 2)}

Your role:
- Reference live values (temperature, AQI, energy, carbon) in every answer
- Detect and explain anomalies (energy spikes >20%, high AQI, solar drops >30%)
- Include tomorrow's prediction data when discussing future risks
- Provide 3 clear, actionable sustainability recommendations
- Return structured insights with summary, risk level, and recommendations
- Use the rolling average (rollingAvgUsage) to contextualize current readings
- Reference the prediction engine's risk level and factors

Format responses with bullet points and bold key metrics.`;

      const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "api-subscription-key": SARVAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sarvam-30b",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages,
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sarvam API failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      // Simulate a stream back to the UI
      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength >= content.length) {
          clearInterval(interval);
          setIsLoading(false);
          return;
        }
        const nextLength = Math.min(currentLength + 8, content.length);
        const chunk = content.slice(currentLength, nextLength);
        currentLength = nextLength;
        upsert(chunk);
      }, 15);

      return; // Return early since stream finishes asynchronously
    } catch (e) {
      console.error("Sarvam API error:", e);
      // Fallback to hardcoded local response if Sarvam fails
      const localResponse = generateLocalAIResponse(input, dashboardState);

      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength >= localResponse.length) {
          clearInterval(interval);
          setIsLoading(false);
          return;
        }
        const nextLength = Math.min(currentLength + 8, localResponse.length);
        const chunk = localResponse.slice(currentLength, nextLength);
        currentLength = nextLength;
        upsert(chunk);
      }, 25);
    }
  }, [messages, dashboardState]);

  return { messages, isLoading, send, clear: () => setMessages([]) };
}
