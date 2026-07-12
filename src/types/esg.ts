export type ChallengeStatus = "draft" | "active" | "under_review" | "completed" | "archived";

export interface EmissionFactor {
  id: string;
  category: string;
  factor: number;
  unit: string;
}

export interface CarbonTransaction {
  id: string;
  department: string;
  type: "purchase" | "offset" | "emission";
  quantity: number;
  emissionFactorId: string;
  carbonEmitted: number;
  timestamp: string;
}

export interface ProductESGProfile {
  id: string;
  name: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  description: string;
}

export interface EnvironmentalGoal {
  id: string;
  title: string;
  target: string;
  progress: number;
  dueDate: string;
}

export interface DepartmentCarbonTracking {
  department: string;
  baseline: number;
  current: number;
  targetReduction: number;
}

export interface CSRActivity {
  id: string;
  title: string;
  department: string;
  employee: string;
  points: number;
  completionDate: string;
  proofUrl: string;
  approved: boolean;
}

export interface DiversityMetrics {
  department: string;
  genderParity: number;
  underrepresentedGroups: number;
  inclusionIndex: number;
}

export interface TrainingCompletion {
  id: string;
  course: string;
  employee: string;
  completionDate: string;
  status: "completed" | "in_progress" | "not_started";
}

export interface ESGPolicy {
  id: string;
  title: string;
  department: string;
  acknowledged: number;
  totalEmployees: number;
}

export interface PolicyAcknowledgement {
  policyId: string;
  employee: string;
  acknowledgedAt: string;
}

export interface InternalAudit {
  id: string;
  title: string;
  department: string;
  status: "open" | "in_review" | "closed";
  findings: number;
}

export interface ComplianceIssue {
  id: string;
  owner: string;
  severity: "low" | "medium" | "high" | "critical";
  dueDate: string;
  status: "open" | "in_progress" | "resolved";
  notified: boolean;
}

export interface BadgeData {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  redeemed: boolean;
}

export interface ChallengeItem {
  id: string;
  title: string;
  status: ChallengeStatus;
  progress: number;
  rewardPoints: number;
}

export interface LeaderboardEntry {
  employee: string;
  score: number;
  department: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  category: "compliance" | "badge" | "policy" | "csr" | "challenge";
  timestamp: string;
  read: boolean;
  emailSent: boolean;
}

export interface ReportFilter {
  department?: string;
  employee?: string;
  challengeId?: string;
  dateRange?: string;
  category?: "environment" | "social" | "governance" | "summary";
}

export interface ESGSummary {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  departmentRankings: { department: string; score: number }[];
  topEmployees: LeaderboardEntry[];
}
