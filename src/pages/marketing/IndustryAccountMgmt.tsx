import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Users, HeartPulse, TrendingUp, BarChart3, Shield,
  AlertTriangle, Clock, Eye, RefreshCw, Bell, Target,
} from "lucide-react";

const config = {
  tag: "Account Management",
  tagIcon: <Users className="w-3.5 h-3.5" />,
  headline: "Protect Revenue Before",
  headlineAccent: "The Data Tells You It's At Risk.",
  subtitle:
    "Renewal signals, expansion timing, risk detection. Encode your best account manager's intuition into every customer relationship.",
  lifecycleLabel: "The Retention & Growth Lifecycle",
  stages: [
    { icon: <Users className="w-5 h-5" />, label: "Onboarding Handoff", color: "180 65% 45%" },
    { icon: <HeartPulse className="w-5 h-5" />, label: "Health Monitoring", color: "200 75% 36%" },
    { icon: <Bell className="w-5 h-5" />, label: "Risk Detection", color: "12 75% 55%" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Expansion Signals", color: "42 85% 45%" },
    { icon: <RefreshCw className="w-5 h-5" />, label: "Renewal Execution", color: "280 60% 50%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Portfolio Review", color: "340 65% 47%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your account lifecycle.",
  painHeadline: "Where AI breaks account management without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Reactive, Not Proactive",
      desc: "AI surfaces data, but without codified health signals and response playbooks, teams react to churn instead of preventing it.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Expansion Blindness",
      desc: "Upsell and cross-sell signals exist in conversations and usage, but without capture protocols, revenue sits on the table.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Inconsistent QBRs",
      desc: "Every account manager runs reviews differently. Without standardised frameworks, strategic accounts get varying levels of attention.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for customer retention and portfolio growth.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every account function follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Customer Success",
      desc: "Health scoring frameworks, intervention playbooks, and adoption milestones governed by your retention standards.",
      tags: ["Health Score", "Interventions", "Adoption"],
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Strategic Accounts",
      desc: "Account plans, executive relationship mapping, and value realisation frameworks codified for top-tier clients.",
      tags: ["Account Plans", "Exec Mapping", "Value"],
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Renewal Management",
      desc: "Renewal timelines, risk assessments, and negotiation guardrails standardised across the portfolio.",
      tags: ["Timelines", "Risk", "Negotiation"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Expansion Revenue",
      desc: "Cross-sell signal detection, upsell qualification criteria, and expansion playbooks for systematic growth.",
      tags: ["Cross-Sell", "Upsell", "Growth"],
    },
  ],
  ctaHeadline: "Ready to protect and grow your accounts systematically?",
  ctaNote: "Start with one account segment. See retention improve before you scale.",
};

export default function IndustryAccountMgmtPage() {
  return <FunctionalLifecyclePage config={config} />;
}
