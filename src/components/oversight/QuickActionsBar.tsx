import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, BarChart3, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionsBar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get most recent active workbook
  const { data: recentWorkbook } = useQuery({
    queryKey: ["recent-active-workbook", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title")
        .in("status", ["active", "draft"])
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex flex-wrap gap-2">
      {recentWorkbook && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => navigate(`/workbooks/${recentWorkbook.id}`)}
        >
          <BookOpen className="mr-1.5 h-3.5 w-3.5" />
          Open "{recentWorkbook.title}"
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={() => navigate("/workbooks")}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        All Workbooks
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={() => navigate("/oversight")}
      >
        <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
        View All Tasks
      </Button>
    </div>
  );
}
