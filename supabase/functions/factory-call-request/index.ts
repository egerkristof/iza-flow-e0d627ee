// Sends an internal notification when a Head of AI requests the 20-minute call
// after seeing their Factory Floor verdict.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escape = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, company, role, promise, workflow, grading, verdict, submission_id } =
      await req.json();

    if (!email || !name || !company) {
      return new Response(JSON.stringify({ error: "name, email, company required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const v = verdict ?? {};
    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111;max-width:640px;">
        <h2 style="margin:0 0 4px;">Factory Floor: call requested</h2>
        <p style="color:#888;font-size:12px;margin:0 0 18px;">Submission ${escape(submission_id || "")}</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px;">
          <tr><td style="padding:6px 0;color:#666;width:110px;">Name</td><td><strong>${escape(name)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666;">Email</td><td><strong>${escape(email)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666;">Company</td><td><strong>${escape(company)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666;">Role</td><td>${escape(role || "")}</td></tr>
        </table>

        <h3 style="margin:18px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#666;">Their three answers</h3>
        <p style="margin:6px 0;"><strong>Promise:</strong> ${escape(promise)}</p>
        <p style="margin:6px 0;"><strong>Workflow:</strong> ${escape(workflow)}</p>
        <p style="margin:6px 0;"><strong>Grading:</strong> ${escape(grading)}</p>

        <h3 style="margin:18px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#666;">The verdict you generated</h3>
        <p style="margin:6px 0;font-weight:700;font-size:16px;">${escape(v.headline || "")}</p>
        <p style="margin:6px 0;color:#444;">${escape(v.gap_named || "")}</p>
        <ul style="margin:8px 0 8px 18px;padding:0;color:#444;">
          ${(v.breaks_next_quarter || []).map((b: string) => `<li style="margin:4px 0;">${escape(b)}</li>`).join("")}
        </ul>
        <p style="margin:10px 0;color:#444;"><em>${escape(v.the_call || "")}</em></p>

        <hr style="margin:18px 0;border:none;border-top:1px solid #eee;" />
        <p style="color:#888;font-size:12px;">Vet, then send the Cal link within 24h.</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "LIZA OS <invite@invite.lizaos.ai>",
        to: ["kristof.eger@lizaos.ai"],
        reply_to: email,
        subject: `Factory Floor call: ${name} / ${company}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend failed", res.status, body);
      return new Response(JSON.stringify({ error: "email failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("factory-call-request error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});