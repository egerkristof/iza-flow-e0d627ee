import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Target, Rocket, Users, BarChart3, Globe,
  AlertTriangle, Clock, Eye, Layers, Megaphone, Map,
} from "lucide-react";

const config = {
  tag: "Go-to-Market",
  tagIcon: <Target className="w-3.5 h-3.5" />,
  headline: "From First Signal to",
  headlineAccent: "Scaled Motion.",
  subtitle:
    "Market entry sequencing, ICP refinement, channel strategy, and expansion playbooks. Governed execution from insight to revenue.",
  lifecycleLabel: "The Launch & Expansion Lifecycle",
  stages: [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Market Analysis", color: "200 75% 36%" },
    { icon: <Target className="w-5 h-5" />, label: "ICP Definition", color: "170 65% 32%" },
    { icon: <Map className="w-5 h-5" />, label: "Channel Strategy", color: "42 85% 45%" },
    { icon: <Rocket className="w-5 h-5" />, label: "Launch Execution", color: "12 75% 55%" },
    { icon: <Megaphone className="w-5 h-5" />, label: "Demand Generation", color: "280 60% 50%" },
    { icon: <Layers className="w-5 h-5" />, label: "Scale & Expand", color: "340 65% 47%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your go-to-market motion.",
  painHeadline: "Where AI breaks GTM without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Messaging Drift",
      desc: "Every team interprets the ICP differently. AI generates content, but without positioning rules, messaging fragments across channels.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Launch Chaos",
      desc: "Cross-functional launches fall apart because nobody enforced the sequencing. Sales, marketing, and product run different timelines.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Expansion Playbook",
      desc: "Initial launch works, but scaling into new segments or geos is ad-hoc. Lessons from market one don't transfer to market two.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for cross-functional GTM coordination.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every GTM motion follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Rocket className="w-5 h-5" />,
      title: "New Product Launch",
      desc: "Launch sequencing, messaging hierarchy, and cross-functional coordination governed by your GTM playbook.",
      tags: ["Launch Plan", "Messaging", "Coordination"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Market Expansion",
      desc: "Geo entry criteria, localisation standards, and partner onboarding governed by expansion frameworks.",
      tags: ["Geo Entry", "Localisation", "Partners"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Segment Penetration",
      desc: "ICP refinement, competitive positioning, and segment-specific value propositions codified for consistency.",
      tags: ["ICP", "Positioning", "Value Props"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "PLG & Community-Led",
      desc: "Activation sequences, onboarding flows, and community engagement standards governed by growth frameworks.",
      tags: ["Activation", "Onboarding", "Community"],
    },
  ],
  ctaHeadline: "Ready to govern your go-to-market execution?",
  ctaNote: "Start with one launch or segment. See alignment improve before you scale.",
};

export default function IndustryGTMPage() {
  return <FunctionalLifecyclePage config={config} />;
}
