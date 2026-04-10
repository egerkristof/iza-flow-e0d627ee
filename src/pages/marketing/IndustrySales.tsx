import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  TrendingUp, Target, MessageSquare, BarChart3, Trophy,
  AlertTriangle, Clock, Eye, Users, FileText, Zap,
} from "lucide-react";

const config = {
  tag: "Sales",
  tagIcon: <TrendingUp className="w-3.5 h-3.5" />,
  headline: "Your Best Seller's Instincts,",
  headlineAccent: "Running On Every Deal.",
  subtitle:
    "Qualification, objection handling, pricing judgment, competitive positioning. Stop hoping reps follow the playbook and start ensuring it.",
  lifecycleLabel: "The Deal Execution Lifecycle",
  stages: [
    { icon: <Target className="w-5 h-5" />, label: "Prospecting & ICP", color: "200 75% 36%" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Discovery & Qualification", color: "170 65% 32%" },
    { icon: <FileText className="w-5 h-5" />, label: "Solution Design", color: "42 85% 45%" },
    { icon: <Zap className="w-5 h-5" />, label: "Proposal & Negotiation", color: "12 75% 55%" },
    { icon: <Trophy className="w-5 h-5" />, label: "Close & Handoff", color: "280 60% 50%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Win/Loss Analysis", color: "340 65% 47%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your sales process.",
  painHeadline: "Where AI breaks sales without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Reps Ignore the Playbook",
      desc: "AI generates emails and proposals, but without your qualification criteria and pricing rules, every rep runs their own process.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Pipeline Surprises",
      desc: "Deals stall or slip because nobody enforced the discovery checklist. You find out at forecast time, not qualification time.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Coaching Leverage",
      desc: "Managers can't see which reps follow methodology and which freelance until the quarter is lost.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for pipeline discipline and deal execution.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every sales motion has a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Enterprise Sales",
      desc: "Multi-threaded deal management, stakeholder mapping, and value engineering governed by your playbook.",
      tags: ["MEDDPICC", "Value Selling", "Multi-thread"],
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "SMB & Velocity Sales",
      desc: "Rapid qualification, objection handling scripts, and pricing guardrails for high-volume motions.",
      tags: ["Qualification", "Scripting", "Velocity"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Channel & Partner Sales",
      desc: "Partner enablement materials, co-selling playbooks, and deal registration governance.",
      tags: ["Enablement", "Co-Selling", "Deal Reg"],
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Sales Operations",
      desc: "Forecast accuracy, pipeline hygiene rules, and territory planning standards across the organisation.",
      tags: ["Forecasting", "Pipeline", "Territory"],
    },
  ],
  ctaHeadline: "Ready to make every rep sell like your best?",
  ctaNote: "Start with one sales stage. See consistency improve before you scale.",
};

export default function IndustrySalesPage() {
  return <FunctionalLifecyclePage config={config} />;
}
