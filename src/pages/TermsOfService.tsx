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
              <p className="text-muted-foreground"><strong className="text-foreground">By creating an account and using this Service, you confirm that you have read, understood, and agree to these Terms of Service. You will be required to scroll through the entire Terms before accepting. If you do not agree, you may not use the Service.</strong></p>
              <p className="text-muted-foreground">By accessing or using JourneyNexus ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">2. Description of Service</h2>
              <p className="text-muted-foreground">JourneyNexus is a platform that connects travelers heading to the same destination to share costs and experiences. We facilitate connections — we are not a travel agency, tour operator, or accommodation provider.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">3. Eligibility</h2>
              <p className="text-muted-foreground">You must be at least 18 years old to create an account. By registering, you represent that you meet this requirement.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">4. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li><strong className="text-foreground">You are fully responsible for all activity that occurs under your account</strong>, whether or not you authorized it</li>
                <li>You must provide accurate and truthful information</li>
                <li>You may not create multiple accounts or impersonate others</li>
                <li>You may not share, transfer, sell, or otherwise provide access to your account to any other person or entity</li>
                <li>You must notify us immediately at <strong className="text-foreground">legal@journeynexus.app</strong> if you believe your credentials have been compromised or your account has been accessed without authorization</li>
                <li>We reserve the right to suspend or terminate your account at any time if we determine, in our sole discretion, that you have violated these Terms or engaged in conduct that may harm other users or the Service</li>
                <li>You may delete your account at any time from your account settings</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">5. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Use the Service for unlawful purposes</li>
                <li>Post false, misleading, or fraudulent trip information</li>
                <li>Upload, share, or distribute content that is offensive, obscene, defamatory, infringes on intellectual property rights, or is otherwise illegal</li>
                <li>Send unsolicited commercial messages, spam, or promote other services or products without prior written consent</li>
                <li>Impersonate any person or entity, or falsely represent your affiliation with any person, entity, or the Service itself</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Attempt to gain unauthorized access to systems, accounts, or data, or introduce viruses, malware, trojans, or other harmful code</li>
                <li>Attempt to bypass, circumvent, or disable any security features, access controls, usage limits, or restrictions of the Service</li>
                <li>Scrape, crawl, or otherwise extract data without permission</li>
                <li>Interfere with the operation of the Service</li>
              </ul>
              <p className="text-muted-foreground">You are encouraged to report any known or suspected violations of these terms by contacting us at <strong className="text-foreground">legal@journeynexus.app</strong>.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">6. Payments & Cost Sharing</h2>
              <p className="text-muted-foreground"><strong className="text-foreground">JourneyNexus does not process, facilitate, or handle any payments for trip accommodations, travel expenses, or cost-sharing between users.</strong> Users are responsible for booking accommodations directly through third-party platforms such as Airbnb, VRBO, or similar services, and for settling shared costs among themselves using external payment methods such as Venmo, PayPal, Zelle, or similar tools.</p>
              <p className="text-muted-foreground">The only payments processed by JourneyNexus are for signup and membership fees. These are processed by third-party payment providers. We do not store payment card information.</p>
              <p className="text-muted-foreground"><strong className="text-foreground">JourneyNexus is not responsible for any disputes, losses, or issues arising from accommodation bookings, cost-sharing arrangements, or payments made between users outside of the platform.</strong></p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">7. Personal Safety & User Vetting</h2>
              <p className="text-muted-foreground">JourneyNexus does not perform comprehensive background checks, criminal screenings, or identity verifications on all users. While we may offer optional verification features, <strong className="text-foreground">the platform does not guarantee the identity, character, or intentions of any user.</strong></p>
              <p className="text-muted-foreground">You acknowledge that meeting and traveling with strangers involves inherent risks. You are solely responsible for exercising personal judgment, conducting your own due diligence, and taking appropriate safety precautions when interacting with other users both online and in person. <strong className="text-foreground">Failure to follow safety precautions is at your own risk.</strong></p>
              <p className="text-muted-foreground"><strong className="text-foreground">JourneyNexus is not liable for any injuries, losses, damages, or harm — physical, emotional, or financial — resulting from your interactions with other users, whether online or in person.</strong> You use the Service and engage with other users entirely at your own risk.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">JourneyNexus is provided "as-is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>The behavior, actions, safety, or reliability of other users</li>
                <li>Any losses, injuries, damages, or claims arising from trip arrangements, shared accommodations, or in-person meetings facilitated through the platform</li>
                <li>Service interruptions, data loss, or security breaches beyond our reasonable control</li>
                <li>The performance, availability, accuracy, or security of any third-party services integrated with or linked from the platform, including payment processors, mapping services, and communication tools</li>
                <li>Any other direct or indirect losses, damages, or claims arising from your use of the Service</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">9. Indemnification</h2>
              <p className="text-muted-foreground">To the fullest extent permitted by law, you agree to indemnify, defend, and hold harmless JourneyNexus, its officers, employees, and affiliates from any claims — including claims brought by third parties — damages, losses, liabilities, costs, or expenses (including reasonable legal fees) arising out of or related to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Your use or misuse of the Service</li>
                <li>Your interactions with other users, whether online or in person</li>
                <li>Your violation of these Terms or any applicable law</li>
                <li>Any content you post or share on the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">10. Dispute Resolution</h2>
              <p className="text-muted-foreground">In the event of a dispute arising from or related to these Terms or the Service:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Disputes shall first be attempted to be resolved through good-faith negotiation</li>
                <li>If a resolution cannot be reached within 30 days, disputes shall be submitted to binding arbitration in accordance with applicable rules</li>
                <li>You agree that any claims will be brought individually, not as part of a class action or representative proceeding</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">11. Intellectual Property</h2>
              <p className="text-muted-foreground">All content, branding, and code on JourneyNexus is owned by us or our licensors. You retain ownership of content you post, but grant us a license to display it on the platform.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">12. Privacy</h2>
              <p className="text-muted-foreground">Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your data.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">13. Termination</h2>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">14. Changes to Terms</h2>
              <p className="text-muted-foreground">We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display">15. Contact</h2>
              <p className="text-muted-foreground">For questions about these terms, contact us at <strong className="text-foreground">legal@journeynexus.app</strong>.</p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Questions? Contact us at <strong className="text-foreground">legal@journeynexus.app</strong></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
