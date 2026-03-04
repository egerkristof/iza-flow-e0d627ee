import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, role_description } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Parse role_description for richer email
    const parts = (role_description || '').split(' | ');
    const detailRows = parts.map((p: string) => `<li style="margin-bottom:4px;">${p}</li>`).join('');

    const html = `
      <h2>New LIZA OS Beta Signup 🎉</h2>
      <p><strong>Email:</strong> ${email}</p>
      <ul style="list-style:none;padding:0;">${detailRows}</ul>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee;" />
      <p style="color:#888;font-size:13px;">Submitted via the beta signup form. Reach out within 48h to schedule onboarding.</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LIZA OS <invite@invite.lizaos.ai>',
        to: ['kristof.eger@lizaos.ai', 'istvan.boscha@aliz.ai'],
        subject: `New beta signup: ${email}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend API error [${res.status}]: ${body}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('notify-signup error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
