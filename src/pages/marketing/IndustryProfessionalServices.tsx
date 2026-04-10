import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Briefcase, FileText, Users, BarChart3, BookOpen,
  AlertTriangle, Clock, Eye, CheckCircle2, Layers, Target, RefreshCw,
} from "lucide-react";

const config = {
  tag: "Professional Services",
  tagIcon: <Briefcase className="w-3.5 h-3.5" />,
  headline: "Encode Your Best Consultant's",
  headlineAccent: "Methodology Into Every Engagement.",
  subtitle:
    "From scoping to delivery to knowledge harvest. Stop losing institutional knowledge when senior people leave or switch accounts.",
  lifecycleLabel: "The Engagement Delivery Lifecycle",
  stages: [
    { icon: <Target className="w-5 h-5" />, label: "Scoping & Qualification", color: "200 75% 36%" },
    { icon: <FileText className="w-5 h-5" />, label: "Proposal & Pricing", color: "170 65% 32%" },
    { icon: <Users className="w-5 h-5" />, label: "Team Staffing", color: "42 85% 45%" },
    { icon: <Layers className="w-5 h-5" />, label: "Delivery Execution", color: "12 75% 55%" },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: "Quality Review", color: "280 60% 50%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Knowledge Harvest", color: "340 65% 47%" },
    { icon: <RefreshCw className="w-5 h-5" />, label: "Continuous Improvement", color: "120 45% 40%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your engagement delivery process.",
  painHeadline: "Where AI breaks consulting without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Inconsistent Deliverables",
      desc: "Every consultant reinvents the wheel. AI drafts documents without your methodology, so quality varies wildly between teams.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Knowledge Walks Out the Door",
      desc: "Senior consultants leave and take years of client knowledge, frameworks, and lessons learned with them.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Visibility Into Delivery",
      desc: "Partners can't see which engagements follow methodology and which drift until the client escalates.",
    },
  ],
  howItWorksNote:
    "The same four-step system of reasoning, built for consulting excellence and ISO 20700 alignment.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote:
    "Professional services spans many disciplines. The lifecycle governance pattern is the same.",
  useCases: [
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Management Consulting",
      desc: "Strategy frameworks, diagnostic methodologies, and client deliverable standards encoded into every engagement.",
      tags: ["Frameworks", "Diagnostics", "Deliverables"],
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Advisory & Audit",
      desc: "Compliance checklists, audit methodologies, and evidence gathering governed by your quality standards.",
      tags: ["Compliance", "Audit Trail", "Evidence"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Implementation Services",
      desc: "Technical delivery playbooks, change management protocols, and go-live checklists standardised across teams.",
      tags: ["Playbooks", "Change Mgmt", "Go-Live"],
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Research & Insights",
      desc: "Research methodologies, analysis frameworks, and reporting standards that ensure every insight meets quality benchmarks.",
      tags: ["Methodology", "Analysis", "Reporting"],
    },
  ],
  ctaHeadline: "Ready to scale your best consultant's judgment?",
  ctaNote: "Start with one engagement type. See consistency improve before you scale.",
};

export default function IndustryProfessionalServicesPage() {
  return <FunctionalLifecyclePage config={config} />;
}
