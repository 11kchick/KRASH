import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface TOSModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const TOSModal = ({ open, onAccept, onDecline }: TOSModalProps) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 40;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    if (atBottom && !scrolledToBottom) {
      setScrolledToBottom(true);
    }
  }, [scrolledToBottom]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onDecline(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-3 font-display text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            Terms of Service
          </DialogTitle>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto max-h-[60vh]"
        >
          <div className="p-6 space-y-6 font-body text-sm leading-relaxed">

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">By creating an account and using this Service, you confirm that you have read, understood, and agree to these Terms of Service. You will be required to acknowledge that you have read and agreed to these Terms before accessing the Service. <strong className="text-foreground">If you do not agree to these Terms, you may not use the Service.</strong></p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">2. Description of Service</h3>
              <p className="text-muted-foreground">The Service is a platform that facilitates connections between travelers heading to the same destination, enabling them to share costs and experiences. We are not a travel agency, tour operator, or accommodation provider. We merely provide a platform for users to connect. You acknowledge that we do not offer or guarantee any travel, accommodation, or other related services.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">3. Eligibility</h3>
              <p className="text-muted-foreground">You must be at least 18 years old to create an account and use the Service. By registering, you represent and warrant that you meet this age requirement. We may require you to provide proof of your age (e.g., government-issued ID) at any time.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">4. User Accounts</h3>
              <p className="text-muted-foreground">You are responsible for maintaining the security and confidentiality of your account credentials. <strong className="text-foreground">You are fully responsible for all activity that occurs under your account, whether or not you have authorized it.</strong></p>
              <p className="text-muted-foreground">You agree to:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Provide accurate, truthful, and up-to-date information during the registration process</li>
                <li>Not create multiple accounts or impersonate others</li>
                <li>Not share, transfer, sell, or provide access to your account to any other person or entity</li>
                <li>Notify us immediately at <strong className="text-foreground">theservice@gmail.com</strong> if you believe your account credentials have been compromised or if your account has been accessed without authorization</li>
              </ul>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate your account at our sole discretion if we believe you have violated these Terms or engaged in conduct that may harm other users or the Service.</p>
              <p className="text-muted-foreground">You may delete your account at any time by visiting your account settings.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">5. Acceptable Use</h3>
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
              <p className="text-muted-foreground">You are encouraged to report any violations of these Terms by contacting us at <strong className="text-foreground">theservice@gmail.com</strong>.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">6. Personal Safety & User Vetting</h3>
              <p className="text-muted-foreground">The Service does not conduct comprehensive background checks, criminal screenings, or identity verifications on all users. While we may offer optional user verification features, <strong className="text-foreground">we do not guarantee the identity, character, or intentions of any user.</strong></p>
              <p className="text-muted-foreground">You acknowledge that meeting and traveling with strangers involves inherent risks. It is your sole responsibility to exercise personal judgment, conduct your own due diligence, and take appropriate safety precautions when interacting with other users both online and in person.</p>
              <p className="text-muted-foreground"><strong className="text-foreground">You agree that the Service is not liable for any injuries, losses, damages, or harm—whether physical, emotional, or financial—resulting from your interactions with other users, whether online or in person. You use the Service and engage with other users entirely at your own risk.</strong></p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">7. Limitation of Liability</h3>
              <p className="text-muted-foreground">The Service is provided "as-is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>The behavior, actions, safety, or reliability of other users</li>
                <li>Any losses, injuries, damages, or claims arising from trip arrangements, shared accommodations, or in-person meetings facilitated through the platform</li>
                <li>Service interruptions, data loss, or security breaches beyond our reasonable control</li>
                <li>The performance, availability, accuracy, or security of any third-party services integrated with or linked from the platform</li>
                <li>Any other direct or indirect losses, damages, or claims arising from your use of the Service</li>
              </ul>
              <p className="text-muted-foreground">You agree that you are solely responsible for your interactions with other users and for any actions taken as a result of your use of the platform.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">8. Indemnification</h3>
              <p className="text-muted-foreground">To the fullest extent permitted by law, you agree to indemnify, defend, and hold harmless the Service, its officers, employees, affiliates, and agents from any claims, damages, losses, liabilities, costs, or expenses (including reasonable legal fees) arising out of:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Your use or misuse of the Service</li>
                <li>Your interactions with other users, whether online or in person</li>
                <li>Your violation of these Terms or any applicable law</li>
                <li>Any content you post or share on the platform</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">9. Dispute Resolution</h3>
              <p className="text-muted-foreground">In the event of a dispute arising from or related to these Terms or the Service:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Disputes should first be attempted to be resolved through good-faith negotiation</li>
                <li>If a resolution cannot be reached within 30 days, the dispute shall be submitted to binding arbitration in accordance with applicable rules</li>
                <li>Any claims or disputes shall be brought individually, not as part of a class action or representative proceeding</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">10. Intellectual Property</h3>
              <p className="text-muted-foreground">All content, branding, and code on the Service, including but not limited to the design, layout, text, images, and software, are owned by us or our licensors and are protected by intellectual property laws.</p>
              <p className="text-muted-foreground">You retain ownership of content you post on the Service but grant us a non-exclusive, worldwide, royalty-free license to display, use, and distribute such content solely in connection with the Service.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">11. Privacy</h3>
              <p className="text-muted-foreground">Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal data. By using the Service, you consent to the collection and use of your information as outlined in the Privacy Policy.</p>
              <p className="text-muted-foreground">If you are a resident of the European Union, the General Data Protection Regulation (GDPR) applies to your personal data.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">12. Termination</h3>
              <p className="text-muted-foreground">We reserve the right to suspend or terminate any accounts that violate these Terms or engage in harmful conduct. You may terminate your account at any time by visiting your account settings.</p>
              <p className="text-muted-foreground">Upon termination, your account and any related data will be deleted in accordance with our Privacy Policy, except where we are required by law to retain data for longer periods.</p>
            </section>

            <section className="space-y-2">
              <h3 className="font-display text-foreground text-base">13. Changes to Terms</h3>
              <p className="text-muted-foreground">We may update these Terms from time to time. You will be notified of material changes either via email or through a notification within the Service. Continued use of the Service after any such changes will constitute your acceptance of the updated Terms.</p>
              <p className="text-muted-foreground">If you do not agree to the revised Terms, you must stop using the Service.</p>
            </section>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Questions? Contact us at <strong className="text-foreground">theservice@gmail.com</strong></p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-border space-y-3">
          {!scrolledToBottom && (
            <p className="text-xs text-muted-foreground text-center font-body">
              ↓ Please scroll to the bottom to enable the Accept button
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 font-body" onClick={onDecline}>
              Decline
            </Button>
            <Button
              variant="hero"
              className="flex-1 font-body"
              onClick={onAccept}
              disabled={!scrolledToBottom}
            >
              I Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TOSModal;
