import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-body">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center" aria-hidden="true">
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
                <li><strong className="text-foreground">Profile photo:</strong> A live-captured photo for safety verification</li>
                <li><strong className="text-foreground">Trip details:</strong> Destination, group size, travel dates</li>
                <li><strong className="text-foreground">Usage data:</strong> Pages visited, actions taken (only with your consent)</li>
                <li><strong className="text-foreground">Device info:</strong> Browser type, operating system, IP address (for security)</li>
              </ul>
              <p className="text-muted-foreground">We do <strong className="text-foreground">not</strong> collect payment card details directly — all payments are processed by our third-party payment provider (Stripe).</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">2. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Match you with travelers heading to the same destination</li>
                <li>Communicate trip updates and matches</li>
                <li>Improve our service and fix bugs (with consent for analytics)</li>
                <li>Ensure platform safety and enforce community guidelines</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-muted-foreground">We will <strong className="text-foreground">never</strong> sell your personal data to third parties.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">3. Legal Basis for Processing (GDPR)</h2>
              <p className="text-muted-foreground">If you are located in the European Economic Area (EEA), UK, or Switzerland, we process your data based on:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Consent:</strong> For analytics and marketing cookies — you choose to opt in via our cookie banner</li>
                <li><strong className="text-foreground">Contract:</strong> Necessary to provide the trip-linking service you signed up for</li>
                <li><strong className="text-foreground">Legitimate interest:</strong> Security monitoring and fraud prevention</li>
                <li><strong className="text-foreground">Legal obligation:</strong> When required by applicable law</li>
              </ul>
              <p className="text-muted-foreground">You may withdraw consent at any time by clicking "Manage Cookies" in the footer or contacting us at <strong className="text-foreground">privacy@krash.app</strong>.</p>
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

            <section id="your-choices" className="space-y-3">
              <h2 className="text-xl font-display">5. Your Rights</h2>

              <h3 className="text-lg font-display text-foreground mt-4">GDPR Rights (EEA/UK/Switzerland)</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-foreground">Rectification:</strong> Correct inaccurate data via Account Settings</li>
                <li><strong className="text-foreground">Erasure:</strong> Delete your account and all associated data</li>
                <li><strong className="text-foreground">Portability:</strong> Request your data in a machine-readable format</li>
                <li><strong className="text-foreground">Restrict processing:</strong> Limit how we use your data</li>
                <li><strong className="text-foreground">Object:</strong> Opt out of processing based on legitimate interest</li>
                <li><strong className="text-foreground">Withdraw consent:</strong> At any time, without affecting prior processing</li>
              </ul>

              <h3 className="text-lg font-display text-foreground mt-4">CCPA Rights (California Residents)</h3>
              <p className="text-muted-foreground">Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Know:</strong> What personal information we collect, use, and disclose</li>
                <li><strong className="text-foreground">Delete:</strong> Request deletion of your personal information</li>
                <li><strong className="text-foreground">Opt out:</strong> Of the sale or sharing of personal information</li>
                <li><strong className="text-foreground">Non-discrimination:</strong> We will not discriminate against you for exercising your rights</li>
                <li><strong className="text-foreground">Correct:</strong> Inaccurate personal information</li>
                <li><strong className="text-foreground">Limit use:</strong> Of sensitive personal information</li>
              </ul>

              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-display text-foreground mb-2">Do Not Sell or Share My Personal Information</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  KRASH does <strong className="text-foreground">not</strong> sell your personal information. However, some data sharing with analytics or advertising partners may constitute a "sale" or "share" under CCPA. You can opt out at any time:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-body"
                  onClick={() => window.dispatchEvent(new CustomEvent("krash-open-cookie-settings"))}
                >
                  Manage Cookie Preferences
                </Button>
              </div>

              <p className="text-muted-foreground">To exercise any of these rights, contact us at <strong className="text-foreground">privacy@krash.app</strong>. We will respond within 30 days (GDPR) or 45 days (CCPA).</p>
            </section>

            <section id="cookies" className="space-y-3">
              <h2 className="text-xl font-display">6. Cookies & Tracking Technologies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device. We use them to provide core functionality and, with your consent, to understand how our platform is used.
              </p>

              <h3 className="text-lg font-display text-foreground mt-4">Cookie Categories</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 font-display text-foreground">Category</th>
                      <th className="px-4 py-3 font-display text-foreground">Purpose</th>
                      <th className="px-4 py-3 font-display text-foreground">Required</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Essential</td>
                      <td className="px-4 py-3">Authentication (session tokens), security (CSRF protection), cookie consent preferences. These cannot be disabled.</td>
                      <td className="px-4 py-3 text-foreground font-medium">Yes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Analytics</td>
                      <td className="px-4 py-3">Help us understand page views, navigation patterns, and feature usage so we can improve KRASH. Data is anonymized.</td>
                      <td className="px-4 py-3">No — opt-in</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Marketing</td>
                      <td className="px-4 py-3">Used to deliver relevant promotions and measure campaign effectiveness. We do not run third-party ad tracking.</td>
                      <td className="px-4 py-3">No — opt-in</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-display text-foreground mt-4">Managing Your Cookie Preferences</h3>
              <p className="text-muted-foreground">You can manage your cookie preferences at any time by:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Clicking <button onClick={() => window.dispatchEvent(new CustomEvent("krash-open-cookie-settings"))} className="text-primary hover:underline">"Manage Cookies"</button> in the website footer</li>
                <li>Adjusting your browser's cookie settings to block or delete cookies</li>
                <li>Contacting us at <strong className="text-foreground">privacy@krash.app</strong> to withdraw consent</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Disabling essential cookies may prevent you from using core features like signing in.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">7. Data Retention</h2>
              <p className="text-muted-foreground">We retain your data for as long as your account is active. If you cancel your membership, your account and data remain intact so you can re-subscribe at any time. Upon account deletion (via Account Settings), all personal data is permanently removed within 30 days. Anonymized analytics data may be retained indefinitely.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">8. Third-Party Services</h2>
              <p className="text-muted-foreground">We may share limited data with:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Google:</strong> OAuth sign-in (name, email, profile picture)</li>
                <li><strong className="text-foreground">Stripe:</strong> Payment processing for membership fees (we never see your card details)</li>
                <li><strong className="text-foreground">Analytics services:</strong> Anonymized usage data (only with your consent)</li>
              </ul>
              <p className="text-muted-foreground">Each third-party service operates under its own privacy policy. We only share the minimum data necessary.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">9. International Data Transfers</h2>
              <p className="text-muted-foreground">Your data may be transferred to and processed in the United States. If you are located in the EEA/UK, we ensure appropriate safeguards (such as Standard Contractual Clauses) are in place to protect your data in accordance with GDPR requirements.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">10. Children's Privacy</h2>
              <p className="text-muted-foreground">KRASH is not intended for users under 18. We do not knowingly collect data from minors. If we learn that we have collected personal information from a child under 18, we will delete it promptly.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">11. Changes to This Policy</h2>
              <p className="text-muted-foreground">We may update this policy periodically. We will notify registered users via email of any material changes. If cookie categories or purposes change, we will re-request your consent.</p>
            </section>

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-sm text-muted-foreground">Questions or requests? Contact us at <strong className="text-foreground">privacy@krash.app</strong></p>
              <p className="text-xs text-muted-foreground">If you are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
