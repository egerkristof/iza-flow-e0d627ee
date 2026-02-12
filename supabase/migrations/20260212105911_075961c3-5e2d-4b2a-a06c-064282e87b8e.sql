
-- Add trigger conditions and playbook binding to working_preferences
ALTER TABLE public.working_preferences
  ADD COLUMN trigger_intents TEXT[] DEFAULT '{}',
  ADD COLUMN trigger_keywords TEXT[] DEFAULT '{}',
  ADD COLUMN bound_playbook_ids TEXT[] DEFAULT '{}',
  ADD COLUMN condition_label TEXT;

-- Drop the old unique constraint and replace with one that includes condition_label
ALTER TABLE public.working_preferences DROP CONSTRAINT IF EXISTS working_preferences_user_id_scope_type_scope_id_preference__key;
ALTER TABLE public.working_preferences ADD CONSTRAINT working_preferences_unique_pref UNIQUE(user_id, scope_type, scope_id, preference_key, condition_label);
