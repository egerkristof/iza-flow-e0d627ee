import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

// Department-specific narrative — why their profile produces this pattern
const DEPT_NARRATIVE: Record<string, { headline: string; why: string; firstFix: string }> = {
  engineering: {
    headline: "Siloed problem-solving and complex toolchains drive the bulk of your gap.",
    why: "Engineering teams burn the highest duplication tax (~30%) because parallel experiments and isolated debugging rarely propagate. Combined with steep onboarding (8 weeks) and high handoff friction to product/QA, every unmanaged AI workflow compounds across the SDLC.",
    firstFix: "Codify the top 3 'how we solve X' patterns as governed playbooks. This alone typically recovers 40% of duplication tax in the first quarter.",
  },
  finance: {
    headline: "Reconciliation precision and shadow audit trails dominate your exposure.",
    why: "Finance carries the highest inconsistency tax (~30%) because numbers must reconcile exactly. Add the highest shadow-governance load (every team independently builds compliance review), and the org-level ripple grows faster than headcount.",
    firstFix: "Standardize the 5 most-rerun calculation and reconciliation patterns. Locks consistency at the source instead of catching drift downstream.",
  },
  bizdev: {
    headline: "BD-to-delivery handoffs are leaking quietly across every account.",
    why: "Business Development scores high on handoff friction (25%) and turnover-driven knowledge loss. Different reps pitch different things, then delivery teams spend hours reconstructing context the BD already had.",
    firstFix: "Capture the 'discovery → handoff' protocol as one governed flow. Removes the most expensive context-rebuilding work in the funnel.",
  },
  operations: {
    headline: "Ops touches every team — and every team's drift becomes your overhead.",
    why: "Operations sits between functions, so handoff friction (20%) and shadow governance (3 hrs/week per adjacent team) compound rapidly. Duplication is moderate-high (25%) because ad-hoc fixes never become reusable workflows.",
    firstFix: "Pick one cross-functional process (e.g. vendor onboarding, change requests). Convert to a governed workflow. Recovery propagates across all 3 adjacent teams.",
  },
  hr: {
    headline: "You own onboarding for the whole company — yet pay the highest onboarding tax yourself.",
    why: "HR's onboarding tax is the highest in the dataset (8 weeks per replacement) because the function that codifies others rarely codifies its own AI workflows. Policy consistency adds 3 hrs/week of shadow governance across departments.",
    firstFix: "Codify your own AI-driven HR workflows first (screening, comp benchmarking, policy drafting). The example sets the standard for the rest of the org.",
  },
  product: {
    headline: "Specs diverge across squads and the cost is invisible until release.",
    why: "Product carries 25% duplication (PMs reinventing frameworks) and 25% handoff friction across product/eng/design/sales. Drift accumulates quietly during the cycle and surfaces as rework only at integration time.",
    firstFix: "Govern the top 3 spec patterns (PRD, technical brief, GTM brief). Single source of truth removes the most expensive integration-time discovery work.",
  },
  legal: {
    headline: "Shadow legal review across the org dwarfs your in-house cost.",
    why: "Legal teams are small but every other team builds its own informal legal review (the highest shadow-governance load: 5 hrs/week per adjacent team). Inconsistency tax is also at the ceiling (30%) — interpretations must align across contracts and policies.",
    firstFix: "Codify the 5 most-asked legal patterns as self-serve governed responses. Removes 60-70% of shadow review hours across the company.",
  },
  marketing: {
    headline: "Brand voice drift and content duplication are the silent line items.",
    why: "Marketing has the highest duplication tax (~30%) because content creation overlaps across channels, and 25% inconsistency from voice drift. Combined with handoff friction to sales and product, every untemplated asset compounds.",
    firstFix: "Govern the top 5 content patterns (positioning brief, launch comms, sales enablement). Removes the most-repeated rewrites and locks brand consistency.",
  },
  sales: {
    headline: "Sales-to-delivery is the #1 friction point in the org — and you're sitting on it.",
    why: "Sales has the highest handoff friction in the dataset (28%), highest turnover (22%), and 30% inconsistency tax. Every rep promises slightly different things, and delivery teams pay for the reconciliation in rework hours.",
    firstFix: "Govern the 'closed-won → kickoff' handoff as one structured protocol. Single biggest unlock for both sales velocity and delivery margin.",
  },
  pm: {
    headline: "You coordinate across teams — and pay the coordination tax six different ways.",
    why: "Project Management lives at the boundary, so handoff friction (22%) compounds across every dependency. Shadow governance is high (3 hrs/week) because PMs informally enforce process without it being codified.",
    firstFix: "Pick the most-repeated cross-team workflow you coordinate. Convert to a governed protocol. Removes the friction permanently across all dependencies.",
  },
};

