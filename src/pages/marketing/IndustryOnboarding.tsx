import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  GraduationCap, BookOpen, Users, CheckCircle2, BarChart3,
  AlertTriangle, Clock, Eye, Target, Layers, Brain,
} from "lucide-react";

const config = {
  tag: "Onboarding & Enablement",
  tagIcon: <GraduationCap className="w-3.5 h-3.5" />,
  headline: "Every New Hire Performing",
  headlineAccent: "Like a Veteran in Weeks.",
  subtitle:
    "Encode your best people's judgment into protocols that compress ramp time and preserve tribal knowledge across generations of hires.",
  lifecycleLabel: "The Knowledge Transfer Lifecycle",
  stages: [
    { icon: <BookOpen className="w-5 h-5" />, label: "Knowledge Capture", color: "45 85% 55%" },
    { icon: <Layers className="w-5 h-5" />, label: "Curriculum Design", color: "200 75% 36%" },
    { icon: <Users className="w-5 h-5" />, label: "Guided Onboarding", color: "170 65% 32%" },
    { icon: <Brain className="w-5 h-5" />, label: "Skill Assessment", color: "42 85% 45%" },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: "Certification", color: "280 60% 50%" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Continuous Learning", color: "340 65% 47%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your enablement lifecycle.",
  painHeadline: "Where AI breaks enablement without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Tribal Knowledge Loss",
      desc: "Your best people's judgment lives in their heads. AI can't use what hasn't been captured, so new hires start from scratch.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "12-Month Ramp Times",
      desc: "Without structured knowledge transfer, every hire takes a year to reach competence. That's a year of suboptimal output.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "No Skill Visibility",
      desc: "Managers can't tell which hires are ready for independent work and which still need support until mistakes surface.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for knowledge transfer and capability building.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every enablement challenge follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Users className="w-5 h-5" />,
      title: "New Hire Onboarding",
      desc: "Role-specific knowledge paths, mentor protocols, and competency milestones governed by your standards.",
      tags: ["Knowledge Paths", "Mentoring", "Milestones"],
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Sales Enablement",
      desc: "Product knowledge, competitive intelligence, and selling methodology encoded for every new rep.",
      tags: ["Product Knowledge", "Competitive", "Methodology"],
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Technical Training",
      desc: "Tool proficiency, process adherence, and technical standards codified into progressive learning paths.",
      tags: ["Tools", "Processes", "Standards"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Leadership Development",
      desc: "Management frameworks, decision-making protocols, and coaching methodologies for emerging leaders.",
      tags: ["Frameworks", "Coaching", "Development"],
    },
  ],
  ctaHeadline: "Ready to compress ramp time and preserve expertise?",
  ctaNote: "Start with one role or team. See ramp time improve before you scale.",
};

export default function IndustryOnboardingPage() {
  return <FunctionalLifecyclePage config={config} />;
}
