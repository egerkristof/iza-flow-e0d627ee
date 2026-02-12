const CommandCenterPage = () => {
  const columns = [
    { title: "Strategy", items: ["Q1 OKR Planning", "Market Expansion"] },
    { title: "Execution", items: ["Client Onboarding", "Proposal Pipeline"] },
    { title: "Review", items: ["Deal Retrospective"] },
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">📊 Command Center</h1>
        <p className="mt-1 text-muted-foreground">Strategic oversight — workbooks by outcome, drift indicators & lineage.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.title} className="flex min-w-[280px] flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{col.title}</h3>
            {col.items.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:glow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item}</span>
                  <span className="h-2 w-2 rounded-full bg-success" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Last activity: 2h ago</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandCenterPage;
