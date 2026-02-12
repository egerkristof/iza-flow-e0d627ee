Here is the comprehensive breakdown formatted for JIRA creation. I have structured this into **4 Core Epics**, each containing specific User Stories, the targeted UI location (where it sits in the current screenshots), and the technical UX changes required.

---

### **EPIC 1: The Frontline Execution Launchpad**

**Target Persona:** Frontline Worker ("The Operator") **Objective:** Transform the empty Workbook Chat into an intent-driven "Cockpit" that minimizes blank-page anxiety and enforcing AACE "Intent-First Locking."

#### **Story 1.1: The "Action Grid" Dashboard (Entry State)**

- **Location:** Replaces the empty "Chat" tab view inside a Workbook (Screenshot 2).
- **User Story:** As a Frontline Worker, I want to see a grid of "Quick Actions" when I open a workbook instead of an empty chat history, so that I can immediately trigger the correct organizational process without needing to prompt-engineer.
- **UI/UX Changes:**
  - **Hide:** Empty state chat history.
  - **New Component:** A 2x3 or 3x3 Grid of Cards.
  - **Card Data:** Derived from `PLAYBOOK` items assigned to this Workbook's Bundle.
    - Icon + Title (e.g., "Draft Proposal") + Subtitle (e.g., "MEDIC Method").
  - **New Component:** "Active Missions" List below grid showing recent task threads with status.

#### **Story 1.2: Protocol Locking & Guided Interface**

- **Location:** The "Chat" Input Area and Header (Screenshot 2).
- **User Story:** As an Operator, when I click an Action Card, I want the interface to "Lock" into that specific task, filtering out irrelevant tools and changing the chat input prompt, so I know exactly what step I am on.
- **UI/UX Changes:**
  - **State Change:** Clicking a Card triggers AACE `locked_playbook_id`.
  - **Visual Feedback:** Application background applies a subtle tint (Focus Mode).
  - **New Component:** Sticky "Protocol Banner" below the main header. Text: _"🔒 Active Protocol: \[Playbook Name\] | Step \[X\] of \[Y\]"_.
  - **Input Field:** Placeholder changes from _"Write a message..."_ to _"Enter \[Input Requirement from Step X\]..."_

#### **Story 1.3: Context Rail & "Project Memory"**

- **Location:** Right Sidebar (Currently "Tools" tab - Screenshot 2).
- **User Story:** As an Operator, I want to see a "Project Memory" list instead of generic tool settings, so I can verify what documents or knowledge the AI is currently using.
- **UI/UX Changes:**
  - **Refactor:** Rename "Tools" tab to **"Mission Assets"**.
  - **Dynamic List:** Show two sections:
    - _Locked Assets:_ Read-only `KNOWLEDGE` items injected by the current Playbook.
    - _Local Memory:_ Files/Findings pinned specifically to this session.
  - **Action Change:** Change "Disconnect" button to **"Unpin"** (Remove from session only).

#### **Story 1.4: Hide Administrative Noise**

- **Location:** Top Tab Bar (Screenshot 2: "Chat", "Triage", "Context").
- **User Story:** As a Frontline Worker, I want the "Triage" and "Context" tabs to be hidden or minimized, so I am not distracted by administrative tasks I don't perform.
- **UI/UX Changes:**
  - **Permission Check:** If user role != Expert/Admin:
    - **Remove:** "Triage" Tab.
    - **Remove:** "Context" Tab.
  - **Replacement:** Add a small "Sparkle/Brain" icon in the status bar that pulses when AACE auto-extracts a finding (Passive feedback only).

---

### **EPIC 2: Universal Research Lens & Context Promotion**

**Target Persona:** All Roles (Behavior changes by role) **Objective:** Enable ad-hoc knowledge retrieval and specific assignment of that knowledge to the graph.

#### **Story 2.1: The Global Research "Slide-Over"**

- **Location:** Global Top Navigation Bar (Right side, near profile - Screenshot 1/2).
- **User Story:** As any User, I want a persistent "Research Lens" icon available on every screen that opens a side panel, so I can find facts without leaving my current task.
- **UI/UX Changes:**
  - **New Icon:** "Telescope" or "Lens" in the global header.
  - **Component:** Slide-over panel (Overlaying the right side).
  - **Input:** "Research Query" search bar + Scope Toggles (Internal / External / Both).
  - **Output:** Card-based results list (Source Title, Snippet, Relevance Score).

#### **Story 2.2: Role-Based Pinning Logic**

