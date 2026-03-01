import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display text-foreground">Privacy Policy</h1>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8 font-body text-foreground leading-relaxed">
            <p className="text-muted-foreground text-sm">Last updated: March 1, 2026</p>

            <section className="space-y-3">
              <h2 className="text-xl font-display">1. Information We Collect</h2>
              <p>We collect only what's necessary to connect travelers:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Account info:</strong> Name, email address</li>
                <li><strong className="text-foreground">Trip details:</strong> Destination, group size, duration</li>
                <li><strong className="text-foreground">Usage data:</strong> Pages visited, actions taken (anonymized)</li>
              </ul>
              <p className="text-muted-foreground">We do <strong className="text-foreground">not</strong> collect payment card details directly — all payments are processed by our third-party payment provider.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">2. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Match you with travelers heading to the same destination</li>
                <li>Communicate trip updates and matches</li>
                <li>Improve our service and fix bugs</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-muted-foreground">We will <strong className="text-foreground">never</strong> sell your personal data to third parties.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">3. Legal Basis for Processing (GDPR)</h2>
              <p className="text-muted-foreground">We process your data based on:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Consent:</strong> You agree when creating an account</li>
                <li><strong className="text-foreground">Contract:</strong> Necessary to provide the trip-linking service</li>
                <li><strong className="text-foreground">Legitimate interest:</strong> Analytics to improve the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">4. Data Storage & Security</h2>
              <p className="text-muted-foreground">Your data is encrypted at rest and in transit (TLS 1.2+). We use industry-standard security measures including:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Passwords hashed with bcrypt (salted)</li>
                <li>Row-level security on all database tables</li>
                <li>API keys stored in encrypted environment variables</li>
                <li>Regular security audits</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">5. Your Rights</h2>
              <p className="text-muted-foreground">Under GDPR and CCPA, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Access</strong> your personal data</li>
                <li><strong className="text-foreground">Rectify</strong> inaccurate data</li>
                <li><strong className="text-foreground">Delete</strong> your account and all associated data</li>
                <li><strong className="text-foreground">Port</strong> your data in a machine-readable format</li>
                <li><strong className="text-foreground">Opt out</strong> of marketing communications</li>
                <li><strong className="text-foreground">Withdraw consent</strong> at any time</li>
              </ul>
              <p className="text-muted-foreground">To exercise any of these rights, contact us at <strong className="text-foreground">privacy@journeynexus.app</strong>.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">6. Cookies</h2>
              <p className="text-muted-foreground">We use essential cookies for authentication and session management. Optional analytics cookies are only set with your explicit consent. You can manage your preferences at any time through our cookie banner.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">7. Data Retention</h2>
              <p className="text-muted-foreground">We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days. Anonymized analytics data may be retained indefinitely.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">8. Third-Party Services</h2>
              <p className="text-muted-foreground">We may share limited data with:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Authentication providers (Google Sign-In)</li>
                <li>Payment processors (for donations)</li>
                <li>Analytics services (anonymized only, with consent)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">9. Children's Privacy</h2>
              <p className="text-muted-foreground">JourneyNexus is not intended for users under 18. We do not knowingly collect data from minors.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">We may update this policy periodically. We will notify registered users via email of any material changes.</p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Questions? Contact us at <strong className="text-foreground">privacy@journeynexus.app</strong></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
