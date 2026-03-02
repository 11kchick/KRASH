import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { US_LOCATIONS } from "@/lib/us-locations";

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const DestinationAutocomplete = ({ value, onChange }: DestinationAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const query = value.toLowerCase();
      const filtered = US_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(query)
      ).slice(0, 8);
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="e.g. Colorado, Austin TX, Miami..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length > 0 && suggestions.length > 0 && setOpen(true)}
        className="h-12 text-base"
        maxLength={200}
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg overflow-hidden">
          {suggestions.map((loc) => (
            <button
              key={loc}
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-accent transition-colors"
              onClick={() => {
                onChange(loc);
                setOpen(false);
              }}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationAutocomplete;
