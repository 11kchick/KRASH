import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface Trip {
  id: string;
  destination: string;
  people: number;
  weeks: number;
  postedBy: string;
  matchedCount: number;
  totalCost: number;
  postedAgo: string;
}

const sampleTrips: Trip[] = [
  { id: "1", destination: "Colorado", people: 2, weeks: 3, postedBy: "Sarah & Mike", matchedCount: 4, totalCost: 2600, postedAgo: "2 hours ago" },
  { id: "2", destination: "Austin, TX", people: 1, weeks: 1, postedBy: "James", matchedCount: 2, totalCost: 900, postedAgo: "5 hours ago" },
  { id: "3", destination: "Miami, FL", people: 3, weeks: 2, postedBy: "The Adventurers", matchedCount: 5, totalCost: 3200, postedAgo: "1 day ago" },
  { id: "4", destination: "Portland, OR", people: 1, weeks: 2, postedBy: "Nomad Nina", matchedCount: 1, totalCost: 1400, postedAgo: "1 day ago" },
  { id: "5", destination: "Nashville, TN", people: 4, weeks: 1, postedBy: "Music Lovers", matchedCount: 6, totalCost: 1800, postedAgo: "3 days ago" },
  { id: "6", destination: "San Diego, CA", people: 2, weeks: 3, postedBy: "Coastal Duo", matchedCount: 3, totalCost: 2800, postedAgo: "4 days ago" },
];

const TripCard = ({ trip }: { trip: Trip }) => {
  const totalPeople = trip.people + trip.matchedCount;
  const costPerPerson = Math.round(trip.totalCost / totalPeople);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-display text-lg text-foreground">{trip.destination}</h3>
            </div>
            <p className="text-xs text-muted-foreground font-body">Posted by {trip.postedBy} · {trip.postedAgo}</p>
          </div>
          <div className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium font-body">
            {totalPeople} matched
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground">{trip.people}</p>
            <p className="text-xs text-muted-foreground">people</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground">{trip.weeks}</p>
            <p className="text-xs text-muted-foreground">{trip.weeks === 1 ? "week" : "weeks"}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <p className="text-sm font-semibold text-primary">${costPerPerson}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
        </div>

        <Button variant="teal" className="w-full" size="sm">
          Join This Trip <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const BrowseTrips = () => {
  const [search, setSearch] = useState("");
  const filtered = sampleTrips.filter((t) =>
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Browse Trips
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-6">
            Find travelers heading your way and join them.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body text-lg">No trips found for that destination.</p>
            <Link to="/post">
              <Button variant="hero" size="lg" className="mt-4">
                Post Your Own Trip
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseTrips;
