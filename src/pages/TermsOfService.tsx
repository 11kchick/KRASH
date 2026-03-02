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
              <p className="text-muted-foreground">By creating an account and using this Service, you confirm that you have read, understood, and agree to these Terms of Service. You will be required to acknowledge that you have read and agreed to these Terms before accessing the Service. <strong className="text-foreground">If you do not agree to these Terms, you may not use the Service.</strong></p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">2. Description of Service</h2>
              <p className="text-muted-foreground">The Service is a platform that facilitates connections between travelers heading to the same destination, enabling them to share costs and experiences. We are not a travel agency, tour operator, or accommodation provider. We merely provide a platform for users to connect. You acknowledge that we do not offer or guarantee any travel, accommodation, or other related services.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">3. Eligibility</h2>
              <p className="text-muted-foreground">You must be at least 18 years old to create an account and use the Service. By registering, you represent and warrant that you meet this age requirement. We may require you to provide proof of your age (e.g., government-issued ID) at any time.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">4. User Accounts</h2>
              <p className="text-muted-foreground">You are responsible for maintaining the security and confidentiality of your account credentials. <strong className="text-foreground">You are fully responsible for all activity that occurs under your account, whether or not you have authorized it.</strong></p>
              <p className="text-muted-foreground">You agree to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Provide accurate, truthful, and up-to-date information during the registration process</li>
                <li>Not create multiple accounts or impersonate others</li>
                <li>Not share, transfer, sell, or provide access to your account to any other person or entity</li>
                <li>Notify us immediately at <strong className="text-foreground">contactkrash@yahoo.com</strong> if you believe your account credentials have been compromised or if your account has been accessed without authorization</li>
              </ul>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate your account at our sole discretion if we believe you have violated these Terms or engaged in conduct that may harm other users or the Service.</p>
              <p className="text-muted-foreground">You may delete your account at any time by visiting your account settings.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">5. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Engage in any unlawful activities</li>
                <li>Post false, misleading, or fraudulent trip information</li>
                <li>Upload, share, or distribute content that is offensive, obscene, defamatory, infringes on intellectual property rights, or otherwise violates the law</li>
                <li>Send unsolicited commercial messages or spam, or promote other services or products without prior written consent from us</li>
                <li>Impersonate any person or entity, or falsely represent your affiliation with any individual, entity, or the Service</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Attempt to gain unauthorized access to systems, accounts, or data, or introduce viruses, malware, or other harmful code into the platform</li>
                <li>Scrape, crawl, or otherwise extract data from the platform without permission</li>
                <li>Interfere with the operation of the Service in any way</li>
              </ul>
              <p className="text-muted-foreground">You are encouraged to report any violations of these Terms by contacting us at <strong className="text-foreground">contactkrash@yahoo.com</strong>.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">6. Personal Safety & User Vetting</h2>
              <p className="text-muted-foreground">The Service does not conduct comprehensive background checks, criminal screenings, or identity verifications on all users. While we may offer optional user verification features, <strong className="text-foreground">we do not guarantee the identity, character, or intentions of any user.</strong></p>
              <p className="text-muted-foreground">You acknowledge that meeting and traveling with strangers involves inherent risks. It is your sole responsibility to exercise personal judgment, conduct your own due diligence, and take appropriate safety precautions when interacting with other users both online and in person.</p>
              <p className="text-muted-foreground"><strong className="text-foreground">You agree that the Service is not liable for any injuries, losses, damages, or harm—whether physical, emotional, or financial—resulting from your interactions with other users, whether online or in person. You use the Service and engage with other users entirely at your own risk.</strong></p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">The Service is provided "as-is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>The behavior, actions, safety, or reliability of other users</li>
                <li>Any losses, injuries, damages, or claims arising from trip arrangements, shared accommodations, or in-person meetings facilitated through the platform</li>
                <li>Service interruptions, data loss, or security breaches beyond our reasonable control</li>
                <li>The performance, availability, accuracy, or security of any third-party services integrated with or linked from the platform, including payment processors, mapping services, and communication tools</li>
                <li>Any other direct or indirect losses, damages, or claims arising from your use of the Service</li>
              </ul>
              <p className="text-muted-foreground">You agree that you are solely responsible for your interactions with other users and for any actions taken as a result of your use of the platform.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">8. Indemnification</h2>
              <p className="text-muted-foreground">To the fullest extent permitted by law, you agree to indemnify, defend, and hold harmless the Service, its officers, employees, affiliates, and agents from any claims, damages, losses, liabilities, costs, or expenses (including reasonable legal fees) arising out of:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Your use or misuse of the Service</li>
                <li>Your interactions with other users, whether online or in person</li>
                <li>Your violation of these Terms or any applicable law</li>
                <li>Any content you post or share on the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">9. Dispute Resolution</h2>
              <p className="text-muted-foreground">In the event of a dispute arising from or related to these Terms or the Service:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Disputes should first be attempted to be resolved through good-faith negotiation</li>
                <li>If a resolution cannot be reached within 30 days, the dispute shall be submitted to binding arbitration in accordance with applicable rules</li>
                <li>Any claims or disputes shall be brought individually, not as part of a class action or representative proceeding</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">10. Intellectual Property</h2>
              <p className="text-muted-foreground">All content, branding, and code on the Service, including but not limited to the design, layout, text, images, and software, are owned by us or our licensors and are protected by intellectual property laws.</p>
              <p className="text-muted-foreground">You retain ownership of content you post on the Service but grant us a non-exclusive, worldwide, royalty-free license to display, use, and distribute such content solely in connection with the Service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">11. Privacy</h2>
              <p className="text-muted-foreground">Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal data. By using the Service, you consent to the collection and use of your information as outlined in the Privacy Policy.</p>
              <p className="text-muted-foreground">If you are a resident of the European Union, the General Data Protection Regulation (GDPR) applies to your personal data.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">12. Termination</h2>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate any accounts that violate these Terms or engage in harmful conduct. You may terminate your account at any time by visiting your account settings.</p>
              <p className="text-muted-foreground">Upon termination, your account and any related data will be deleted in accordance with our Privacy Policy, except where we are required by law to retain data for longer periods.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">13. Changes to Terms</h2>
              <p className="text-muted-foreground">We may update these Terms from time to time. You will be notified of material changes either via email or through a notification within the Service. Continued use of the Service after any such changes will constitute your acceptance of the updated Terms.</p>
              <p className="text-muted-foreground">If you do not agree to the revised Terms, you must stop using the Service.</p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Questions? Contact us at <strong className="text-foreground">contactkrash@yahoo.com</strong></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