- **Location:** Inside the Result Cards in the Research Panel.
- **User Story:** As a user, I want to "Pin" a search result to the appropriate place based on my role, so I don't accidentally pollute the global knowledge graph.
- **UI/UX Changes:**
  - **Action Button:** "Pin Result" (Dynamic Logic).
  - **Logic (Frontline):** Click -&gt; Adds item to current **Workbook Context** (`assignment_scope: WORKBOOK`). Visual feedback: "Saved to Project Memory."
  - **Logic (Expert):** Click -&gt; Opens dropdown: "Add to Global Bundle?" or "Add to Active Playbook?".

---

### **EPIC 3: The Expert Process Studio (Definition Layer)**

**Target Persona:** T-Shaped Expert ("The Architect") **Objective:** Replace the high-friction Triage/Bundle screens with a "Process Studio" focused on ingestion and lifecycle.

#### **Story 3.1: The "Knowledge Loom" (Smart Ingestion)**

- **Location:** Replaces the "Context" tab list view or "Context Management" page (Screenshots 3, 5).
- **User Story:** As an Expert, I want to drag-and-drop a folder of documents and have Liza suggest the structure, so I can populate the knowledge graph without manually creating item-by-item.
- **UI/UX Changes:**
  - **New Component:** "Drop Zone" at the top of the Context Management screen.
  - **Interaction:** On drop -&gt; Modal opens "Import Wizard."
  - **Wizard:** Displays parsed `PLAYBOOK` and `DIRECTIVE` candidates.
  - **Action:** "Approve & Bundle" button.

#### **Story 3.2: Aggregated Drift Inbox**

- **Location:** Replaces the "Finding Triage" screen (Screenshot 3).
- **User Story:** As an Expert, I want to see aggregated "Process Friction" alerts (clustered findings) instead of raw text logs, so I can identify patterns rather than typos.
- **UI/UX Changes:**
  - **Refactor List:** Group similar findings into single cards (e.g., "5 deviations in 'Pricing Step' detected").
  - **Detail View:** Clicking the card expands to show the specific chat excerpts where the drift occurred.
  - **Action Buttons:** "Ignore Cluster" OR "Promote Update to Playbook."

#### **Story 3.3: Capability Modules & Scope Radial**

- **Location:** Global "Context Management" (Screenshot 5).
- **User Story:** As an Expert, I want to manage "Capability Bundles" with a visual scope dial, so I clearly understand who will be affected by my changes.
- **UI/UX Changes:**
  - **Visual Refactor:** Turn list rows into large "Module Cards" (e.g., "Sales Hub").
  - **New Component:** "Scope Radial" (Visual dial on the card).
    - Stops: **Draft** (Gray) -&gt; **Team** (Green) -&gt; **Domain** (Blue) -&gt; **Org** (Gold).
  - **Versioning UI:** Explicit "vX.X" badge. Clicking it allows "Fork" or "Update."

#### **Story 3.4: "Garbage Collection" Dashboard**

- **Location:** Top of "Context Management" (Screenshot 5).
- **User Story:** As an Expert, I want to see a health score and a list of "Stale" items, so I can prune the knowledge graph of outdated information.
- **UI/UX Changes:**
  - **New Widget:** "Knowledge Health" (Gauge Chart).
  - **List:** "Candidates for Archive" (Items with `last_used > 6 months` or passed `expiry_date`).
  - **Action:** Bulk Select -&gt; "Archive."

---

### **EPIC 4: Strategic Oversight (The Manager's View)**

**Target Persona:** M-Shaped Leader ("The Manager") **Objective:** Visualize work in progress and outcome alignment.

#### **Story 4.1: Outcome-Based Kanban Board**

- **Location:** "Workbooks" Landing Page (Screenshot 1).
- **User Story:** As a Manager, I want to see workbooks grouped by their Strategic Outcome (Kanban) rather than a flat list, so I can see what is "In Progress" vs "Stuck."
- **UI/UX Changes:**
  - **View Toggle:** Switch between "Grid" (Old) and "Board" (New).
  - **Board Columns:** Dynamic based on generic stages or custom tags (e.g., "Strategy," "Execution," "Review").
  - **Card Enrichment:** Add "Status Dot" (Green/Red) based on AACE drift detection score.

#### **Story 4.2: Task Lineage "Peek"**

- **Location:** Hover/Click on a Workbook Card in the List (Screenshot 1).
- **User Story:** As a Manager, I want to "Peek" into a workbook's latest activity/lineage without opening the full chat, so I can quick-check progress.
- **UI/UX Changes:**
  - **Interaction:** "Info/Eye" icon on the card.
  - **New Modal:** "Workbook Snapshot."
    - Shows: "Active Protocol," "Last 3 Tasks," "Drift Score."
  - **Visual Lineage:** Simple arrow diagram: _Source Decision -&gt; Active Agent Step -&gt; Current Blocker._
