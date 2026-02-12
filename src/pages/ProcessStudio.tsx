const ProcessStudioPage = () => {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🏗️ Process Studio</h1>
        <p className="mt-1 text-muted-foreground">Define, curate, and manage the knowledge graph — ingestion, drift, modules & health.</p>
      </div>

      {/* Knowledge Health Widget */}
      <div className="rounded-lg border border-border/50 bg-card p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Knowledge Health</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-success text-xl font-bold text-success">
            87%
          </div>
          <div className="text-sm text-muted-foreground">
            <p>3 items stale · 1 expired · 12 active bundles</p>
            <p className="mt-1 text-xs">Last scan: 4h ago</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Knowledge Loom */}
        <div className="rounded-lg border-2 border-dashed border-border/50 bg-card/50 p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">📂 Drop documents here</p>
          <p className="mt-1 text-xs text-muted-foreground">Smart Ingestion — auto-extract Playbooks & Directives</p>
        </div>

        {/* Drift Inbox */}
        <div className="rounded-lg border border-border/50 bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Drift Inbox</h2>
          <div className="space-y-2">
            {["5 deviations in Pricing Step", "3 users edited Onboarding Flow", "Compliance rule drift detected"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2 text-sm">
                <span>{item}</span>
                <span className="text-xs text-warning">Review</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStudioPage;
