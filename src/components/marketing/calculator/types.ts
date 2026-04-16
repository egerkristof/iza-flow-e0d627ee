export interface DepartmentConfig {
  value: string;
  label: string;
  hours: number;
  taxProfile: TaxProfile;
}

export interface TaxProfile {
  duplication: number;
  inconsistency: number;
  turnover: number;
  attritionWeeks: number;
  onboardingWeeks: number;
  handoffFriction: number;
  shadowGovernanceHours: number;
}

export interface DepartmentEntry {
  id: string;
  department: string;
  teamSize: number;
}

export interface DepartmentResult {
  id: string;
  label: string;
  reworkAnnual: number;
  duplication: number;
  inconsistency: number;
  attrition: number;
  onboarding: number;
  handoff: number;
  shadowGovernance: number;
  subtotal: number;
}

export interface CalculatorResult {
  departments: DepartmentResult[];
  totalRework: number;
  totalDuplication: number;
  totalInconsistency: number;
  totalAttrition: number;
  totalOnboarding: number;
  totalHandoff: number;
  totalShadowGovernance: number;
  totalGap: number;
  recoverable: number;
}
