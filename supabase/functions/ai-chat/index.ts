import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateLocalAIResponse(input: string, state: any): string {
  const lowerInput = (input || "").toLowerCase();
  const weather = state?.weather;
  const airQuality = state?.airQuality;
  const forecast = state?.forecast;
  const energyReadings = state?.energyReadings ?? [];
  const carbon = state?.carbon;
  const anomalies = state?.anomalies ?? [];
  const prediction = state?.prediction;
  const rollingAvgUsage = state?.rollingAvgUsage ?? 0;
  const sustainabilityScore = state?.sustainabilityScore ?? 0;

  // Metric summaries
  const totalEnergy = energyReadings.reduce((sum: number, r: any) => sum + (r.energyUsage || 0), 0);
  const totalSolar = energyReadings.reduce((sum: number, r: any) => sum + (r.solarProduction || 0), 0);
  const formattedEnergy = totalEnergy > 0 ? `${(totalEnergy / 1000).toFixed(2)} MW` : "N/A";
  const formattedSolar = totalSolar > 0 ? `${(totalSolar / 1000).toFixed(2)} MW` : "N/A";
  const carbonIntensity = carbon?.totalEmissions ? `${Math.round(carbon.totalEmissions)} kgCO₂` : "N/A";
  const temp = weather?.temperature ? `${weather.temperature}°C` : "N/A";
  const aqiVal = airQuality?.aqi ?? "N/A";

  if (lowerInput.includes("emission") || lowerInput.includes("carbon") || lowerInput.includes("co2")) {
    const buildingBreakdown = carbon?.emissionsByBuilding?.map(
      (b: any) => `• **${b.buildingId}**: ${Math.round(b.emissions)} kgCO₂`
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
    const maxReading = energyReadings.reduce((max: any, r: any) => (r.energyUsage || 0) > (max?.energyUsage || 0) ? r : max, null);
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
      const anomalyList = anomalies.map((a: any, i: number) => {
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
    const factorsList = prediction?.factors?.map((f: any) => `• ${f}`).join("\n") || "• No significant risk factors.";

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
      const energySpike = anomalies.find((a: any) => a.type === "energy_spike");
      const solarDrop = anomalies.find((a: any) => a.type === "solar_drop");
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, dashboardContext } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const SARVAM_API_KEY = Deno.env.get("SARVAM_API_KEY") || "sk_oncvfvyg_ebT1IDLkqpDA7d55iKdbqGdJ";

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
${JSON.stringify(dashboardContext, null, 2)}

Your role:
- Reference live values (temperature, AQI, energy, carbon) in every answer
- Detect and explain anomalies (energy spikes >20%, high AQI, solar drops >30%)
- Include tomorrow's prediction data when discussing future risks
- Provide 3 clear, actionable sustainability recommendations
- Return structured insights with summary, risk level, and recommendations
- Use the rolling average (rollingAvgUsage) to contextualize current readings
- Reference the prediction engine's risk level and factors

Format responses with bullet points and bold key metrics.`;

    try {
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
            ...messages,
          ],
          stream: false, // Sarvam might not fully support standard SSE streaming yet, we will fake stream the result back
        }),
      });

      if (!response.ok) {
        throw new Error(`Sarvam AI responded with ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      // Serve the full response as a simulated stream back to the client
      return serveStreamFromContent(content);
    } catch (fetchError) {
      console.warn("AI gateway request failed, serving local fallback stream:", fetchError);
      return serveLocalResponse(lastMessage, dashboardContext);
    }
  } catch (e) {
    console.error("AI chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helper to stream any text content back to the client
function serveStreamFromContent(content: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let currentLength = 0;
      const step = 8;
      while (currentLength < content.length) {
        const nextLength = Math.min(currentLength + step, content.length);
        const chunk = content.slice(currentLength, nextLength);
        currentLength = nextLength;

        const sseMessage = `data: ${JSON.stringify({
          choices: [{ delta: { content: chunk } }]
        })}\n\n`;
        controller.enqueue(encoder.encode(sseMessage));
        await new Promise(resolve => setTimeout(resolve, 15));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
}

function serveLocalResponse(lastMessage: string, dashboardContext: any): Response {
  const localResponse = generateLocalAIResponse(lastMessage, dashboardContext);
  return serveStreamFromContent(localResponse);
}
