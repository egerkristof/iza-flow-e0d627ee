import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Radio, MessageSquare, CheckCircle2, BarChart3, RefreshCw,
  AlertTriangle, Clock, Eye, FileText, Target, Brain, Users,
} from "lucide-react";

const config = {
  tag: "Meeting Intelligence",
  tagIcon: <Radio className="w-3.5 h-3.5" />,
  headline: "Every Meeting Builds",
  headlineAccent: "Organisational Memory.",
  subtitle:
    "From 1:1s to team syncs to board reviews. Extract decisions, detect drift, and drive follow-through so nothing falls between the cracks.",
  lifecycleLabel: "The Decision Capture Lifecycle",
  stages: [
    { icon: <FileText className="w-5 h-5" />, label: "Agenda & Prep", color: "15 80% 55%" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Discussion & Decisions", color: "200 75% 36%" },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: "Action Extraction", color: "42 85% 45%" },
    { icon: <Target className="w-5 h-5" />, label: "Follow-Through", color: "12 75% 55%" },
    { icon: <Brain className="w-5 h-5" />, label: "Drift Detection", color: "280 60% 50%" },
    { icon: <RefreshCw className="w-5 h-5" />, label: "Knowledge Update", color: "170 65% 32%" },
  ],
  lifecycleNote:
    "LIZA governs AI execution across every stage of your meeting lifecycle.",
  painHeadline: "Where AI breaks meetings without governance",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Decisions Vanish",
      desc: "AI transcribes meetings, but without decision extraction protocols, key commitments get buried in transcripts nobody reads.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Action Item Graveyard",
      desc: "Every meeting generates actions. Without follow-through governance, the same issues resurface meeting after meeting.",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Strategic Drift",
      desc: "Teams make decisions that contradict prior commitments. Without drift detection, strategy fragments across dozens of meetings.",
    },
  ],
  howItWorksNote:
    "The same four-step system, built for decision capture and organisational coherence.",
  useCaseHeadline: "Where the pattern applies",
  useCaseNote: "Every meeting type follows a lifecycle. The governance pattern is the same.",
  useCases: [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Leadership Meetings",
      desc: "Strategic decisions, resource commitments, and priority shifts captured, tracked, and fed back into operations.",
      tags: ["Strategy", "Decisions", "Priorities"],
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Team Standups & Syncs",
      desc: "Blockers, commitments, and progress updates extracted and connected to project context automatically.",
      tags: ["Blockers", "Progress", "Context"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Client Meetings",
      desc: "Requirements, objections, and commitments captured and routed to the right teams and workflows.",
      tags: ["Requirements", "Commitments", "Routing"],
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Board & Investor Updates",
      desc: "Governance discussions, compliance decisions, and strategic commitments tracked with full audit trails.",
      tags: ["Governance", "Compliance", "Audit"],
    },
  ],
  ctaHeadline: "Ready to make every meeting count?",
  ctaNote: "Start with one meeting type. See follow-through improve before you scale.",
};

export default function IndustryMeetingsPage() {
  return <FunctionalLifecyclePage config={config} />;
}
