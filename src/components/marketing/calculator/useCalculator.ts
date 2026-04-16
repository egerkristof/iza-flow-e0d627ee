import { useMemo } from "react";
import { DEPARTMENTS } from "./departments";
import type { DepartmentEntry, DepartmentResult, CalculatorResult } from "./types";

const RECOVERY_RATE = 0.65;

export function useCalculator(
  entries: DepartmentEntry[],
  hourlyCost: number,
  multiMode: boolean,
): CalculatorResult {
  return useMemo(() => {
    const deptCount = multiMode ? entries.length : 1;

    const departments: DepartmentResult[] = entries.map((entry) => {
      const dept = DEPARTMENTS.find((d) => d.value === entry.department)!;
      const p = dept.taxProfile;

      const reworkAnnual = entry.teamSize * dept.hours * hourlyCost * 52;
      const duplication = reworkAnnual * p.duplication;
      const inconsistency = reworkAnnual * p.inconsistency;
      const attrition =
        entry.teamSize * p.turnover * (dept.hours * hourlyCost * p.attritionWeeks);
      const onboarding =
        entry.teamSize * p.turnover * (dept.hours * hourlyCost * p.onboardingWeeks);

      // Cross-org taxes scale with number of departments
      const handoff = reworkAnnual * p.handoffFriction * (multiMode ? deptCount - 1 : 3);
      const shadowGovernance =
        (multiMode ? deptCount - 1 : 3) * p.shadowGovernanceHours * hourlyCost * 52;

      const subtotal =
        reworkAnnual + duplication + inconsistency + attrition + onboarding + handoff + shadowGovernance;

      return {
        id: entry.id,
        label: dept.label,
        reworkAnnual,
        duplication,
        inconsistency,
        attrition,
        onboarding,
        handoff,
        shadowGovernance,
        subtotal,
      };
    });

    const sum = (fn: (d: DepartmentResult) => number) =>
      departments.reduce((acc, d) => acc + fn(d), 0);

    const totalGap = sum((d) => d.subtotal);

    return {
      departments,
      totalRework: sum((d) => d.reworkAnnual),
      totalDuplication: sum((d) => d.duplication),
      totalInconsistency: sum((d) => d.inconsistency),
      totalAttrition: sum((d) => d.attrition),
      totalOnboarding: sum((d) => d.onboarding),
      totalHandoff: sum((d) => d.handoff),
      totalShadowGovernance: sum((d) => d.shadowGovernance),
      totalGap,
      recoverable: totalGap * RECOVERY_RATE,
    };
  }, [entries, hourlyCost, multiMode]);
}
