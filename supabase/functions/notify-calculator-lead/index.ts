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
  why: "Without governed instruction sets, every AI workflow is rebuilt ad-hoc, drifts in quality, and compounds friction at every team boundary.",
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

    // Build per-tax rows if provided
    const taxRow = (label: string, val: number, kind: "team" | "org") => `
      <tr>
        <td style="padding:10px 14px; border-bottom:1px solid #f0f0f0; font-size:14px; color:#333;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:999px; background:${kind === "org" ? "#0a7" : "#3b82f6"};"></span>
            ${label}
          </div>
        </td>
        <td style="padding:10px 14px; border-bottom:1px solid #f0f0f0; font-size:14px; color:#111; font-weight:700; text-align:right; white-space:nowrap;">
          ${fmtEUR(val)}/yr
        </td>
      </tr>`;

    const breakdownTable = taxes
      ? `
      <table style="width:100%; border-collapse:collapse; border:1px solid #eee; border-radius:12px; overflow:hidden; margin:12px 0 8px;">
        <thead>
          <tr style="background:#fafafa;">
            <td colspan="2" style="padding:10px 14px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#666;">
              Department-level taxes — subtotal ${teamSubStr}/yr
            </td>
          </tr>
        </thead>
        <tbody>
          ${taxRow("Duplication Tax", taxes.duplication, "team")}
          ${taxRow("Inconsistency Tax", taxes.inconsistency, "team")}
          ${taxRow("Attrition Tax", taxes.attrition, "team")}
          ${taxRow("Onboarding Tax", taxes.onboarding, "team")}
        </tbody>
      </table>

      <table style="width:100%; border-collapse:collapse; border:1px solid #eee; border-radius:12px; overflow:hidden; margin:8px 0 16px;">
        <thead>
          <tr style="background:#fafafa;">
            <td colspan="2" style="padding:10px 14px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#666;">
              Organizational ripple — subtotal ${orgSubStr}/yr
            </td>
          </tr>
        </thead>
        <tbody>
          ${taxRow("Handoff Friction Tax", taxes.handoff, "org")}
          ${taxRow("Shadow Governance Tax", taxes.shadowGovernance, "org")}
        </tbody>
      </table>
      `
      : "";

    // 1) Internal notification
    const internalHtml = `
      <h2>New Instruction Gap Calculator lead 📊</h2>
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
        <li><strong>Total instruction gap:</strong> ${totalGapStr}</li>
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
      <p style="color:#888;font-size:13px;">Submitted via the Instruction Gap Calculator. Follow up within 48h.</p>
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

    // 2) User snapshot — full breakdown + interpretation + first fix
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#111; max-width:600px; margin:0 auto;">
        <h2 style="margin:0 0 8px; font-size:22px;">Your Instruction Gap breakdown</h2>
        <p style="color:#555; margin:0 0 24px;">
          Hi ${name || "there"}, here's the full per-tax breakdown for ${deptName} (${team_size ?? "—"} people) — plus where the cost concentrates and what to fix first.
        </p>

        <div style="border:1px solid #eee; border-radius:12px; padding:20px; margin-bottom:20px; background:#fafafa;">
          <p style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">Total annual gap</p>
          <p style="margin:0 0 16px; font-size:30px; font-weight:800; color:#111; letter-spacing:-0.02em;">${totalGapStr}</p>
          <p style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">Recoverable with governed instructions</p>
          <p style="margin:0; font-size:22px; font-weight:700; color:#0a7;">${recoverableStr} / year</p>
        </div>

        <h3 style="margin:24px 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.1em; color:#555; font-weight:700;">
          Where the cost is leaking
        </h3>
        ${breakdownTable}
        <p style="margin:0 0 20px; font-size:12px; color:#888; line-height:1.6;">
          Direct AI rework is the visible line: <strong style="color:#333;">${reworkStr}/year</strong>.
          The taxes above are the structural costs that compound underneath — most teams never measure them.
        </p>

        <div style="border-left:3px solid #111; padding:0 0 0 16px; margin:24px 0;">
          <p style="margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#888; font-weight:700;">
            Why your profile produces this pattern
          </p>
          <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#111;">${narrative.headline}</p>
          <p style="margin:0; font-size:14px; color:#444; line-height:1.6;">${narrative.why}</p>
        </div>

        <div style="background:#0a7; color:#fff; border-radius:12px; padding:20px; margin:24px 0;">
          <p style="margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; opacity:0.85; font-weight:700;">
            What to fix first
          </p>
          <p style="margin:0; font-size:15px; line-height:1.55;">${narrative.firstFix}</p>
        </div>

        <h3 style="margin:24px 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.1em; color:#555; font-weight:700;">
          Your inputs
        </h3>
        <ul style="padding:0; list-style:none; margin:0 0 24px; color:#333; font-size:14px; line-height:1.7;">
          <li><strong>Department profile:</strong> ${deptName}</li>
          <li><strong>Team size:</strong> ${team_size ?? "—"}</li>
          <li><strong>Fully-loaded hourly cost:</strong> ${hourlyStr}</li>
        </ul>

        <div style="margin:24px 0;">
          <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
             style="display:inline-block; background:#111; color:#fff; padding:14px 24px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
            Walk through your numbers — book 20 min
          </a>
        </div>

        <p style="color:#888; font-size:11px; margin-top:32px; line-height:1.6;">
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
        reply_to: "kristof.eger@lizaos.ai",
        subject: `Your Instruction Gap breakdown: ${totalGapStr}/year`,
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
