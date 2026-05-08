import FunctionalLifecyclePage from "@/components/marketing/FunctionalLifecyclePage";
import {
  Compass, Search, Layers, GitBranch, ScrollText, RefreshCw,
  AlertTriangle, Clock, Users, Building2, Handshake, Target, Globe,
} from "lucide-react";

const config = {
  tag: "Strategy Office",
  tagIcon: <Compass className="w-3.5 h-3.5" />,
  headline: "The Bridge Between",
  headlineAccent: "Boardroom and Operating Floor.",
  subtitle:
    "For the small team that has to know everything, fast, without being the expert on anything. Strategy, corp dev, and business development cells get a standing 360 view, a routing rail into busy expert teams, and a memory that compounds across every brief.",
  lifecycleLabel: "The Strategy Office Lifecycle",
  stages: [
    { icon: <Search className="w-5 h-5" />, label: "Scan", color: "220 65% 32%" },
    { icon: <Layers className="w-5 h-5" />, label: "Synthesise", color: "200 75% 36%" },
    { icon: <GitBranch className="w-5 h-5" />, label: "Route", color: "42 85% 45%" },
    { icon: <ScrollText className="w-5 h-5" />, label: "Decide", color: "12 75% 55%" },
    { icon: <RefreshCw className="w-5 h-5" />, label: "Remember", color: "155 72% 46%" },
  ],
  lifecycleNote:
    "LIZA runs the loop. Every scan, every routed question, every expert answer becomes a reusable strategic asset.",
  painHeadline: "Where the Strategy Office breaks today",
  pains: [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Every brief stitched from scratch",
      desc: "Each new target, partnership, or competitor request starts at zero. PDFs, web search, and old emails get hand-stitched into a fresh deck. Last quarter's research is unfindable.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Expert answers stuck for days",
      desc: "Fleet, finance, regulatory, and engineering experts are busy. Strategic questions wait two to eight days for a reply. Decisions slip while the pipeline moves on.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "The team that only takes",
      desc: "Strategy teams are perceived internally as one-way: they ask, they never give back. Expert teams deprioritise their requests. Credibility erodes brief by brief.",
    },
  ],
  howItWorksNote:
    "The same four-step LIZA system, tuned for synthesis and routing instead of execution.",
  useCaseHeadline: "Where it shows up first",
  useCaseNote: "Three starter motions every Strategy Office runs. The pattern is the same in satcom, banking, pharma, and federated holdings.",
  useCases: [
    {
      icon: <Handshake className="w-5 h-5" />,
      title: "Inbound Partnership Evaluation",
      desc: "An operator, supplier, or target reaches out. Liza assembles the 360 view and routes the four questions only fleet, finance, and legal can answer. Answer captured once, reusable forever.",
      tags: ["360 view", "Expert routing", "Memory"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Competitor & Market Move Briefs",
      desc: "When a competitor moves or a sector shifts, Liza compiles the brief, flags what your team already knows, and surfaces what only your senior partner remembers.",
      tags: ["Sector scan", "Move detection", "Senior memory"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Sector Landscape on Demand",
      desc: "Board asks for a sector view by Friday. Liza renders a current landscape with named players, ownership chains, regulatory posture, and prior internal conversations attached.",
      tags: ["Landscape", "Ownership graph", "Prior context"],
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Cross-Subsidiary Strategy Sync",
      desc: "For federated groups, the holding's Strategy Office becomes the institutional memory across subsidiaries. Every brief, every routed answer, available to the next team that asks.",
      tags: ["Federated", "Group memory", "Reuse"],
    },
  ],
  ctaHeadline: "Become the team that walks in with answers, not questions.",
  ctaNote: "Start with one live workstream. End the month with a standing 360 view and an expert routing rail your colleagues actually want to use.",
  deckHref: "/strategy-office",
  deckLabel: "View the Sales Deck",
};

export default function IndustryStrategyOfficePage() {
  return <FunctionalLifecyclePage config={config} />;
}