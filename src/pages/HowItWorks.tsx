import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Handshake, Heart, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: MapPin,
    title: "1. Post Your Destination",
    description: "Simply tell us where you're heading. That's the anchor for your match. Whether it's Colorado for a museum trip or Miami for a beach break.",
  },
  {
    icon: Users,
    title: "2. Set Your Group Size",
    description: "Traveling alone? With a partner? A group of friends? Let us know how many people are in your party.",
  },
  {
    icon: Calendar,
    title: "3. Choose Your Stay Length",
    description: "How many weeks will you be there? The longest stay sets the booking window. Others can leave early or stay the full duration.",
  },
  {
    icon: Handshake,
    title: "4. Get Matched",
    description: "We connect you with other travelers heading to the same place. Strangers become travel companions — sharing space and splitting costs.",
  },
  {
    icon: DollarSign,
    title: "5. Split Costs Evenly",
    description: "The total accommodation cost is divided by everyone in the group. For example: $2,600 ÷ 6 travelers = ~$433 each. Fair and transparent.",
  },
  {
    icon: Heart,
    title: "6. Request Donor Support",
    description: "Can't afford your full share? Request help from our donor community. Requests must be accepted 3 days before the stay. If no one picks it up, you agree to cover your part.",
  },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">How JourneyNexus Works</h1>
        <p className="text-muted-foreground font-body text-lg">
          From posting to matching to paying — here's the full breakdown.
        </p>
      </motion.div>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl shadow-card p-6 flex gap-5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">{step.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-card rounded-2xl shadow-elevated p-8 text-center"
      >
        <Shield className="w-10 h-10 text-secondary mx-auto mb-4" />
        <h3 className="font-display text-xl text-foreground mb-2">The 3-Day Rule</h3>
        <p className="text-muted-foreground font-body max-w-xl mx-auto mb-6">
          If you request donor support, it must be accepted at least 3 days before your trip starts. 
          By submitting a request, you consent to covering your share if no donor steps in. 
          This keeps things fair for everyone.
        </p>
        <Link to="/post">
          <Button variant="hero" size="lg">Get Started</Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

export default HowItWorks;
