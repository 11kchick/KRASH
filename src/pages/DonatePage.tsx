import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, DollarSign, Users, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FundingRequest {
  id: string;
  traveler: string;
  destination: string;
  amount: number;
  tripDate: string;
  reason: string;
}

const requests: FundingRequest[] = [
  { id: "1", traveler: "James R.", destination: "Colorado", amount: 210, tripDate: "Mar 15, 2026", reason: "Business trip — only staying 1 week but matched with 3-week group" },
  { id: "2", traveler: "Priya K.", destination: "Austin, TX", amount: 150, tripDate: "Apr 2, 2026", reason: "Student traveler, first time using TripLink" },
  { id: "3", traveler: "Carlos M.", destination: "Miami, FL", amount: 180, tripDate: "Mar 28, 2026", reason: "Recently laid off, trip was already planned with friends" },
];

const DonatePage = () => {
  const { toast } = useToast();
  const [donateAmount, setDonateAmount] = useState("");
  const [funded, setFunded] = useState<string[]>([]);

  const handleFund = (req: FundingRequest) => {
    setFunded([...funded, req.id]);
    toast({
      title: `You funded ${req.traveler}'s trip!`,
      description: `$${req.amount} will cover their remaining portion.`,
    });
  };

  const handleGeneralDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateAmount) return;
    toast({ title: "Thank you!", description: `Your $${donateAmount} donation helps travelers in need.` });
    setDonateAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral mb-4">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium font-body">Donor Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Help a Traveler Out
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Fund a specific request or make a general donation to the TripLink community pool. 
            Every dollar helps someone experience something new.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl text-foreground mb-2">Open Requests</h2>
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`bg-card rounded-xl shadow-card p-6 transition-all ${
                  funded.includes(req.id) ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <h3 className="font-display text-foreground">{req.traveler}</h3>
                      <span className="text-xs text-muted-foreground font-body">→ {req.destination}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body mb-2">{req.reason}</p>
                    <p className="text-xs text-muted-foreground font-body">Trip starts: {req.tripDate}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-display text-primary">${req.amount}</p>
                    <p className="text-xs text-muted-foreground font-body mb-2">needed</p>
                    {funded.includes(req.id) ? (
                      <div className="flex items-center gap-1 text-secondary text-sm">
                        <Check className="w-4 h-4" /> Funded
                      </div>
                    ) : (
                      <Button variant="teal" size="sm" onClick={() => handleFund(req)}>
                        Fund This
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl shadow-elevated p-6 sticky top-24"
            >
              <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                General Donation
              </h2>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Contribute to the community pool. Funds go to travelers who need help.
              </p>
              <form onSubmit={handleGeneralDonate} className="space-y-4">
                <div>
                  <Label className="font-body text-sm">Amount ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="50"
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateAmount(String(amt))}
                      className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-body"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <Button variant="hero" className="w-full" size="lg" type="submit">
                  Donate <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
