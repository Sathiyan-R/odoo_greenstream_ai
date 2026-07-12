import { useDashboardData } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import {
  AlertTriangle, RefreshCw, Cloud, Wind, Droplets, Thermometer,
  Leaf, Zap, Sun, Activity, CheckCircle2, XCircle, TrendingUp,
  Brain, ShieldAlert, Calendar, MapPin, Sparkles,
} from "lucide-react";
import DashboardAIChat from "@/components/dashboard/DashboardAIChat";
import { SustainabilityScoreCard } from "@/components/dashboard/SustainabilityScoreCard";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { AnomalyAlerts } from "@/components/dashboard/AnomalyAlerts";
import { AIInsightGenerator } from "@/components/dashboard/AIInsightGenerator";
import { useEnhancedDashboardData } from "@/hooks/useEnhancedDashboardData";
import { Link } from "react-router-dom";

const MetricCard = ({ label, value, unit, icon: Icon, color = "primary" }: {
  label: string; value: string | number; unit: string; icon: any; color?: string;
}) => (
  <div className="glass-panel p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 text-${color}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-heading font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const StatusDot = ({ connected, label }: { connected: boolean; label: string }) => (
  <div className="flex items-center gap-1.5">
    {connected ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
    ) : (
      <XCircle className="w-3.5 h-3.5 text-destructive" />
    )}
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const LiveDashboard = () => {
  const { state, loading, apiStatus, refresh } = useDashboardData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aqiLevel = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-primary" };
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400" };
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "text-orange-400" };
    return { label: "Unhealthy", color: "text-destructive" };
  };

  const aqi = state.airQuality?.aqi ?? 0;
  const aqiInfo = aqiLevel(aqi);

  const riskColor = state.prediction?.riskLevel === "High"
    ? "text-destructive" : state.prediction?.riskLevel === "Medium"
    ? "text-yellow-400" : "text-primary";

  const { anomalies, scoreFactors, energyHistory, energyStats } = useEnhancedDashboardData({ dashboardState: state });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg">GreenStream AI</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">Real-Time Control Tower</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <StatusDot connected={apiStatus.weather} label="Weather" />
            <StatusDot connected={apiStatus.airQuality} label="AQI" />
            <StatusDot connected={apiStatus.forecast} label="Forecast" />
            <StatusDot connected={apiStatus.energy} label="Energy" />
          </div>
          <Link 
            to="/dashboard/map" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium hover:shadow-lg transition-all duration-300"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Environmental Map</span>
            <span className="sm:hidden">Map</span>
          </Link>
          <Link 
            to="/dashboard/esg" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-medium hover:shadow-lg transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ESG Command Center</span>
            <span className="sm:hidden">ESG</span>
          </Link>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-heading text-primary font-semibold">LIVE</span>
          </div>
          <button onClick={refresh} className="p-2 rounded-lg hover:bg-muted/50 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Connecting to live data streams...</p>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-4">
          {/* Anomaly Alerts */}
          {anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <AnomalyAlerts anomalies={anomalies} />
            </motion.div>
          )}

          {/* Top Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <MetricCard label="Carbon Emissions" value={Math.round(state.carbon?.totalEmissions ?? 0)} unit="kgCO₂" icon={Activity} />
            <MetricCard label="Temperature" value={state.weather?.temperature?.toFixed(1) ?? "--"} unit="°C" icon={Thermometer} />
            <MetricCard label="Humidity" value={state.weather?.humidity ?? "--"} unit="%" icon={Droplets} />
            <MetricCard label="AQI" value={aqi || "--"} unit={aqiInfo.label} icon={Wind} />
            <MetricCard label="Sustainability" value={state.sustainabilityScore} unit="/ 100" icon={Leaf} color="primary" />
            <MetricCard label="Weather" value={state.weather?.condition ?? "--"} unit={state.weather?.description ?? ""} icon={Cloud} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <SustainabilityScoreCard factors={scoreFactors} previousScore={state.sustainabilityScore - 5} />
            <PredictionChart
              energyHistory={energyHistory.map((point) => point.value)}
              aqi={aqi}
              temperature={state.weather?.temperature ?? 0}
              windSpeed={state.weather?.wind_speed ?? 0}
              carbonIntensity={0.82}
            />
          </div>

          {/* Tomorrow Prediction Card */}
          {state.prediction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 glow-blue"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-secondary" />
                <p className="text-sm font-heading font-semibold">Tomorrow's Prediction</p>
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                  state.prediction.riskLevel === "High" ? "bg-destructive/20 text-destructive" :
                  state.prediction.riskLevel === "Medium" ? "bg-yellow-400/20 text-yellow-400" :
                  "bg-primary/20 text-primary"
                }`}>
                  {state.prediction.riskLevel} Risk
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Predicted Energy</p>
                  <p className="text-lg font-heading font-bold">{state.prediction.predictedEnergy} <span className="text-xs text-muted-foreground">kWh</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Predicted Carbon</p>
                  <p className="text-lg font-heading font-bold">{state.prediction.predictedCarbon} <span className="text-xs text-muted-foreground">kgCO₂</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Forecast Temp</p>
                  <p className="text-lg font-heading font-bold">{state.forecast?.maxTemp ?? "--"} <span className="text-xs text-muted-foreground">°C max</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Forecast</p>
                  <p className="text-lg font-heading font-bold">{state.forecast?.condition ?? "--"}</p>
                </div>
              </div>
              {state.prediction.factors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {state.prediction.factors.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Charts + AI Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Energy Chart */}
            <div className="lg:col-span-2 glass-panel p-4 glow-green">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-heading font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Live Energy Usage vs Solar Production
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">Avg: {state.rollingAvgUsage} kWh</span>
                  <span className="text-[10px] text-muted-foreground">Auto-refresh: 5s</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={state.energyHistory}>
                  <defs>
                    <linearGradient id="liveUsageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="liveSolarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 14%)" />
                  <XAxis dataKey="time" tick={{ fill: "hsl(150 10% 55%)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(150 10% 55%)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(150 15% 6%)", border: "1px solid hsl(150 10% 18%)", borderRadius: "8px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="usage" stroke="#00FF88" fill="url(#liveUsageGrad)" strokeWidth={2} name="Energy (kWh)" />
                  <Area type="monotone" dataKey="solar" stroke="#00D4FF" fill="url(#liveSolarGrad)" strokeWidth={2} name="Solar (kWh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Chat */}
            <DashboardAIChat dashboardState={state} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <AIInsightGenerator dashboardState={state} />
            <div className="glass-panel p-4 border border-border">
              <h3 className="text-lg font-heading font-bold mb-3">Energy Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Current Usage</p>
                  <p className="text-xl font-semibold">{Math.round(energyStats.current)} kWh</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Average Usage</p>
                  <p className="text-xl font-semibold">{Math.round(energyStats.average)} kWh</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Peak Usage</p>
                  <p className="text-xl font-semibold">{Math.round(energyStats.peak)} kWh</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Min Usage</p>
                  <p className="text-xl font-semibold">{Math.round(energyStats.min)} kWh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carbon by Building */}
            <div className="glass-panel p-4">
              <p className="text-sm font-heading font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                Carbon Emissions by Building (kgCO₂)
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={state.carbon?.emissionsByBuilding ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 14%)" />
                  <XAxis dataKey="buildingId" tick={{ fill: "hsl(150 10% 55%)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(150 10% 55%)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(150 15% 6%)", border: "1px solid hsl(150 10% 18%)", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="emissions" fill="#00FF88" radius={[4, 4, 0, 0]} name="CO₂ (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic & Solar per building */}
            <div className="glass-panel p-4">
              <p className="text-sm font-heading font-semibold mb-4 flex items-center gap-2">
                <Sun className="w-4 h-4 text-primary" />
                Building Metrics (Live)
              </p>
              <div className="space-y-3">
                {state.energyReadings.map((r) => (
                  <div key={r.buildingId} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">{r.buildingId}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-primary" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (r.energyUsage / 800) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-14 text-right">{Math.round(r.energyUsage)} kWh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-3 h-3 text-secondary" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${Math.min(100, (r.solarProduction / 250) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-14 text-right">{Math.round(r.solarProduction)} kWh</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Traffic</span>
                      <span className={`text-xs font-semibold ${r.trafficIndex > 70 ? "text-destructive" : r.trafficIndex > 40 ? "text-yellow-400" : "text-primary"}`}>
                        {Math.round(r.trafficIndex)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDashboard;