const DEFAULT_NARRATIVE = {
  headline: "Your gap is the cumulative cost of unstructured AI execution across the team.",
  why: "Without a governed context layer, every AI workflow is rebuilt ad-hoc, drifts in quality, and compounds friction at every team boundary.",
  firstFix: "Pick the single most-repeated AI workflow your team runs. Convert it to a governed playbook. Measure the recovery, then scale the pattern.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const {
      email,
      name,
      company,
      department,
      department_label,
      team_size,
      hourly_cost,
      total_gap,
      recoverable,
      rework_annual,
      team_subtotal,
      org_subtotal,
      taxes,
    } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ success: false, error: "email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalGapStr = fmtEUR(Number(total_gap));
    const recoverableStr = fmtEUR(Number(recoverable));
    const reworkStr = fmtEUR(Number(rework_annual));
    const hourlyStr = fmtEUR(Number(hourly_cost));
    const teamSubStr = fmtEUR(Number(team_subtotal || 0));
    const orgSubStr = fmtEUR(Number(org_subtotal || 0));
    const deptKey = String(department || "").toLowerCase();
    const narrative = DEPT_NARRATIVE[deptKey] || DEFAULT_NARRATIVE;
    const deptName = department_label || department || "your team";

    // Per-tax explanations — mirror the on-page card descriptions
    const TAX_DESCRIPTIONS: Record<string, string> = {
      duplication: "Team members independently solving problems a colleague already figured out.",
      inconsistency: "Cross-checking and aligning different AI outputs across the team.",
      attrition: "Rebuilding AI expertise lost when team members leave.",
      onboarding: "New hires building AI workflows from scratch with no codified processes.",
      handoff: "Adjacent teams re-contextualizing AI outputs that cross boundaries without shared standards.",
      shadowGovernance: "Each department independently building its own AI review and QA processes.",
    };

    // Build per-tax rows with description
    const taxRow = (label: string, val: number, kind: "team" | "org", descKey: string) => `
      <tr>
        <td style="padding:14px 16px; border-bottom:1px solid #f0f0f0; vertical-align:top;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:999px; background:${kind === "org" ? "#0a7" : "#3b82f6"};"></span>
            <span style="font-size:14px; font-weight:700; color:#111;">${label}</span>
          </div>
          <p style="margin:0; padding-left:14px; font-size:12px; color:#666; line-height:1.5;">
            ${TAX_DESCRIPTIONS[descKey] || ""}
          </p>
        </td>
        <td style="padding:14px 16px; border-bottom:1px solid #f0f0f0; font-size:15px; color:#111; font-weight:800; text-align:right; white-space:nowrap; vertical-align:top;">
          ${fmtEUR(val)}<span style="font-size:11px; color:#888; font-weight:500;">/yr</span>
        </td>
      </tr>`;

    const breakdownTable = taxes
      ? `
      <table style="width:100%; border-collapse:collapse; border:1px solid #eee; border-radius:12px; overflow:hidden; margin:12px 0 8px;">
        <thead>
          <tr style="background:#fafafa;">
            <td colspan="2" style="padding:12px 16px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#666;">
              Department-level taxes — subtotal ${teamSubStr}/yr
            </td>
          </tr>
        </thead>
        <tbody>
          ${taxRow("Duplication Tax", taxes.duplication, "team", "duplication")}
          ${taxRow("Inconsistency Tax", taxes.inconsistency, "team", "inconsistency")}
          ${taxRow("Attrition Tax", taxes.attrition, "team", "attrition")}
          ${taxRow("Onboarding Tax", taxes.onboarding, "team", "onboarding")}
        </tbody>
      </table>

      <table style="width:100%; border-collapse:collapse; border:1px solid #eee; border-radius:12px; overflow:hidden; margin:8px 0 8px;">
        <thead>
          <tr style="background:#fafafa;">
            <td colspan="2" style="padding:12px 16px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#666;">
              Organizational ripple — subtotal ${orgSubStr}/yr
            </td>
          </tr>
        </thead>
        <tbody>
          ${taxRow("Handoff Friction Tax", taxes.handoff, "org", "handoff")}
          ${taxRow("Shadow Governance Tax", taxes.shadowGovernance, "org", "shadowGovernance")}
        </tbody>
      </table>
      <p style="margin:4px 0 16px; font-size:11px; color:#888; line-height:1.6; font-style:italic;">
        Organizational ripple costs assume ~3 adjacent departments interacting with yours.
      </p>
      `
      : "";

    // 1) Internal notification
    const internalHtml = `
      <h2>New Context Gap Calculator lead 📊</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${name || "—"}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee;" />
      <h3 style="margin:0 0 8px;">Inputs</h3>
      <ul style="list-style:none;padding:0;margin:0 0 16px;">
        <li><strong>Department:</strong> ${deptName}</li>
        <li><strong>Team size:</strong> ${team_size ?? "—"}</li>
        <li><strong>Hourly cost:</strong> ${hourlyStr}</li>
      </ul>
      <h3 style="margin:0 0 8px;">Computed</h3>
      <ul style="list-style:none;padding:0;margin:0 0 16px;">
        <li><strong>Annual rework cost:</strong> ${reworkStr}</li>
        <li><strong>Department subtotal:</strong> ${teamSubStr}</li>
        <li><strong>Organizational subtotal:</strong> ${orgSubStr}</li>
        <li><strong>Total context gap:</strong> ${totalGapStr}</li>
        <li><strong>Recoverable (65%):</strong> ${recoverableStr}</li>
      </ul>
      ${
        taxes
          ? `<h3 style="margin:0 0 8px;">Per-tax breakdown</h3>
             <ul style="list-style:none;padding:0;margin:0;">
               <li>Duplication: ${fmtEUR(taxes.duplication)}</li>
               <li>Inconsistency: ${fmtEUR(taxes.inconsistency)}</li>
               <li>Attrition: ${fmtEUR(taxes.attrition)}</li>
               <li>Onboarding: ${fmtEUR(taxes.onboarding)}</li>
               <li>Handoff Friction: ${fmtEUR(taxes.handoff)}</li>
               <li>Shadow Governance: ${fmtEUR(taxes.shadowGovernance)}</li>
             </ul>`
          : ""
      }
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee;" />
      <p style="color:#888;font-size:13px;">Submitted via the Context Gap Calculator. Follow up within 48h.</p>
    `;

    const internalRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai", "istvan.boscha@aliz.ai"],
        subject: `Calculator lead: ${email} (${totalGapStr}/yr gap)`,
        html: internalHtml,
      }),
    });

    if (!internalRes.ok) {
      const body = await internalRes.text();
      console.error("internal email failed", internalRes.status, body);
    }

    // 2) User snapshot — full mirror of the on-page experience + revealed figures
    const reworkMonthlyStr = fmtEUR(Number(rework_annual) / 12);
    const reworkRecoverableStr = fmtEUR(Number(rework_annual) * 0.65);
    const deptHoursPerWeek = Number(team_size) > 0 && Number(hourly_cost) > 0
      ? Math.round(Number(rework_annual) / 52 / Number(team_size) / Number(hourly_cost))
      : 0;
    const cycleHours = Math.round(deptHoursPerWeek * 1.5);
    const delegationPct = Math.min(25, Math.round(10 + Number(team_size) * 0.15));

    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#111; max-width:640px; margin:0 auto; padding:8px;">
        <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#0a7;">
          Context Gap Tax · Full report
        </p>
        <h2 style="margin:0 0 8px; font-size:24px; letter-spacing:-0.01em;">Your full Context Gap breakdown</h2>
        <p style="color:#555; margin:0 0 24px; font-size:14px; line-height:1.55;">
          Hi ${name || "there"}, here's the complete picture for ${deptName} (${team_size ?? "—"} people) — every line item revealed, with the structural taxes and the metrics most teams never measure.
        </p>

        <div style="border:1px solid #eee; border-radius:14px; padding:20px; margin-bottom:18px; background:#fafafa;">
          <p style="margin:0 0 6px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.12em; font-weight:700;">Direct AI rework cost</p>
          <p style="margin:0 0 4px; font-size:30px; font-weight:800; color:#111; letter-spacing:-0.02em;">${reworkMonthlyStr}<span style="font-size:14px; color:#888; font-weight:500;"> / month</span></p>
          <p style="margin:0 0 12px; font-size:14px; color:#666; font-weight:600;">${reworkStr} / year</p>
          <div style="background:rgba(10,170,119,0.08); border-radius:8px; padding:10px 12px;">
            <p style="margin:0; font-size:13px; font-weight:700; color:#0a7;">↓ Recoverable: ${reworkRecoverableStr}/year</p>
            <p style="margin:4px 0 0; font-size:11px; color:#666; line-height:1.5;">
              Teams with a governed context layer typically reclaim ~65% of rework cost by replacing ad-hoc prompting with reusable patterns.
            </p>
          </div>
          <p style="margin:12px 0 0; font-size:12px; color:#888; font-style:italic;">
            This is only the visible cost. The structural taxes below compound underneath.
          </p>
        </div>

        <h3 style="margin:24px 0 4px; font-size:13px; text-transform:uppercase; letter-spacing:0.12em; color:#555; font-weight:700;">
          Where the cost is leaking
        </h3>
        ${breakdownTable}
        <p style="margin:0 0 18px; font-size:12px; color:#888; line-height:1.6;">
          Direct AI rework is the visible line: <strong style="color:#333;">${reworkStr}/year</strong>.
          The taxes above are the structural costs that compound underneath — most teams never measure them.
        </p>

        <div style="border:1px solid rgba(10,170,119,0.35); background:rgba(10,170,119,0.05); border-radius:14px; padding:20px; margin:20px 0;">
          <p style="margin:0 0 6px; font-size:11px; color:#0a7; text-transform:uppercase; letter-spacing:0.12em; font-weight:700;">Total Context Gap Tax</p>
          <p style="margin:0 0 12px; font-size:30px; font-weight:800; color:#111; letter-spacing:-0.02em;">${totalGapStr}<span style="font-size:14px; color:#888; font-weight:500;"> / year</span></p>
          <div style="background:rgba(10,170,119,0.1); border-radius:8px; padding:10px 12px;">
            <p style="margin:0; font-size:13px; font-weight:700; color:#0a7;">↓ Recoverable: ${recoverableStr}/year</p>
            <p style="margin:4px 0 0; font-size:11px; color:#666; line-height:1.5;">
              Organizations with a governed context layer report 60-70% reduction across all dimensions.
            </p>
          </div>
        </div>

        <div style="border-left:3px solid #111; padding:0 0 0 16px; margin:24px 0;">
          <p style="margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:#888; font-weight:700;">
            Why your profile produces this pattern
          </p>
          <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#111;">${narrative.headline}</p>
          <p style="margin:0; font-size:14px; color:#444; line-height:1.6;">${narrative.why}</p>
        </div>

        <div style="background:#0a7; color:#fff; border-radius:12px; padding:18px 20px; margin:24px 0;">
          <p style="margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:0.12em; opacity:0.85; font-weight:700;">
            What to fix first
          </p>
          <p style="margin:0; font-size:15px; line-height:1.55;">${narrative.firstFix}</p>
        </div>

        <h3 style="margin:32px 0 4px; font-size:13px; text-transform:uppercase; letter-spacing:0.12em; color:#555; font-weight:700;">
          What AI-native organizations measure instead
        </h3>
        <p style="margin:0 0 12px; font-size:13px; color:#666;">The metrics that don't exist in your organization yet.</p>
        <table style="width:100%; border-collapse:separate; border-spacing:8px 0; margin:0 -8px 8px;">
          <tr>
            <td style="width:33%; vertical-align:top; border:1px solid #eee; border-radius:12px; padding:14px; text-align:center; background:#fff;">
              <p style="margin:0 0 6px; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#888;">Knowledge Capture</p>
              <p style="margin:0 0 4px; font-size:22px; font-weight:800; color:#111;">~0%</p>
              <p style="margin:0; font-size:11px; color:#0a7; font-weight:600;">AI-native: 60–80%</p>
            </td>
            <td style="width:33%; vertical-align:top; border:1px solid #eee; border-radius:12px; padding:14px; text-align:center; background:#fff;">
              <p style="margin:0 0 6px; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#888;">Cycle Time</p>
              <p style="margin:0 0 4px; font-size:22px; font-weight:800; color:#111;">~${cycleHours}h</p>
              <p style="margin:0; font-size:11px; color:#0a7; font-weight:600;">AI-native: 3–4× faster</p>
            </td>
            <td style="width:33%; vertical-align:top; border:1px solid #eee; border-radius:12px; padding:14px; text-align:center; background:#fff;">
              <p style="margin:0 0 6px; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#888;">Delegation</p>
              <p style="margin:0 0 4px; font-size:22px; font-weight:800; color:#111;">~${delegationPct}%</p>
              <p style="margin:0; font-size:11px; color:#0a7; font-weight:600;">AI-native: 60–75%</p>
            </td>
          </tr>
        </table>

        <h3 style="margin:24px 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.12em; color:#555; font-weight:700;">
          Your inputs
        </h3>
        <ul style="padding:0; list-style:none; margin:0 0 24px; color:#333; font-size:14px; line-height:1.7;">
          <li><strong>Department profile:</strong> ${deptName}</li>
          <li><strong>Team size:</strong> ${team_size ?? "—"}</li>
          <li><strong>Fully-loaded hourly cost:</strong> ${hourlyStr}</li>
        </ul>

        <div style="border:1px solid #111; border-radius:14px; padding:22px; margin:28px 0 16px; background:#0b0b0c; color:#f7f7f7;">
          <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#9bdfc1;">AI-native organizations</p>
          <p style="margin:0 0 12px; font-size:18px; font-weight:700; line-height:1.4;">
            Eliminate every tax above. Then unlock what most teams can't measure: knowledge capture, faster cycles, and safe delegation.
          </p>
          <p style="margin:0 0 16px; font-size:13px; color:#cfcfcf; line-height:1.6;">
            LIZA OS is the context layer that turns expert judgment into governed, executable AI workflows. The same work, captured once and propagated cleanly across your team and adjacent functions.
          </p>
          <a href="https://lizaos.ai"
             style="display:inline-block; background:#fff; color:#111; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:700; font-size:13px; margin-right:8px;">
            See the LIZA OS platform →
          </a>
          <a href="https://lizaos.ai/diagnostic"
             style="display:inline-block; background:transparent; color:#fff; padding:12px 20px; border:1px solid rgba(255,255,255,0.4); border-radius:8px; text-decoration:none; font-weight:600; font-size:13px;">
            Run the deeper assessment
          </a>
        </div>

        <p style="color:#888; font-size:11px; margin-top:24px; line-height:1.6;">
          Methodology: rework hours sourced from Zapier AI Workslop Report (n=1,100, Jan 2026), cross-referenced with Workday Global AI Impact Study 2026.
          Department tax profiles calibrated to structural characteristics of each function. Recovery rate based on the 65% midpoint reported in organizations with structured governance.
        </p>
      </div>
    `;

    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: [email],
        bcc: ["kristof.eger@lizaos.ai"],
        reply_to: "kristof.eger@lizaos.ai",
        subject: `Your full Context Gap report: ${totalGapStr}/year`,
        html: userHtml,
      }),
    });

    if (!userRes.ok) {
      const body = await userRes.text();
      console.error("user email failed", userRes.status, body);
      throw new Error(`Resend (user) [${userRes.status}]: ${body}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("notify-calculator-lead error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
