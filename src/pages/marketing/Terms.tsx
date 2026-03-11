import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export default function TermsPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last updated: 11 March 2026</p>

        <section className="space-y-4 text-sm text-foreground/85 leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the LIZA OS website and services (including the AI Execution Diagnostic), you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Service Description</h2>
          <p>
            LIZA OS provides an AI execution management platform and related tools, including a free AI Execution Diagnostic that evaluates your team's AI maturity across five dimensions. The diagnostic is provided for informational and educational purposes.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Use of the Diagnostic</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>The diagnostic is free to use and does not require an account.</li>
            <li>Results are generated algorithmically based on your responses and should be treated as indicative guidance, not professional advice.</li>
            <li>Providing your email address is optional and is used solely to deliver your results and action plan, and to follow up about relevant services.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Intellectual Property</h2>
          <p>
            All content on this website — including the diagnostic methodology, scoring model, text, graphics, and software — is the intellectual property of LIZA OS / Kristof Eger. You may not reproduce, distribute, or create derivative works without written permission.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the service for any unlawful purpose.</li>
            <li>Attempt to reverse-engineer, scrape, or automate interactions with the diagnostic tool.</li>
            <li>Submit false or misleading information.</li>
            <li>Interfere with the proper functioning of the service.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">6. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the diagnostic results will be accurate, complete, or suitable for any specific business decision. Use of the results is at your own discretion and risk.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, LIZA OS and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the service, including but not limited to business decisions made based on diagnostic results.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">8. Data Processing</h2>
          <p>
            Your use of this service is also governed by our{" "}
            <a href="/privacy" className="text-primary underline">Privacy Policy</a>,
            which details how we collect, use, and protect your personal data.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">9. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued use of the service after changes are posted constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the European Union and the applicable national laws of the data controller's jurisdiction.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">11. Contact</h2>
          <p>
            For questions about these Terms, contact:<br />
            Kristof Eger<br />
            <a href="mailto:kristof.eger@lizaos.ai" className="text-primary underline">kristof.eger@lizaos.ai</a>
          </p>
        </section>
      </div>
    </MarketingLayout>
  );
}
