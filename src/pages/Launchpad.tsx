const LaunchpadPage = () => {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🚀 The Launchpad</h1>
        <p className="mt-1 text-muted-foreground">Your workbook execution cockpit — action grid & guided protocols.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder action cards */}
        {["Draft Proposal", "Client Research", "Deal Review", "Pricing Analysis", "Competitive Intel", "Onboarding Setup"].map((action) => (
          <div
            key={action}
            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:glow-sm cursor-pointer"
          >
            <h3 className="font-medium text-foreground">{action}</h3>
            <p className="text-xs text-muted-foreground">Click to lock into this protocol</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-3 text-lg font-medium">Active Missions</h2>
        <div className="rounded-lg border border-border/50 bg-card p-4 text-sm text-muted-foreground">
          No active missions yet. Click an action card above to begin.
        </div>
      </div>
    </div>
  );
};

export default LaunchpadPage;
