import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Archon" };

export default function PrivacyPage() {
  return (
    <article className="prose-custom">
      <h1>Privacy Policy</h1>
      <p className="text-muted">Last updated: May 2026</p>

      <h2>1. Information We Collect</h2>
      <p><strong>Account data:</strong> Name, email address, and authentication provider information (via Clerk).</p>
      <p><strong>Usage data:</strong> Agent execution traces, model usage, token counts, cost metrics, and API call metadata submitted through the SDK.</p>
      <p><strong>API keys:</strong> Stored as irreversible SHA-256 hashes. We never store or have access to your plain-text API keys after creation.</p>

      <h2>2. How We Use Your Data</h2>
      <p>We use your data to: (a) provide the dashboard analytics and trace viewer; (b) enforce budget limits; (c) send email notifications you've opted into; (d) improve the Service.</p>

      <h2>3. Data Storage</h2>
      <p>Data is stored in Convex (real-time database) with encryption at rest. Authentication is handled by Clerk with industry-standard security practices. All data is scoped per user — enforced at the database query level.</p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your data. We share data only with: (a) Convex (database provider); (b) Clerk (authentication provider); (c) SMTP provider (for transactional emails). No data is shared with LLM providers through our Service.</p>

      <h2>5. GDPR Compliance</h2>
      <p>Archon supports GDPR rights including: (a) <strong>Right to access</strong> — export all your data from Settings; (b) <strong>Right to erasure</strong> — delete your account and all associated data; (c) <strong>Right to portability</strong> — download traces in JSON format. Audit logs are retained per governance policy even after erasure.</p>

      <h2>6. Cookies</h2>
      <p>We use essential cookies for authentication (Clerk session tokens). No tracking or advertising cookies are used.</p>

      <h2>7. Email Communications</h2>
      <p>Transactional emails (welcome, API key events, security alerts) are sent from <strong>noreply@archon.yashbogam.me</strong>. You can manage notification preferences in Settings. Emails are sent via SMTP — we do not use third-party email marketing platforms.</p>

      <h2>8. Data Retention</h2>
      <p>Agent traces are retained indefinitely unless you delete them. Account data is deleted upon account deletion. Audit logs may be retained for compliance purposes.</p>

      <h2>9. Security</h2>
      <p>We implement: SHA-256 hashed API keys, scoped database queries (per-user isolation), HTTPS everywhere, JWT-based authentication with automatic token refresh, and default-deny security policies in the SDK.</p>

      <h2>10. Changes</h2>
      <p>We may update this policy. Material changes will be communicated via email to your registered address.</p>

      <h2>11. Contact</h2>
      <p>For privacy inquiries, contact <a href="mailto:hello@yashbogam.me">hello@yashbogam.me</a>.</p>
    </article>
  );
}
