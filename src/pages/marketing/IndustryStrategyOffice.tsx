import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Compass, FileText, Layers, MessageSquare, ScrollText, BookMarked,
  AlertTriangle, Clock, Brain, Building2, Handshake, Target, Globe,
} from "lucide-react";

const config = {
  tag: "Strategy Office",
  tagIcon: <Compass className="w-3.5 h-3.5" />,
  headline: "The team that has to know everything.",
  headlineAccent: "Without being expert at anything.",
  subtitle:
    "Every Monday a new brief on a new target, a new partner, a new sector. No canonical source. Four busy experts who actually know the answer. A board that decides on Friday. Most strategy teams stitch each brief from scratch, then wait days for the answers that matter.",
  lifecycleLabel: "How a brief moves through the Strategy Office",
  stages: [
    { icon: <FileText className="w-5 h-5" />, label: "Brief lands", color: "220 65% 32%" },
    { icon: <Layers className="w-5 h-5" />, label: "Stitch the 360", color: "200 75% 36%" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Ask the experts", color: "42 85% 45%" },
    { icon: <ScrollText className="w-5 h-5" />, label: "Recommend", color: "12 75% 55%" },
    { icon: <BookMarked className="w-5 h-5" />, label: "File and forget", color: "0 72% 50%" },
  ],
  lifecycleNote:
    "Every step today loses something. Context, time, expert attention, and the prior work that already answered half the question.",
  painHeadline: "What slows every brief",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Every brief starts at zero",
      desc: "The 360 view of a target, partner, or competitor gets hand-stitched from PDFs, web tabs, old emails, and three different drives. Last quarter's research on the same name is somewhere, but no one can find it in time.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "The four people who know are busy",
      desc: "Fleet, finance, regulatory, engineering. They have day jobs. Strategic questions wait two to eight days for the one paragraph that unlocks the recommendation. The deal moves before the answer comes back.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Institutional memory walks out the door",
      desc: "The senior partner remembers why the last conversation with this operator stalled in 2019. When they leave, that context leaves with them. Every new analyst rebuilds the map alone.",
    },
  ],
  howItWorksNote:
    "A working strategy office runs on captured context, not heroics. The pattern is the same whether you sit in satcom, banking, pharma, or a federated holding.",
  useCaseHeadline: "Three motions every strategy team already runs",
  useCaseNote: "Same workflow in different jackets. Each one compounds the next when the answers are captured once and reused.",
  useCases: [
    {
      icon: <Handshake className="w-5 h-5" />,
      title: "Inbound Partnership Evaluation",
      desc: "An operator, supplier, or target lands in the inbox. The 360 view assembles itself. The four questions only fleet, finance, and legal can answer get routed in their format, on their schedule. The answers stay, ready for the next deal.",
      tags: ["360 view", "Routed questions", "Captured answers"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Competitor & Market Move Briefs",
      desc: "A competitor moves. The brief compiles itself, flags what your team already knew, and surfaces the senior partner's prior take so you do not relearn it cold.",
      tags: ["Sector scan", "Prior takes", "No relearning"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Sector Landscape on Demand",
      desc: "The board wants a sector view by Friday. You hand back a current landscape with named players, ownership chains, regulatory posture, and every prior internal conversation attached.",
      tags: ["Landscape", "Ownership graph", "Internal context"],
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Cross-Subsidiary Strategy Sync",
      desc: "In federated groups, the holding's strategy office becomes the institutional memory across subsidiaries. Every brief, every routed answer, available to the next team that asks the same question six months later.",
      tags: ["Federated", "Group memory", "Compounding"],
    },
  ],
  ctaHeadline: "Walk into the next board meeting with answers, not apologies.",
  ctaNote: "Pick one live workstream. In 30 days you have a standing 360 view, a routing rail your experts will actually use, and a memory that compounds with every brief.",
  deckHref: "/strategy-office",
  deckLabel: "View the Sales Deck",
  showCalculator: false,
  hideDiagnostic: true,
};

export default function IndustryStrategyOfficePage() {
  return <FunctionalLifecyclePage config={config} />;
}