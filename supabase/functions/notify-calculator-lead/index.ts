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
      team_size,
      hourly_cost,
      total_gap,
      recoverable,
      rework_annual,
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

    // 1) Internal notification
    const internalHtml = `
      <h2>New Instruction Gap Calculator lead 📊</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${name || "—"}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee;" />
      <h3 style="margin:0 0 8px;">Inputs</h3>
      <ul style="list-style:none;padding:0;margin:0 0 16px;">
        <li><strong>Department:</strong> ${department || "—"}</li>
        <li><strong>Team size:</strong> ${team_size ?? "—"}</li>
        <li><strong>Hourly cost:</strong> ${hourlyStr}</li>
      </ul>
      <h3 style="margin:0 0 8px;">Computed</h3>
      <ul style="list-style:none;padding:0;margin:0;">
        <li><strong>Annual rework cost:</strong> ${reworkStr}</li>
        <li><strong>Total instruction gap:</strong> ${totalGapStr}</li>
        <li><strong>Recoverable (65%):</strong> ${recoverableStr}</li>
      </ul>
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

    // 2) User snapshot
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#111; max-width:560px;">
        <h2 style="margin:0 0 8px;">Your Instruction Gap snapshot</h2>
        <p style="color:#555; margin:0 0 24px;">Hi ${name || "there"}, here's the breakdown you ran on lizaos.ai.</p>

        <div style="border:1px solid #eee; border-radius:12px; padding:20px; margin-bottom:20px;">
          <p style="margin:0 0 4px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:0.08em;">Total annual gap</p>
          <p style="margin:0 0 16px; font-size:28px; font-weight:800; color:#111;">${totalGapStr}</p>

          <p style="margin:0 0 4px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:0.08em;">Recoverable with governed instructions</p>
          <p style="margin:0; font-size:22px; font-weight:700; color:#0a7;">${recoverableStr} / year</p>
        </div>

        <h3 style="margin:0 0 8px; font-size:14px; text-transform:uppercase; letter-spacing:0.08em; color:#555;">Your inputs</h3>
        <ul style="padding:0; list-style:none; margin:0 0 24px; color:#333; font-size:14px; line-height:1.7;">
          <li><strong>Department profile:</strong> ${department || "—"}</li>
          <li><strong>Team size:</strong> ${team_size ?? "—"}</li>
          <li><strong>Fully-loaded hourly cost:</strong> ${hourlyStr}</li>
          <li><strong>Direct AI rework (annual):</strong> ${reworkStr}</li>
        </ul>

        <p style="color:#444; font-size:14px; line-height:1.6;">
          The number above is what unstructured AI is costing your team every year. Most of it is recoverable
          once the underlying instructions, definitions, and workflows are governed at the infrastructure level.
        </p>

        <div style="margin:24px 0;">
          <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
             style="display:inline-block; background:#111; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
            Book a 20-min walkthrough
          </a>
        </div>

        <p style="color:#888; font-size:12px; margin-top:32px;">
          Methodology: Zapier AI Workslop Report (n=1,100), Workday Global AI Impact Study 2026.
          Recovery rate based on the 65% midpoint reported in organizations with structured governance.
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
        subject: `Your Instruction Gap snapshot: ${totalGapStr}/year`,
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
