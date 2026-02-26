/** Types for the simulate-experience edge function response */

export interface ProtocolStep {
  order: number;
  title: string;
  type: "action" | "gate" | "ai_assist";
  description: string;
  output_type?: string;
}

export interface ProtocolPreview {
  title: string;
  source_playbook: string;
  description: string;
  estimated_duration?: string;
  steps: ProtocolStep[];
  compliance_gates: string[];
}

export interface CoachingQuestion {
  question: string;
  context: string;
  targets: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface CurrentSession {
  executor_name: string;
  protocol_title: string;
  current_step: string;
  step_number: number;
  total_steps: number;
  ai_draft_output: string;
  compliance_score?: number;
}

export interface WorkbookPreview {
  title: string;
  team_members: TeamMember[];
  active_protocols: string[];
  current_session: CurrentSession;
}

export interface ProjectedLearning {
  title: string;
  insight: string;
  category: "efficiency" | "quality" | "compliance" | "collaboration";
  refinement_action: string;
}

export interface ExperiencePreview {
  protocols: ProtocolPreview[];
  coaching_questions: CoachingQuestion[];
  workbook_preview: WorkbookPreview;
  projected_learnings: ProjectedLearning[];
}
