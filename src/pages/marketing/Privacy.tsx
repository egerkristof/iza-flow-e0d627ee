import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 11 March 2026</p>

        <section className="space-y-4 text-sm text-foreground/85 leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">1. Who We Are</h2>
          <p>
            LIZA OS is operated by Kristof Eger ("we", "us", "our"). For questions about how we handle your data, contact us at{" "}
            <a href="mailto:kristof.eger@lizaos.ai" className="text-primary underline">kristof.eger@lizaos.ai</a>.
          </p>
          <p>We act as the <strong>data controller</strong> for all personal data collected through this website.</p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. What Data We Collect</h2>
          <p>We collect the following data when you interact with our services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>AI Execution Diagnostic:</strong> Your answers to diagnostic questions and the resulting scores. This data is collected without any personal identifiers unless you choose to provide your email.</li>
            <li><strong>Email address:</strong> Only when you voluntarily submit it to receive your personalised results and action plan.</li>
            <li><strong>Beta signup:</strong> Email and optional role description when you sign up for early access.</li>
            <li><strong>Usage data:</strong> Basic analytics (page views, device type) collected through standard web technologies. No third-party tracking cookies are used.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To send you your diagnostic results and personalised action plan via email.</li>
            <li>To follow up about your results and how we can help your team, where you have provided your email for that purpose.</li>
            <li>To improve our diagnostic tool and understand aggregate patterns (anonymised).</li>
            <li>To communicate about LIZA OS early access, product updates, and relevant content.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Legal Basis for Processing (GDPR)</h2>
          <p>We process your personal data under the following legal bases:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> When you submit your email to receive results. You can withdraw consent at any time by contacting us.</li>
            <li><strong>Legitimate interest (Art. 6(1)(f) GDPR):</strong> For follow-up communication about services relevant to your diagnostic results, and for aggregate analysis to improve our tools.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">5. Data Storage & Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. Our infrastructure is hosted within the EU/EEA region. We use Supabase (cloud database) and Resend (email delivery) as sub-processors, both of which maintain GDPR-compliant data processing agreements.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">6. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Diagnostic results (without email):</strong> Retained indefinitely in anonymised, aggregate form.</li>
            <li><strong>Email addresses and associated results:</strong> Retained for up to 24 months from submission, or until you request deletion.</li>
            <li><strong>Beta signup data:</strong> Retained until the product launches publicly or you request deletion.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">7. Your Rights</h2>
          <p>Under the GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification:</strong> Ask us to correct inaccurate data.</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
            <li><strong>Restriction:</strong> Ask us to limit how we process your data.</li>
            <li><strong>Data portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interest.</li>
            <li><strong>Withdraw consent:</strong> Where processing is based on consent, withdraw it at any time.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:kristof.eger@lizaos.ai" className="text-primary underline">kristof.eger@lizaos.ai</a>.
            We will respond within 30 days.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">8. Third-Party Sharing</h2>
          <p>We do not sell your data. We share data only with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Sub-processors:</strong> Supabase (database hosting), Resend (email delivery), Google AI (for generating personalised action plans). All maintain GDPR-compliant agreements.</li>
            <li><strong>Legal obligations:</strong> If required by law.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">9. Cookies</h2>
          <p>
            We use only essential cookies required for the website to function. We do not use advertising, tracking, or third-party analytics cookies.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via our website. The "last updated" date at the top reflects the most recent revision.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">11. Contact</h2>
          <p>
            Kristof Eger, Data Controller<br />
            <a href="mailto:kristof.eger@lizaos.ai" className="text-primary underline">kristof.eger@lizaos.ai</a>
          </p>
          <p>
            If you believe your data protection rights have been violated, you have the right to lodge a complaint with a supervisory authority in your country of residence.
          </p>
        </section>
      </div>
    </MarketingLayout>
  );
}
