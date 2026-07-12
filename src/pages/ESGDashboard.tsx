import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { ChartBar, Award, ShieldCheck, Sparkles, Users, Bell, Trophy, ClipboardList, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  emissionFactors,
  carbonTransactions,
  environmentalGoals,
  csrActivities,
  diversityMetrics,
  trainingCompletions,
  esgPolicies,
  internalAudits,
  complianceIssues,
  badges,
  rewards,
  challenges,
  leaderboard,
  notifications,
  getESGSummary,
  calculateCarbonEmission,
  ESGSummary,
} from "@/lib/esgData";

const ESGDashboard = () => {
  const summary = useMemo(() => getESGSummary(), []);
  const { toast } = useToast();

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageMargin = 15;
    const contentWidth = pageWidth - pageMargin * 2;
    let y = 20;

    const ensurePage = (lines = 1) => {
      if (y + lines * 6 > 285) {
        doc.addPage();
        y = 20;
      }
    };

    const addParagraph = (text: string, options: { bold?: boolean; size?: number; indent?: number } = {}) => {
      const indent = options.indent ?? 0;
      const maxWidth = contentWidth - indent;
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.setFont("helvetica", options.bold ? "bold" : "normal");
      doc.setFontSize(options.size ?? 10);

      ensurePage(lines.length);
      doc.text(lines, pageMargin + indent, y);
      y += lines.length * 6;
    };

    const addSection = (title: string) => {
      addParagraph(title, { bold: true, size: 12 });
      y += 2;
    };

    const addBullet = (text: string) => {
      addParagraph(`- ${text}`, { indent: 4 });
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("GreenStream ESG Performance Report", pageWidth / 2, y, { align: "center" });
    y += 12;

    addParagraph(`Generated: ${new Date().toLocaleString()}`, { size: 9 });
    y += 4;

    addSection("Executive Summary");
    addParagraph(`Overall ESG Score: ${summary.overallScore}/100`);
    addParagraph(`Environmental Score: ${summary.environmentalScore}/100`);
    addParagraph(`Social Score: ${summary.socialScore}/100`);
    addParagraph(`Governance Score: ${summary.governanceScore}/100`);
    y += 4;

    addSection("Top Departments");
    summary.departmentRankings.forEach((department) => {
      addBullet(`${department.department}: ${department.score}/100`);
    });
    y += 4;

    addSection("Top Employees");
    leaderboard.slice(0, 5).forEach((entry, idx) => {
      addBullet(`${idx + 1}. ${entry.employee} (${entry.department}) — ${entry.score} pts`);
    });
    y += 4;

    addSection("Carbon Transactions");
    carbonTransactions.slice(0, 4).forEach((tx) => {
      const factor = emissionFactors.find((factor) => factor.id === tx.emissionFactorId);
      addBullet(`${tx.department}: ${tx.type} ${tx.quantity} ${factor?.unit ?? ""} — ${tx.carbonEmitted} kg CO2`);
    });
    y += 4;

    addSection("Current ESG Challenges");
    challenges.slice(0, 4).forEach((challenge) => {
      addBullet(`${challenge.title} — ${challenge.progress}% complete, ${challenge.rewardPoints} pts`);
    });
    y += 4;

    addSection("Governance & Compliance Highlights");
    internalAudits.slice(0, 3).forEach((audit) => {
      addBullet(`${audit.title} (${audit.department}) — ${audit.findings} findings`);
    });
    complianceIssues.slice(0, 3).forEach((issue) => {
      addBullet(`${issue.owner}: ${issue.severity} severity, due ${issue.dueDate}`);
    });

    const filename = `greenstream-esg-report-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);

    toast({
      title: "Report generated",
      description: `PDF downloaded: ${filename}`,
      duration: 3000,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">ESG Command Center</p>
          <h1 className="text-3xl font-bold">Environmental, Social & Governance Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link to="/dashboard">Back to Live Dashboard</Link></Button>
          <Button variant="secondary" onClick={generateReport}>Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall ESG Score</p>
              <p className="mt-2 text-3xl font-bold">{summary.overallScore}</p>
            </div>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Combined environmental, social, and governance performance.</p>
        </Card>

        <Card className="p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Environmental Score</p>
              <p className="mt-2 text-2xl font-semibold">{summary.environmentalScore}</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">Carbon, energy, and sustainability performance.</p>
        </Card>

        <Card className="p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Social Score</p>
              <p className="mt-2 text-2xl font-semibold">{summary.socialScore}</p>
            </div>
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-sm text-muted-foreground">CSR participation, diversity, and training metrics.</p>
        </Card>

        <Card className="p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Governance Score</p>
              <p className="mt-2 text-2xl font-semibold">{summary.governanceScore}</p>
            </div>
            <ClipboardList className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-sm text-muted-foreground">Policy, compliance, and audit readiness.</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="space-y-4 xl:col-span-2">
          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Department Ranking</p>
                <h2 className="text-xl font-semibold">Top departments</h2>
              </div>
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="space-y-3">
              {summary.departmentRankings.map((department) => (
                <div key={department.department} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-semibold">{department.department}</p>
                    <p className="text-xs text-muted-foreground">ESG score</p>
                  </div>
                  <p className="text-xl font-bold">{department.score}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Top Employees</p>
                <h2 className="text-xl font-semibold">Leaderboard</h2>
              </div>
              <Award className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry) => (
                <div key={entry.employee} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-semibold">{entry.employee}</p>
                    <p className="text-xs text-muted-foreground">{entry.department}</p>
                  </div>
                  <p className="text-lg font-bold">{entry.score}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <h2 className="text-xl font-semibold">Recent Alerts</h2>
              </div>
              <Bell className="w-6 h-6 text-violet-400" />
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <Badge variant={notification.read ? "secondary" : "destructive"}>{notification.read ? "Read" : "New"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Carbon Trend</p>
                <h2 className="text-xl font-semibold">Emissions performance</h2>
              </div>
              <ChartBar className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-3">
              {carbonTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{tx.department}</p>
                    <Badge variant={tx.type === "offset" ? "secondary" : "default"}>{tx.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.quantity} × {emissionFactors.find((f) => f.id === tx.emissionFactorId)?.factor ?? 0} {emissionFactors.find((f) => f.id === tx.emissionFactorId)?.unit}</p>
                  <p className="text-sm mt-1">Carbon emitted: {tx.carbonEmitted.toFixed(0)} kg CO₂</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Challenge Progress</p>
                <h2 className="text-xl font-semibold">Active Gamification</h2>
              </div>
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{challenge.title}</p>
                    <Badge>{challenge.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${challenge.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{challenge.progress}% complete • {challenge.rewardPoints} points</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">CSR Participation</p>
                <h2 className="text-xl font-semibold">Social Activity</h2>
              </div>
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <div className="space-y-3">
              {csrActivities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant={activity.approved ? "secondary" : "outline"}>{activity.approved ? "Approved" : "Pending"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.employee} • {activity.department}</p>
                  <p className="text-xs text-muted-foreground mt-1">Points: {activity.points} • Completed: {activity.completionDate}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default ESGDashboard;
