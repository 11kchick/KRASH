// Content moderation filter for group chat messages
// Blocks offensive, sexual, unsafe content and sensitive personal info

const SENSITIVE_INFO_PATTERNS = [
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, // SSN
  /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/, // Credit card
  /\b\d{9,18}\b/, // Bank account numbers
  /\brouting\s*#?\s*\d{9}\b/i, // Routing numbers
  /\bpassword\s*[:=]\s*\S+/i, // Passwords shared
];

// Offensive / hate speech terms
const OFFENSIVE_WORDS = [
  "nigger", "nigga", "faggot", "fag", "retard", "retarded",
  "kike", "spic", "wetback", "chink", "gook", "towelhead",
  "tranny", "cunt", "dyke",
];

// Sexual content terms
const SEXUAL_WORDS = [
  "porn", "pornography", "hentai", "xxx", "nude", "nudes",
  "blowjob", "handjob", "dick pic", "dickpic", "pussy",
  "cock", "dildo", "orgasm", "masturbat", "anal sex",
  "oral sex", "threesome", "gangbang", "bukakke",
  "onlyfans", "sexting", "horny",
];

// Threats / unsafe
const UNSAFE_WORDS = [
  "kill yourself", "kys", "kill you", "bomb threat",
  "shoot up", "school shooting", "i'll hurt you",
  "rape", "molest", "stalk", "stalking",
  "suicide", "self harm", "cut yourself",
];

export type ViolationType = "sensitive_info" | "offensive" | "sexual" | "unsafe";

export interface FilterResult {
  blocked: boolean;
  reason?: ViolationType;
  message?: string;
}

function containsPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function containsWord(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

export function filterMessage(content: string): FilterResult {
  if (containsPattern(content, SENSITIVE_INFO_PATTERNS)) {
    return {
      blocked: true,
      reason: "sensitive_info",
      message: "Your message appears to contain sensitive personal information (SSN, bank details, passwords). Please do not share this in the group chat.",
    };
  }

  if (containsWord(content, OFFENSIVE_WORDS)) {
    return {
      blocked: true,
      reason: "offensive",
      message: "Your message contains offensive or hateful language and cannot be sent. Repeated violations will result in a temporary or permanent chat restriction.",
    };
  }

  if (containsWord(content, SEXUAL_WORDS)) {
    return {
      blocked: true,
      reason: "sexual",
      message: "Your message contains sexual content and cannot be sent. Repeated violations will result in a temporary or permanent chat restriction.",
    };
  }

  if (containsWord(content, UNSAFE_WORDS)) {
    return {
      blocked: true,
      reason: "unsafe",
      message: "Your message contains threatening or unsafe language and cannot be sent. Repeated violations will result in a temporary or permanent chat restriction.",
    };
  }

  return { blocked: false };
}

// Violation thresholds
export const TEMP_BAN_THRESHOLD = 3; // 3 violations → 24h temp ban
export const PERM_BAN_THRESHOLD = 7; // 7 violations → permanent ban
export const TEMP_BAN_HOURS = 24;
