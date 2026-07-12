/**
 * Dashboard Integration Guide
 * 
 * This file provides reference data for integrating new advanced features
 * into your existing Dashboard component.
 * 
 * See FEATURE_INTEGRATION_GUIDE.md for code examples
 */

// ============================================================================
// COMPONENT IMPORTS
// ============================================================================

export const COMPONENTS_TO_IMPORT = [
  "SustainabilityScoreCard from @/components/dashboard/SustainabilityScoreCard",
  "PredictionChart from @/components/dashboard/PredictionChart",
  "AnomalyAlerts, AnomalySummary from @/components/dashboard/AnomalyAlerts",
  "AIInsightGenerator from @/components/dashboard/AIInsightGenerator",
  "useEnhancedDashboardData from @/hooks/useEnhancedDashboardData",
];

// ============================================================================
// HOOK USAGE
// ============================================================================

export const HOOK_USAGE_EXAMPLE = `
const YourDashboard = () => {
  const { state, loading } = useDashboardData();
  const { anomalies, scoreFactors, energyHistory } = 
    useEnhancedDashboardData({ dashboardState: state });

  return (
    <main>
      <SustainabilityScoreCard factors={scoreFactors} />
      <PredictionChart energyHistory={energyHistory} {...} />
      <AnomalyAlerts anomalies={anomalies} />
      <AIInsightGenerator dashboardState={state} />
    </main>
  );
};
`;

// ============================================================================
// PERFORMANCE OPTIMIZATION TIPS
// ============================================================================

export const PERFORMANCE_TIPS = [
  "Memoize your charts with React.memo() to prevent re-renders",
  "Use React Query with staleTime: 5min, gcTime: 10min",
  "Lazy load heavy components with React.lazy()",
  "Use useEnhancedDashboardData to memoize expensive calculations",
  "Only pass necessary dependencies to useMemo/useCallback",
  "Split large dashboard into smaller components with React.memo()",
  "Monitor performance with Chrome DevTools Profiler",
];

// ============================================================================
// API INTEGRATION FOR AI INSIGHTS
// ============================================================================

export const API_INTEGRATION_GUIDE = `
For real AI-powered insights, extend your MySQL backend:

1. Add a new API route to the MySQL server in mysql-server/server.js
2. Send dashboardData to Claude/GPT-4 API
3. Parse structured responses as AIInsight objects
4. Replace generateInsights() call in AIInsightGenerator.tsx

Example: Call your API route instead of using mock data
`;

// ============================================================================
// TESTING YOUR NEW FEATURES
// ============================================================================

export const TESTING_CHECKLIST = [
  "Anomaly detection: Create mock data with 50% spikes",
  "Predictions: Verify all 3 charts render correctly",
  "Sustainability score: Test with different factor values",
  "AI insights: Check that insights generate on data changes",
  "Performance: Use React DevTools Profiler",
  "Responsive: Test on mobile, tablet, desktop",
  "TypeScript: Verify no compilation errors",
];

// ============================================================================
// 6. COMPONENT EXPORTS
// ============================================================================

export const FEATURE_COMPONENTS = {
  SustainabilityScoreCard: "src/components/dashboard/SustainabilityScoreCard.tsx",
  PredictionChart: "src/components/dashboard/PredictionChart.tsx",
  AnomalyAlerts: "src/components/dashboard/AnomalyAlerts.tsx",
  AIInsightGenerator: "src/components/dashboard/AIInsightGenerator.tsx",
};

export const UTILITY_MODULES = {
  scoreCalculation: "src/lib/scoreCalculation.ts",
  anomalyDetection: "src/lib/anomalyDetection.ts",
  predictions: "src/lib/predictions.ts",
  insightGenerator: "src/lib/insightGenerator.ts",
  useEnhancedDashboardData: "src/hooks/useEnhancedDashboardData.ts",
};

export const QUICK_START_CHECKLIST = [
  "✅ Import new components into Dashboard.tsx",
  "✅ Add SustainabilityScoreCard to metric grid",
  "✅ Add PredictionChart section",
  "✅ Add AnomalyAlerts at top of dashboard",
  "✅ Add AIInsightGenerator section",
  "✅ Import useEnhancedDashboardData hook",
  "✅ Update API.ts DashboardState type if needed",
  "✅ Test all components render correctly",
  "✅ Verify performance with React DevTools",
  "✅ Adjust layout/styling for your theme",
];
