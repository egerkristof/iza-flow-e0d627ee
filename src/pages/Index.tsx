import { BookOpen, Library, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome to LizaOS</h1>
        <p className="mt-2 text-muted-foreground">
          Your context management cockpit. Select a workspace from the sidebar to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          title="Workbooks"
          description="Open a Workbook to execute playbook-guided protocols and manage strategic outcomes."
          href="/workbooks"
        />
        <QuickCard
          icon={<Library className="h-5 w-5 text-success" />}
          title="Context"
          description="Curate items & bundles, review drift, ingest knowledge, and manage the graph."
          href="/context"
        />
        <QuickCard
          icon={<BarChart3 className="h-5 w-5 text-warning" />}
          title="Oversight"
          description="Kanban view of workbooks, drift indicators, and task lineage for leaders."
          href="/oversight"
        />
      </div>
    </div>
  );
};

function QuickCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:glow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}

export default Index;
