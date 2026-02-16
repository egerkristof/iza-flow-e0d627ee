

# Playbook-Centric UI Refactor (Bundles View Focus)

## Overview
The current default view is the **BundleFirstView** ("simplified" / "Bundles" mode) -- not the Classic view. This plan focuses entirely on refactoring that view. The key insight: playbooks already have their own child items (procedures as "Steps", directives as "Gates & Context", plus any other owned items). The refactor reframes bundles as "Domains" and makes playbooks the visual hero, while preserving the existing hierarchy.

## What Changes for the User

### Navigation
- Sidebar: "Context" (Library icon) becomes **"Playbooks"** (Target icon)
- Route stays `/context` (no URL breakage)

### Page Header (`ContextManagement.tsx`)
- Title: `"Context"` becomes **"Playbooks"**
- Stats: `"X items - Y bundles"` becomes `"X items - Y domains"`
- Taxonomy button, TaxonomyOnboarding, and TaxonomyHelpButton move behind a **"Power Tools"** toggle (small wrench/settings icon)
- The Bundles/Classic view toggle becomes a **"Power Tools"** toggle instead. When off (default): only BundleFirstView is shown. When on: reveals Classic tabs (Items & Bundles, Mandates, Drift, Garbage Collection), Context Stack, Impact Sim, and Taxonomy buttons
- Subtitle text: `"Organize and deploy your knowledge bundles..."` becomes `"Your playbooks organized by domain. Expand to see steps, gates, and shared knowledge."`

### BundleFirstView Toolbar (`BundleFirstView.tsx`)
- Search placeholder: `"Search bundles & items..."` becomes `"Search playbooks & domains..."`
- `"+ Bundle"` button becomes `"+ Domain"` (Package icon stays)
- `"+ Item"` button stays (useful for adding knowledge/principles directly)
- `"Clear All"` stays (useful during setup, already behind confirmation dialog)
- Summary line: `"X bundles - Y unbundled items"` becomes `"X domains - Y unassigned items"`
- Filter label "Domains" stays as-is (already correct)

### BundleExpandable Cards (the main content cards)
- The card header currently shows Package icon + bundle title. This stays structurally the same but the icon could shift to a folder/domain icon
- **No structural changes needed** -- the card already renders:
  - Playbook items with target emoji, "Protocol Driver" badge, step/gate counts
  - Procedures nested under "Steps" sub-header with numbered indices
  - Other owned items (directives, knowledge) under "Gates & Context" sub-header
  - Shared context items at the bottom with "(shared)" label
  - Add buttons for "+ Playbook", "+ Knowledge", "+ Principle"
- Labels stay since they already use correct playbook-centric vocabulary
- The Deploy button stays prominent (already exists and is always visible)

### Empty States
- No bundles empty state: `"No bundles yet"` becomes `"No domains yet"`, description becomes `"Create a domain to organize your playbooks, or import a document to auto-generate them."`
- `"Create Bundle"` button becomes `"Create Domain"`

### Unbundled/Loose Items Section
- `"Unbundled Items"` becomes `"Unassigned Items"`
- `"AI can group these into bundles"` becomes `"AI can organize these into domains"`

### Bundle CRUD Dialog (`ContextManagement.tsx`)
- Dialog title: `"Create Bundle"` / `"Edit Bundle"` becomes `"Create Domain"` / `"Edit Domain"`
- Input placeholder: `"Bundle title"` becomes `"Domain name"`
- Description placeholder updated accordingly

### Other Dialogs
- `DeployToWorkbookDialog.tsx`: Update any "bundle" references in user-facing text to "domain"
- `ImportCopilotDialog.tsx`: Update "bundle" references to "domain" in UI labels

## What Stays the Same
- The entire data model (bundles table, context_items table, context_item_bundles junction table)
- The playbook hierarchy inside each domain card (already correct: playbook header with Protocol Driver badge, nested Steps with drag-and-drop, Gates & Context section, shared items)
- The Copilot at bundle/playbook/step levels (already works correctly)
- All extraction, import, and deploy flows
- The internal code variable names (bundles, bundleId, etc.) -- only user-facing strings change
- Filter mechanics (domain tags and category filters)

## Technical Changes (6 files)

### 1. `src/components/AppSidebar.tsx`
- Change nav item label: `"Context"` to `"Playbooks"`
- Change icon: `Library` to `Target` (from lucide-react)

### 2. `src/pages/ContextManagement.tsx`
- Header title: `"Context"` to `"Playbooks"`
- Stats text: `"bundles"` to `"domains"`
- Replace Bundles/Classic toggle with a Power Tools toggle
- When Power Tools is OFF: show only BundleFirstView (the default experience)
- When Power Tools is ON: reveal the Classic tab bar, Context Stack button, Impact Sim button, Taxonomy buttons
- Move TaxonomyOnboarding and TaxonomyHelpButton behind Power Tools
- Bundle CRUD dialog labels: `"Bundle"` to `"Domain"` in title, placeholder, description

### 3. `src/components/context/BundleFirstView.tsx`
- Search placeholder: `"Search bundles & items..."` to `"Search playbooks & domains..."`
- Summary: `"bundles"` to `"domains"`, `"unbundled"` to `"unassigned"`
- `"+ Bundle"` button label to `"+ Domain"`
- Empty state: `"No bundles yet"` to `"No domains yet"`, `"Create Bundle"` to `"Create Domain"`, description text updated
- Loose items header: `"Unbundled Items"` to `"Unassigned Items"`, AI suggestion text updated
- Filter summary text: `"bundles"` to `"domains"`, `"loose items"` to `"unassigned items"`

### 4. `src/components/context/DeployToWorkbookDialog.tsx`
- Any user-facing `"bundle"` text to `"domain"`

### 5. `src/components/knowledge/ImportCopilotDialog.tsx`
- Any user-facing `"bundle"` text to `"domain"` in labels and descriptions

### 6. `src/lib/knowledge-schema.ts`
- No changes (internal data model stays as-is)

## No Database Changes
Purely a UI vocabulary and layout refactor. The `bundles` table name and all relationships remain unchanged.

