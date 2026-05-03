import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Archon" };

export default function TermsPage() {
  return (
    <article className="prose-custom">
      <h1>Terms of Service</h1>
      <p className="text-muted">Last updated: May 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using Archon (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

      <h2>2. Description of Service</h2>
      <p>Archon provides a production harness for AI agents, including cost control, security, observability, memory management, evaluation, and governance tools. The Service includes the Archon SDK (Python and TypeScript), the web dashboard, and associated APIs.</p>

      <h2>3. Account Registration</h2>
      <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and API keys. Notify us immediately at <a href="mailto:hello@yashbogam.me">hello@yashbogam.me</a> if you suspect unauthorized access.</p>

      <h2>4. API Keys</h2>
      <p>API keys are stored as SHA-256 hashes and cannot be recovered after creation. You are responsible for securely storing your keys. Archon is not liable for unauthorized usage resulting from compromised keys.</p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to reverse-engineer the Service; (c) transmit malicious code through the API; (d) exceed rate limits or abuse the infrastructure; (e) resell access without authorization.</p>

      <h2>6. Data and Privacy</h2>
      <p>Agent execution traces, API usage metrics, and account data are stored in accordance with our <a href="/privacy">Privacy Policy</a>. You retain ownership of all data processed through your agents.</p>

      <h2>7. Budget and Billing</h2>
      <p>Budget limits set through the SDK are enforced as hard stops. Archon is not responsible for costs incurred through third-party LLM providers. You are responsible for configuring appropriate budget limits.</p>

      <h2>8. Service Availability</h2>
      <p>We strive for high availability but do not guarantee uninterrupted service. The Service is provided &ldquo;as is&rdquo; without warranties of any kind.</p>

      <h2>9. Limitation of Liability</h2>
      <p>Archon shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to LLM costs, data loss, or business interruption.</p>

      <h2>10. Open Source</h2>
      <p>The Archon SDK is licensed under Apache-2.0. The web dashboard and cloud services are proprietary. Contributions to the open-source components are governed by the project&apos;s contributor agreement.</p>

      <h2>11. Modifications</h2>
      <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance. Material changes will be communicated via email.</p>

      <h2>12. Contact</h2>
      <p>For questions about these Terms, contact us at <a href="mailto:hello@yashbogam.me">hello@yashbogam.me</a>.</p>
    </article>
  );
}
