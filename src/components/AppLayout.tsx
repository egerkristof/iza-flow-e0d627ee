import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResearchLens } from "@/components/ResearchLens";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [lensOpen, setLensOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-border px-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative"
                title="Research Lens"
                onClick={() => setLensOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <ResearchLens open={lensOpen} onOpenChange={setLensOpen} />
    </SidebarProvider>
  );
}
