---
name: AACE Engine Definition
description: AACE = Adaptive Agentic Context Engine. Five Context Categories, Operation Modes, Action Logic; the runtime that compiles labeled context into the LLM system prompt.
type: feature
---

**AACE** = **Adaptive Agentic Context Engine** (current spec: v3.1, "State-Locked & Full-Context"). LIZA's runtime that compiles labeled context items into a hierarchical XML system prompt injected just-in-time before the LLM sees the user message.

NEVER use AACE as an acronym for anything else. (Assumption/Action/Constraint/Evidence is wrong and was previously mis-shipped.)

## The 5 Context Categories
1. **DIRECTIVE** — non-negotiable rule (safety, security, tone).
2. **KNOWLEDGE** — static authoritative facts, data, reference lists.
3. **PROCEDURE** — logic flow / behavior patch / single-step tool instruction.
4. **PLAYBOOK** — multi-step end-to-end specialized protocol with a trigger; locks the agent into the process until STOP/RESET.
5. **PREFERENCE** — soft constraint: format, voice, style.

## Operation Modes (risk/scope)
CREATION_TEXT (low), CREATION_CODE (high), ANALYSIS (medium), TRANSACTION (high, preview-gated), ROUTING (low).

## Action Logic
APPEND (default add), OVERRIDE (replace default with target ref ID), BLOCK (forbid; safety guard).

## Core mechanics
- **Intent-First Locking:** classifier detects intent → if a Playbook Registry trigger fires, system enters Locked State (`locked_playbook_id`) and follows the Playbook strictly until STOP/RESET.
- **Full Content Fidelity:** entire textual content preserved in compiled XML; summarization/truncation forbidden.
- **Just-in-Time Injection:** backend filters context items by Locked State and compiles to an XML system prompt acting as a Runtime Patch.

## External framing (decks, video, marketing)
A Playbook is composed of Directives, Knowledge, Procedures, and Preferences, and is invoked by an Intent trigger. Use the real category names verbatim. Source of truth: `docs/AACE v3.1 Master Specification.md`.

## Playbook = the atom (canonical, June 2026)

On marketing surfaces, **the Playbook is the smallest atom of an AI-native organization**. It is a captured micro-moment of how a piece of work is done, authored once, versioned, owner-signed, compiled just-in-time into the LLM, audited on the way out.

- The other four AACE categories (Directive, Knowledge, Procedure, Preference) are **components of a Playbook**, not peers in marketing copy. Externally: "A Playbook bundles the rules (Directives), facts (Knowledge), steps (Procedures) and voice (Preferences) for one micro-moment of work."
- "Standard" is **a property carried by a Playbook** (the quality bar / rule the work must obey), not a separate atom. Do not use "Standard" as a noun for the atom in new copy. Legacy slides that say "Standard" are being migrated to "Playbook."
- Org-as-Code = a corpus of Playbooks. The Governance Loop = the runtime that compiles them. Humans in Charge author and approve them.
