

# Domains Tab -- EOS-Inspired Domain Navigation

## Overview
Add a new "Domains" tab to the Playbooks page that presents business domains as visual cards (based on the Traction/EOS framework). Clicking a domain card drills into the existing BundleFirstView, filtered to show only bundles belonging to that domain. Users can also add custom domains beyond the EOS defaults.

## User Experience

### New "Domains" tab (default landing)
- A tab bar at the top of the Playbooks page: **Domains** | **All Playbooks** (the current BundleFirstView)
- The Domains tab shows a responsive card grid (2-3 columns)
- Each card displays:
  - Domain name and icon (e.g. "Sales & Marketing" with a TrendingUp icon)
  - Bundle count badge ("3 bundles")
  - Item count ("12 items")
  - A brief description
  - Color accent per domain
- An "Org-Wide" card always appears first for items/bundles tagged "GLOBAL" or "general"
- A "+ Add Domain" card at the end for creating custom domains

### Drill-down behavior
- Clicking a domain card switches to the BundleFirstView with that domain pre-filtered
- A breadcrumb or back button appears: "Domains > Sales & Marketing"
- The domain filter in BundleFirstView is pre-set to the clicked domain's tag

### Default EOS Domains (seeded)
These are stored in a new `domains` table and seeded on first load:
1. **Sales & Marketing** -- tag: "sales", icon: TrendingUp
2. **Operations** -- tag: "operations", icon: Settings
3. **Finance** -- tag: "finance", icon: DollarSign
4. **People (HR)** -- tag: "hr", icon: Users
5. **Product & Engineering** -- tag: "engineering", icon: Code
6. **Customer Success** -- tag: "cs", icon: HeartHandshake
7. **Legal & Compliance** -- tag: "compliance", icon: Shield
8. **Strategy** -- tag: "strategy", icon: Target

### Custom domains
- Users can create additional domains via the "+ Add Domain" card
- Simple dialog: name, description, tag, icon choice (from a preset list)
- Users can edit or delete custom domains (EOS defaults can be hidden but not deleted)

## Technical Plan

### 1. Database: New `domains` table

```text
domains
  id           uuid PK default gen_random_uuid()
  owner_id     uuid NOT NULL (references auth.users)
  title        text NOT NULL
  description  text
  tag          text NOT NULL (the domain_scope value that links to items)
  icon         text (lucide icon name)
  color        text (tailwind color key like "blue", "amber")
  is_default   boolean default false (true for EOS seeds)
  sort_order   integer default 0
  created_at   timestamptz default now()
  updated_at   timestamptz default now()
```

- RLS: Users can CRUD their own domains
- A database function `seed_default_domains(user_id)` inserts the 8 EOS defaults when a user has zero domains

### 2. Files to create

**`src/components/context/DomainsView.tsx`** (new)
- Fetches domains from the `domains` table
- On first load, if no domains exist, calls an RPC to seed defaults
- Renders a card grid
- Each card shows bundle/item counts (computed from existing data by matching `domain_scope` tags)
- Handles create/edit/delete domain dialogs
- Emits `onSelectDomain(tag)` when a card is clicked

### 3. Files to modify

**`src/pages/ContextManagement.tsx`**
- Add a tab state: "domains" (default) vs "playbooks" (current BundleFirstView)
- When in "domains" tab, render DomainsView
- When a domain is clicked, switch to "playbooks" tab with domainFilter pre-set
- Add breadcrumb navigation for drill-down
- Pass selected domain context to BundleFirstView

**`src/components/context/BundleFirstView.tsx`**
- Accept an optional `initialDomainFilter` prop
- When set, pre-populate the domain filter and show a back/breadcrumb button
- Minor: expose a callback for "back to domains"

**`src/data/mockContextItems.ts`**
- No changes needed (domain_tags already exist on MockBundle)

### 4. Domain-to-bundle mapping
Bundles already derive their `domain_tags` from the `domain_scope` field of their child items. The DomainsView will count bundles per domain by matching `bundle.domain_tags.includes(domain.tag)`. No schema changes needed for the mapping -- the existing `domain_scope` JSONB on `context_items` is the link.

### 5. Migration SQL
- CREATE TABLE `domains` with RLS policies
- CREATE FUNCTION `seed_default_domains(p_user_id uuid)` that inserts 8 EOS rows if none exist for that user

## What Stays the Same
- The entire BundleFirstView and its playbook hierarchy
- The bundle/item data model
- All extraction, import, deploy flows
- The domain_scope field on context_items (used as the linking mechanism)

