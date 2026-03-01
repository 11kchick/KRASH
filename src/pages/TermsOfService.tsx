import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display text-foreground">Terms of Service</h1>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8 font-body text-foreground leading-relaxed">
            <p className="text-muted-foreground text-sm">Last updated: March 1, 2026</p>

            <section className="space-y-3">
              <h2 className="text-xl font-display">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">By accessing or using TripLink ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">2. Description of Service</h2>
              <p className="text-muted-foreground">TripLink is a platform that connects travelers heading to the same destination to share costs and experiences. We facilitate connections — we are not a travel agency, tour operator, or accommodation provider.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">3. Eligibility</h2>
              <p className="text-muted-foreground">You must be at least 18 years old to create an account. By registering, you represent that you meet this requirement.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">4. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must provide accurate and truthful information</li>
                <li>You may not create multiple accounts or impersonate others</li>
                <li>You may delete your account at any time from your account settings</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">5. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Use the Service for unlawful purposes</li>
                <li>Post false, misleading, or fraudulent trip information</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Attempt to gain unauthorized access to systems or data</li>
                <li>Scrape, crawl, or otherwise extract data without permission</li>
                <li>Interfere with the operation of the Service</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">6. Donations & Payments</h2>
              <p className="text-muted-foreground">Donations made through TripLink are voluntary and processed by third-party payment providers. We do not store payment card information. Refund policies are outlined on the donation page.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">TripLink is provided "as-is" without warranties of any kind. We are not liable for:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>The behavior, actions, or reliability of other users</li>
                <li>Any losses arising from trip arrangements made through the platform</li>
                <li>Service interruptions, data loss, or security breaches beyond our control</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">8. Intellectual Property</h2>
              <p className="text-muted-foreground">All content, branding, and code on TripLink is owned by us or our licensors. You retain ownership of content you post, but grant us a license to display it on the platform.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">9. Privacy</h2>
              <p className="text-muted-foreground">Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your data.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">10. Termination</h2>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">11. Changes to Terms</h2>
              <p className="text-muted-foreground">We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">12. Contact</h2>
              <p className="text-muted-foreground">For questions about these terms, contact us at <strong className="text-foreground">legal@triplink.app</strong>.</p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Questions? Contact us at <strong className="text-foreground">legal@triplink.app</strong></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
