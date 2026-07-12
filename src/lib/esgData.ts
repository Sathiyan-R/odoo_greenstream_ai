import type {
  EmissionFactor,
  CarbonTransaction,
  ProductESGProfile,
  EnvironmentalGoal,
  DepartmentCarbonTracking,
  CSRActivity,
  DiversityMetrics,
  TrainingCompletion,
  ESGPolicy,
  PolicyAcknowledgement,
  InternalAudit,
  ComplianceIssue,
  BadgeData,
  Reward,
  ChallengeItem,
  LeaderboardEntry,
  NotificationItem,
  ReportFilter,
  ESGSummary,
} from "@/types/esg";

export const emissionFactors: EmissionFactor[] = [
  { id: "ef-1", category: "Electricity", factor: 0.82, unit: "kg CO₂/kWh" },
  { id: "ef-2", category: "Natural Gas", factor: 2.75, unit: "kg CO₂/m³" },
  { id: "ef-3", category: "Diesel", factor: 2.68, unit: "kg CO₂/L" },
];

export const carbonTransactions: CarbonTransaction[] = [
  { id: "tx-1", department: "Operations", type: "emission", quantity: 1200, emissionFactorId: "ef-1", carbonEmitted: 984, timestamp: new Date().toISOString() },
  { id: "tx-2", department: "Logistics", type: "offset", quantity: 500, emissionFactorId: "ef-2", carbonEmitted: 1375, timestamp: new Date().toISOString() },
];

export const productProfiles: ProductESGProfile[] = [
  { id: "prod-1", name: "Solar Cluster", environmentalScore: 92, socialScore: 88, governanceScore: 90, description: "Low carbon renewable energy solution." },
  { id: "prod-2", name: "Smart Meter", environmentalScore: 75, socialScore: 80, governanceScore: 82, description: "Connected meter supporting energy efficiency and reporting." },
];

export const environmentalGoals: EnvironmentalGoal[] = [
  { id: "goal-1", title: "Reduce carbon intensity by 25%", target: "25% reduction", progress: 42, dueDate: "2026-12-31" },
  { id: "goal-2", title: "Increase renewable energy share to 45%", target: "45% renewable", progress: 31, dueDate: "2026-09-30" },
];

export const departmentCarbonTracking: DepartmentCarbonTracking[] = [
  { department: "Operations", baseline: 3200, current: 2450, targetReduction: 18 },
  { department: "Logistics", baseline: 2800, current: 2040, targetReduction: 27 },
];

export const csrActivities: CSRActivity[] = [
  { id: "csr-1", title: "River Clean-Up", department: "Operations", employee: "Asha R.", points: 120, completionDate: "2026-07-04", proofUrl: "https://example.com/proof/river-cleanup.jpg", approved: true },
  { id: "csr-2", title: "School STEM Workshop", department: "HR", employee: "Priya K.", points: 90, completionDate: "2026-07-02", proofUrl: "https://example.com/proof/stem-workshop.jpg", approved: false },
];

export const diversityMetrics: DiversityMetrics[] = [
  { department: "Operations", genderParity: 46, underrepresentedGroups: 28, inclusionIndex: 74 },
  { department: "HR", genderParity: 54, underrepresentedGroups: 35, inclusionIndex: 82 },
];

export const trainingCompletions: TrainingCompletion[] = [
  { id: "train-1", course: "ESG Awareness", employee: "Ramesh S.", completionDate: "2026-07-08", status: "completed" },
  { id: "train-2", course: "Carbon Accounting", employee: "Meena T.", completionDate: "", status: "in_progress" },
];

export const esgPolicies: ESGPolicy[] = [
  { id: "policy-1", title: "Sustainable Procurement Policy", department: "Procurement", acknowledged: 46, totalEmployees: 60 },
  { id: "policy-2", title: "Diversity & Inclusion Policy", department: "HR", acknowledged: 55, totalEmployees: 60 },
];

export const policyAcknowledgements: PolicyAcknowledgement[] = [
  { policyId: "policy-1", employee: "Asha R.", acknowledgedAt: "2026-07-03T09:30:00Z" },
  { policyId: "policy-2", employee: "Priya K.", acknowledgedAt: "2026-07-05T11:15:00Z" },
];

export const internalAudits: InternalAudit[] = [
  { id: "audit-1", title: "GHG Reporting Review", department: "Compliance", status: "in_review", findings: 4 },
  { id: "audit-2", title: "Supplier ESG Scorecard", department: "Procurement", status: "open", findings: 2 },
];

export const complianceIssues: ComplianceIssue[] = [
  { id: "issue-1", owner: "Sanjay P.", severity: "high", dueDate: "2026-08-01", status: "in_progress", notified: true },
  { id: "issue-2", owner: "Deepa M.", severity: "medium", dueDate: "2026-07-22", status: "open", notified: false },
];

export const badges: BadgeData[] = [
  { id: "badge-1", title: "Carbon Champion", description: "Reduced personal emissions by 30%.", unlocked: true },
  { id: "badge-2", title: "CSR Star", description: "Completed 3 CSR activities this quarter.", unlocked: false },
];

export const rewards: Reward[] = [
  { id: "reward-1", title: "Eco Lunch Voucher", cost: 500, redeemed: false },
  { id: "reward-2", title: "Extra Day Off", cost: 1200, redeemed: false },
];

export const challenges: ChallengeItem[] = [
  { id: "challenge-1", title: "Zero Waste Week", status: "active", progress: 60, rewardPoints: 300 },
  { id: "challenge-2", title: "Solar Savings Sprint", status: "draft", progress: 0, rewardPoints: 500 },
];

export const leaderboard: LeaderboardEntry[] = [
  { employee: "Asha R.", score: 980, department: "Operations" },
  { employee: "Priya K.", score: 930, department: "HR" },
  { employee: "Rahul V.", score: 910, department: "Logistics" },
];

export const notifications: NotificationItem[] = [
  { id: "n-1", title: "Compliance issue created for Deepa M.", category: "compliance", timestamp: "2026-07-11T08:30:00Z", read: false, emailSent: true },
  { id: "n-2", title: "Badge earned: Carbon Champion", category: "badge", timestamp: "2026-07-09T14:20:00Z", read: true, emailSent: true },
];

export function calculateCarbonEmission(quantity: number, emissionFactor: number) {
  return quantity * emissionFactor;
}

export function getESGSummary(): ESGSummary {
  const environmentalScore = 78;
  const socialScore = 72;
  const governanceScore = 69;
  const overallScore = Math.round((environmentalScore + socialScore + governanceScore) / 3);

  return {
    overallScore,
    environmentalScore,
    socialScore,
    governanceScore,
    departmentRankings: [
      { department: "Operations", score: 82 },
      { department: "HR", score: 76 },
      { department: "Logistics", score: 71 },
    ],
    topEmployees: leaderboard.slice(0, 3),
  };
}

export function filterReportData(filters: ReportFilter) {
  return {
    filters,
    results: [],
  };
}
