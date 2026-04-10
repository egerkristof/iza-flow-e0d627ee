import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Megaphone, PenTool, BarChart3, Users, Target,
  AlertTriangle, Clock, Eye, FileText, Layers, Sparkles,
} from "lucide-react";

const config = {
  tag: "Marketing",
  tagIcon: <Megaphone className="w-3.5 h-3.5" />,
  headline: "Stop Guessing Which",
  headlineAccent: "Message Lands.",
  subtitle:
    "Positioning logic, segment messaging, campaign judgment. Encode what works so every piece of content reflects your best thinking.",
  lifecycleLabel: "The Positioning & Campaign Lifecycle",
  stages: [
    { icon: <Target className="w-5 h-5" />, label: "Audience & Segmentation", color: "330 70% 55%" },
    { icon: <PenTool className="w-5 h-5" />, label: "Positioning & Messaging", color: "200 75% 36%" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Content Creation", color: "42 85% 45%" },
    { icon: <Megaphone className="w-5 h-5" />, label: "Campaign Execution", color: "12 75% 55%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Performance Analysis", color: "280 60% 50%" },
    { icon: <Layers className="w-5 h-5" />, label: "Optimise & Scale", color: "170 65% 32%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your marketing lifecycle.",
  painHeadline: "Where AI breaks marketing without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Brand Fragmentation",
      desc: "AI generates content fast, but without your positioning rules and tone guidelines, every channel sounds different.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Segment Confusion",
      desc: "Teams create content for vague audiences. Without codified ICPs and messaging matrices, campaigns miss the mark.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Learning Loop",
      desc: "What worked last quarter doesn't inform this quarter. Campaign insights stay in spreadsheets, not in your AI workflows.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for brand consistency and campaign excellence.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every marketing function follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <PenTool className="w-5 h-5" />,
      title: "Content Marketing",
      desc: "Editorial standards, SEO frameworks, and brand voice guidelines encoded into every piece of content AI helps create.",
      tags: ["Brand Voice", "SEO", "Editorial"],
    },
    {
      icon: <Megaphone className="w-5 h-5" />,
      title: "Demand Generation",
      desc: "Campaign playbooks, lead scoring criteria, and nurture sequences governed by your conversion frameworks.",
      tags: ["Campaigns", "Lead Scoring", "Nurture"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Product Marketing",
      desc: "Positioning documents, competitive battlecards, and launch messaging governed by your market intelligence.",
      tags: ["Positioning", "Battlecards", "Launches"],
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Marketing Operations",
      desc: "Attribution models, reporting standards, and budget allocation frameworks codified for consistency.",
      tags: ["Attribution", "Reporting", "Budgets"],
    },
  ],
  ctaHeadline: "Ready to make every campaign reflect your best thinking?",
  ctaNote: "Start with one content type or campaign. See consistency improve before you scale.",
};

export default function IndustryMarketingPage() {
  return <FunctionalLifecyclePage config={config} />;
}
