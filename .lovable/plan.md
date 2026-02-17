

# Closing the Knowledge-to-Playbook Loop

## The Problem

Right now, the process owner's world is split across two disconnected screens:

- **My Knowledge** (6 confusing tabs): Captures, Documents, Sources, Goals, Working Style, My Context Items -- all flat, no clear workflow, unclear what to do with them
- **Playbooks** (domains/bundles): Where extracted knowledge lives operationally, but with zero connection back to the source thinking

The lifecycle is broken:
```text
Source Thinking --> Extract --> Playbooks --> Execute --> Feedback --> ???
       ^                                                              |
       |______________________________________________________________|
                          (this loop doesn't exist)
```

## The Solution: Two-Phase Restructure

### Phase 1: Simplify "My Knowledge" into a Source-Centric Hub

**Consolidate 6 tabs down to 3:**

| Current Tab | What Happens |
|---|---|
| Sources | PROMOTED to the hero of the page -- renamed "My Sources" |
| Documents | MERGED into Sources (uploaded docs become sources automatically) |
| Captures | KEPT as a lightweight inbox -- but visually subordinated |
| Goals and KPIs | MOVED into a collapsible "Profile" section at the top |
| Working Style | MOVED into the same "Profile" section |
| My Context Items | REMOVED from this page (these already live in Playbooks) |

**New "My Knowledge" layout:**

```text
+----------------------------------------------------------+
| My Knowledge                                              |
|                                                           |
| [Profile card - collapsed by default]                     |
|   Goals & KPIs | Working Style preferences                |
|                                                           |
| [Captures Inbox badge: 3 drafts]  (small strip, not tab) |
|                                                           |
| === My Sources ===  (hero section, always visible)        |
| +------------------+  +------------------+                |
| | Sales Process    |  | Onboarding Guide |                |
| | v3 - 12 items    |  | v1 - 0 items     |                |
| | Domains: Sales,  |  | [Extract now]    |                |
| |   Pricing        |  |                  |                |
| | [Edit] [Lineage] |  | [Edit]           |                |
| +------------------+  +------------------+                |
+----------------------------------------------------------+
```

Each source card shows:
- How many context items were extracted from it
- Which domains/bundles those items landed in
- A "View Lineage" action to see the full tree

### Phase 2: Add Source Lineage to Both Sides

**On each Source card** (in My Knowledge):
- "Lineage" button opens a panel showing all context items extracted from this source, grouped by the bundle/domain they belong to
- When you edit the source content, a banner shows: "3 playbook items were extracted from this source -- changes here may warrant re-extraction"

**On each Bundle card** (in Playbooks):
- A small "Source" indicator showing which Knowledge Source(s) fed into this bundle
- Clicking it navigates to My Knowledge with that source open in the editor

This creates the bidirectional link:
```text
My Knowledge (Source editor)  <-->  Playbooks (Bundle cards)
         source_knowledge_id column (already exists!)
```

### Phase 3: Feedback Strip on Source Editor

When viewing a source in the editor, show a collapsible "Execution Signals" strip at the bottom:
- Drift clusters from playbooks that were extracted from this source
- "Last executed: 2 days ago by 3 operators"
- This closes the loop: source thinking is informed by what actually happened in execution

## Technical Details

### Changes to `src/pages/MyKnowledge.tsx`
- Remove the 6-tab structure
- Replace with: collapsible Profile section (goals + preferences) at top, captures inbox as a compact strip, and Sources as the main content area
- Sources component gets enhanced with lineage data

### Changes to `src/components/knowledge/KnowledgeSources.tsx`
- Add lineage query: fetch `context_items` where `source_knowledge_id = source.id`, joined with `bundles` to show domain/bundle placement
- Add "Lineage" panel view alongside the editor
- Add "Execution Signals" collapsible strip (initially with placeholder data from the existing drift mock)

### Changes to `src/components/context/BundleFirstView.tsx`
- On each bundle card header, show a small "Source" badge if any of its items have a `source_knowledge_id`
- Badge links back to `/my-knowledge` with a query param to auto-open that source

### Changes to `src/pages/ContextManagement.tsx`
- Pass source metadata through to BundleFirstView
- Fetch distinct `source_knowledge_id` values per bundle

### No database changes needed
- The `source_knowledge_id` column on `context_items` already exists
- The `knowledge_sources` and `knowledge_source_versions` tables already exist
- All data relationships are already in place -- we just need to surface them in the UI

