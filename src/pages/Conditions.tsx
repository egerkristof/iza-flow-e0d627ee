import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INITIAL_TILES } from "@/components/frame/frame-data";

const TAB_ORDER = ["economics", "standards", "compliance", "access", "intent"] as const;

export default function ConditionsPage() {
  const [params, setParams] = useSearchParams();
  const active = (params.get("tab") as (typeof TAB_ORDER)[number]) || "economics";

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-8 -ml-2">
            <Link to="/framed-chat">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to chat
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold">Conditions</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground rounded border px-1.5 py-0.5">
            Prototype
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Operating Conditions</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Define the five conditions any chat in your organization operates under. Set once,
            reuse everywhere. Bottom-up speed, top-down sanction.
          </p>
        </div>

        <Tabs
          value={active}
          onValueChange={(v) => setParams({ tab: v })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            {INITIAL_TILES.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="text-xs">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="economics" className="mt-6">
            <ConditionShell
              persona="CFO"
              title="Unit Economics"
              blurb="Tie every token consumed to a value standard. Cost per outcome, not cost per message."
            >
              <ValueStandardEditor />
            </ConditionShell>
          </TabsContent>

          <TabsContent value="standards" className="mt-6">
            <ConditionShell
              persona="Business"
              title="Standards"
              blurb="Attach the playbooks and quality rubrics that govern outputs in this chat."
            >
              <StandardsEditor />
            </ConditionShell>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ConditionShell
              persona="Legal / Risk"
              title="Compliance Binding"
              blurb="Bind this chat to compliance regimes. Controls fire automatically. Outputs become auditable."
            >
              <ComplianceEditor />
            </ConditionShell>
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <ConditionShell
              persona="IT"
              title="Access Scope"
              blurb="Scope what data and tools the chat can reach. Every call leaves an audit trail."
            >
              <AccessEditor />
            </ConditionShell>
          </TabsContent>

          <TabsContent value="intent" className="mt-6">
            <ConditionShell
              persona="Strategy"
              title="Strategic Intent"
              blurb="Link this chat to an organizational goal or KPI. Outcomes roll up to the board."
            >
              <IntentEditor />
            </ConditionShell>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ConditionShell({
  persona,
  title,
  blurb,
  children,
}: {
  persona: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider">
            {persona}
          </Badge>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{blurb}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm">Scope: Org</Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> New</Button>
        </div>
      </div>
      {children}
    </div>
  );
}

function ValueStandardEditor() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConditionRow
        title="Sales outbound — value per qualified reply"
        meta="€450 expected value · 1,200 tokens budget · margin floor 60%"
        status="ready"
      />
      <ConditionRow
        title="Internal research brief"
        meta="€80 expected value · 8,000 tokens budget · margin floor 40%"
        status="partial"
      />
      <ConditionRow
        title="Customer support draft"
        meta="Not defined — no standard attached"
        status="empty"
      />
    </div>
  );
}

function StandardsEditor() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConditionRow
        title="Sales Outreach v3"
        meta="Playbook · 12 steps · attached to 4 workbooks"
        status="ready"
      />
      <ConditionRow
        title="CFO communication tone"
        meta="Quality rubric · 6 criteria · last reviewed 2 weeks ago"
        status="ready"
      />
      <ConditionRow
        title="Outbound subject line A/B rubric"
        meta="Draft — needs review by Head of Growth"
        status="partial"
      />
    </div>
  );
}

function ComplianceEditor() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConditionRow
        title="EU AI Act — Limited Risk"
        meta="3 controls · transparency disclosure required on output"
        status="ready"
      />
      <ConditionRow
        title="DORA — ICT third party register"
        meta="2 controls · model provider declared"
        status="partial"
      />
      <ConditionRow
        title="Internal model risk policy v2"
        meta="Not bound to this chat"
        status="empty"
      />
      <ConditionRow
        title="GDPR — PII handling"
        meta="Blocking · PII redaction enforced on every input"
        status="ready"
      />
    </div>
  );
}

function AccessEditor() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConditionRow title="CRM (Salesforce)" meta="Read · 12 objects exposed" status="ready" />
      <ConditionRow title="Open web search" meta="Read · domain allowlist applied" status="ready" />
      <ConditionRow
        title="Internal knowledge base"
        meta="Not connected — would unlock 380 documents"
        status="empty"
      />
      <ConditionRow title="Email send" meta="Disabled — write access not granted" status="empty" />
    </div>
  );
}

function IntentEditor() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConditionRow
        title="Q2 OKR — 30 net-new enterprise meetings"
        meta="Owner: VP Sales · 12 of 30 booked"
        status="ready"
      />
      <ConditionRow
        title="Margin discipline initiative"
        meta="Owner: CFO · ties to Unit Economics tile"
        status="partial"
      />
      <ConditionRow
        title="Brand voice consistency"
        meta="No KPI defined yet"
        status="empty"
      />
    </div>
  );
}

function ConditionRow({
  title,
  meta,
  status,
}: {
  title: string;
  meta: string;
  status: "ready" | "partial" | "empty";
}) {
  const dot =
    status === "ready" ? "bg-emerald-500" : status === "partial" ? "bg-amber-500" : "bg-destructive";
  const label = status === "ready" ? "Defined" : status === "partial" ? "Partial" : "Undefined";
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <p className="text-xs text-muted-foreground">{meta}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs">Assign</Button>
        </div>
      </CardContent>
    </Card>
  );
}