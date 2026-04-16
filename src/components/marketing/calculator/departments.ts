import type { DepartmentConfig } from "./types";

// Department-specific tax profiles — tailored multipliers based on
// structural characteristics of each function.
export const DEPARTMENTS: DepartmentConfig[] = [
  {
    value: "engineering",
    label: "Engineering / IT / Data",
    hours: 5.0,
    taxProfile: {
      duplication: 0.30,        // High: siloed problem-solving, parallel experiments
      inconsistency: 0.15,      // Moderate: code review catches some
      turnover: 0.18,           // Higher turnover in tech
      attritionWeeks: 10,       // Complex toolchains to reconstruct
      onboardingWeeks: 8,       // Steep ramp
      handoffFriction: 0.22,    // High: eng→product, eng→QA, eng→ops
      shadowGovernanceHours: 2, // Lower: eng tends to self-govern
    },
  },
  {
    value: "finance",
    label: "Finance & Accounting",
    hours: 4.6,
    taxProfile: {
      duplication: 0.15,        // Low: structured processes
      inconsistency: 0.30,      // High: numbers must reconcile exactly
      turnover: 0.12,           // Lower turnover
      attritionWeeks: 6,
      onboardingWeeks: 6,
      handoffFriction: 0.15,    // Moderate: clear interfaces
      shadowGovernanceHours: 4, // High: audit trails, compliance reviews
    },
  },
  {
    value: "bizdev",
    label: "Business Development",
    hours: 3.9,
    taxProfile: {
      duplication: 0.20,
      inconsistency: 0.25,      // Different reps, different pitches
      turnover: 0.20,           // High turnover in BD
      attritionWeeks: 6,
      onboardingWeeks: 5,
      handoffFriction: 0.25,    // High: BD→sales→delivery gap
      shadowGovernanceHours: 2,
    },
  },
  {
    value: "operations",
    label: "Operations & Supply Chain",
    hours: 3.9,
    taxProfile: {
      duplication: 0.25,
      inconsistency: 0.20,
      turnover: 0.15,
      attritionWeeks: 8,
      onboardingWeeks: 6,
      handoffFriction: 0.20,    // Ops touches everything
      shadowGovernanceHours: 3,
    },
  },
  {
    value: "hr",
    label: "Human Resources",
    hours: 3.8,
    taxProfile: {
      duplication: 0.20,
      inconsistency: 0.20,
      turnover: 0.13,
      attritionWeeks: 5,
      onboardingWeeks: 8,       // HR IS the onboarding function — ironic cost
      handoffFriction: 0.15,
      shadowGovernanceHours: 3, // Policy consistency across org
    },
  },
  {
    value: "product",
    label: "Product Development",
    hours: 3.8,
    taxProfile: {
      duplication: 0.25,        // PMs reinvent frameworks
      inconsistency: 0.22,      // Specs diverge across squads
      turnover: 0.16,
      attritionWeeks: 8,
      onboardingWeeks: 7,
      handoffFriction: 0.25,    // Product→eng, product→design, product→sales
      shadowGovernanceHours: 2,
    },
  },
  {
    value: "legal",
    label: "Legal",
    hours: 3.6,
    taxProfile: {
      duplication: 0.10,        // Low: specialized, small teams
      inconsistency: 0.30,      // High: compliance interpretations must align
      turnover: 0.10,
      attritionWeeks: 10,       // Deep domain expertise to replace
      onboardingWeeks: 8,
      handoffFriction: 0.12,    // Legal output is consumed, rarely handed off
      shadowGovernanceHours: 5, // Highest: every team builds own legal review
    },
  },
  {
    value: "marketing",
    label: "Marketing",
    hours: 3.3,
    taxProfile: {
      duplication: 0.30,        // High: content creation overlap
      inconsistency: 0.25,      // Brand voice drift across channels
      turnover: 0.18,
      attritionWeeks: 5,
      onboardingWeeks: 5,
      handoffFriction: 0.20,    // Marketing→sales, marketing→product
      shadowGovernanceHours: 2,
    },
  },
  {
    value: "sales",
    label: "Sales & Support",
    hours: 3.0,
    taxProfile: {
      duplication: 0.15,        // Lower: individual quota-driven
      inconsistency: 0.30,      // High: different reps promise different things
      turnover: 0.22,           // Highest turnover
      attritionWeeks: 4,        // Faster to replace
      onboardingWeeks: 6,
      handoffFriction: 0.28,    // Highest: sales→delivery is the #1 friction
      shadowGovernanceHours: 2,
    },
  },
  {
    value: "pm",
    label: "Project Management",
    hours: 2.8,
    taxProfile: {
      duplication: 0.20,
      inconsistency: 0.20,
      turnover: 0.14,
      attritionWeeks: 5,
      onboardingWeeks: 5,
      handoffFriction: 0.22,    // PM coordinates across teams
      shadowGovernanceHours: 3,
    },
  },
];
