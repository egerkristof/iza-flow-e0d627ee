import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Handshake, Search, FileText, BarChart3, Globe,
  AlertTriangle, Clock, Eye, Users, Target, Scale,
} from "lucide-react";

const config = {
  tag: "Business Development",
  tagIcon: <Handshake className="w-3.5 h-3.5" />,
  headline: "Systematic Expansion",
  headlineAccent: "Beyond Direct Sales.",
  subtitle:
    "Partner evaluation, deal structuring, relationship cadence, and alliance governance. Turn opportunistic BD into a repeatable engine.",
  lifecycleLabel: "The Partnership & Pipeline Lifecycle",
  stages: [
    { icon: <Search className="w-5 h-5" />, label: "Opportunity Scanning", color: "155 72% 46%" },
    { icon: <Target className="w-5 h-5" />, label: "Partner Evaluation", color: "200 75% 36%" },
    { icon: <FileText className="w-5 h-5" />, label: "Deal Structuring", color: "42 85% 45%" },
    { icon: <Handshake className="w-5 h-5" />, label: "Negotiation & Close", color: "12 75% 55%" },
    { icon: <Users className="w-5 h-5" />, label: "Alliance Management", color: "280 60% 50%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Performance Review", color: "340 65% 47%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your BD pipeline.",
  painHeadline: "Where AI breaks BD without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Opportunistic, Not Strategic",
      desc: "BD teams chase every lead. Without codified partner criteria and deal-fit frameworks, effort scatters across low-value opportunities.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Relationship Amnesia",
      desc: "Key relationship context lives in individual heads. When people move, partnerships stall because institutional memory is lost.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Deal Governance",
      desc: "Complex partnership agreements get structured ad-hoc. Without deal templates and approval gates, risk accumulates quietly.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for strategic partnerships and alliance governance.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every BD function follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Handshake className="w-5 h-5" />,
      title: "Strategic Partnerships",
      desc: "Partner evaluation criteria, co-development frameworks, and governance cadences encoded into every alliance.",
      tags: ["Evaluation", "Co-Development", "Governance"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Channel Development",
      desc: "Channel partner onboarding, enablement standards, and performance management governed by your frameworks.",
      tags: ["Onboarding", "Enablement", "Performance"],
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "M&A & Corporate Development",
      desc: "Target screening criteria, due diligence checklists, and integration playbooks codified for repeatable execution.",
      tags: ["Screening", "Due Diligence", "Integration"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Ecosystem Strategy",
      desc: "Platform partnerships, API integrations, and ecosystem positioning governed by your strategic framework.",
      tags: ["Platform", "API", "Ecosystem"],
    },
  ],
  ctaHeadline: "Ready to turn BD into a strategic engine?",
  ctaNote: "Start with one partnership type. See discipline improve before you scale.",
};

export default function IndustryBizDevPage() {
  return <FunctionalLifecyclePage config={config} />;
}
