import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Users, Calendar, ArrowRight, Handshake, MessageSquare } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Travelers meeting at sunset" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display leading-tight text-white mb-6">
          Break Routine.{" "}
          <span className="text-gradient">Build Memories.</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 font-body mb-8 leading-relaxed">
          Connect with strangers heading to the same destination. Share accommodations, 
          split costs evenly, and make every trip affordable and unforgettable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/post">
            <Button variant="hero" size="xl">
              Post Your Trip <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="warm" size="xl">
              Browse Trips
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const steps = [
  {
    icon: MapPin,
    title: "Post Your Destination",
    description: "Tell us where you're going — that's the starting point for your match.",
  },
  {
    icon: Users,
    title: "How Many People?",
    description: "Whether you're solo or a group of 5, let us know your party size.",
  },
  {
    icon: Calendar,
    title: "How Long?",
    description: "Set your stay length. We'll match you with overlapping travelers.",
  },
  {
    icon: Handshake,
    title: "Get Matched & Split",
    description: "We group you together and split the total cost evenly. Simple.",
  },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-gradient-warm" aria-label="How it works">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-4">
          How KRASH Works
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
          Three simple inputs. One powerful connection.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center mb-4 group-hover:bg-accent/25 transition-colors" aria-hidden="true">
              <step.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="absolute top-4 right-4 text-5xl font-display text-accent/40" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="text-lg font-display text-foreground mb-2">{step.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeedbackSection = () => (
  <section className="py-24 bg-background" aria-label="Community feedback">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground mb-4">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium font-body">Community Driven</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-4">
            Your Voice Shapes KRASH
          </h2>
          <p className="text-muted-foreground text-lg font-body mb-6 leading-relaxed">
            Have a question, concern, or a brilliant idea? We're building this platform 
            together. Share your feedback and help us make travel better for everyone.
          </p>
          <Link to="/feedback">
            <Button variant="hero" size="lg">
              <MessageSquare className="w-4 h-4" /> Share Feedback
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {[
            { icon: MessageSquare, title: "Ask Questions", desc: "Curious about how something works? We're here to help." },
            { icon: MapPin, title: "Suggest Features", desc: "Have an idea that would make your travel experience better? Tell us." },
            { icon: Users, title: "Report Concerns", desc: "Safety is our priority. Flag anything that doesn't feel right." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl bg-card shadow-card">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-display text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const ExampleSection = () => (
  <section className="py-24 bg-muted/50" aria-label="Example trip">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-4">
          See It In Action
        </h2>
        <p className="text-muted-foreground text-lg font-body max-w-2xl mx-auto">
          Here's how a real trip match might work.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-card rounded-2xl shadow-elevated p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-display text-xl text-foreground">Colorado — 3 Week Stay — $2,600 Total</h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { group: "Couple from Michigan", people: 2, weeks: 3, note: "Want extra space" },
            { group: "Friend Group", people: 3, weeks: 2, note: "Exploring & adventure" },
            { group: "Business Traveler", people: 1, weeks: 1, note: "Budget-conscious" },
          ].map((g, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="font-display text-foreground text-sm mb-2">{g.group}</p>
              <div className="space-y-1 text-xs text-muted-foreground font-body">
                <p><Users className="w-3 h-3 inline mr-1" />{g.people} {g.people === 1 ? "person" : "people"}</p>
                <p><Calendar className="w-3 h-3 inline mr-1" />{g.weeks} {g.weeks === 1 ? "week" : "weeks"}</p>
                <p className="italic">{g.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-display text-foreground">Cost Per Person</p>
              <p className="text-2xl font-display text-accent-foreground" style={{ color: 'hsl(var(--amber))' }}>~$433</p>
            </div>
            <div className="text-right text-sm text-muted-foreground font-body">
              <p>6 travelers matched</p>
              <p>$2,600 ÷ 6 people</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 bg-gradient-hero" aria-label="Call to action">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-display text-white mb-4">
          Your Next Adventure Starts Here
        </h2>
        <p className="text-white/80 text-lg font-body mb-8">
          Post your trip, find your match, and travel for less.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/post">
            <Button variant="warm" size="xl">Post Your Trip</Button>
          </Link>
          <Link to="/browse">
            <Button variant="warm" size="xl">Find a Match</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-foreground" role="contentinfo">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center" aria-hidden="true">
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg text-background">KRASH</span>
        </div>
        <nav aria-label="Footer navigation" className="flex items-center gap-4 text-sm font-body flex-wrap justify-center">
          <Link to="/privacy" className="text-background/50 hover:text-background transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-background/50 hover:text-background transition-colors">Terms of Service</Link>
          <Link to="/privacy#your-choices" className="text-background/50 hover:text-background transition-colors">Do Not Sell My Info</Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("krash-open-cookie-settings"))}
            className="text-background/50 hover:text-background transition-colors"
          >
            Manage Cookies
          </button>
        </nav>
        <p className="text-background/50 text-sm font-body">
          © 2026 KRASH. Break routine. Build memories.
        </p>
      </div>
    </div>
  </footer>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <ExampleSection />
      <FeedbackSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
