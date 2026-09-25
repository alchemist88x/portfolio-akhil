export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;
    if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object") {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(" ");
}

/**
 * Validates and sanitizes URLs to ensure they only use safe protocols (https, http, mailto).
 * Explicitly rejects javascript:, data:, vbscript:, etc.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();

  // Allow mailto
  if (trimmed.startsWith("mailto:")) {
    return trimmed;
  }

  // Reject dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.includes("<") ||
    lower.includes(">")
  ) {
    return "#";
  }

  // Allow safe protocols or relative anchors
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("/")) {
    return trimmed;
  }

  // If provided as a domain without protocol (e.g. github.com/user)
  if (!trimmed.includes("://") && (trimmed.includes(".com") || trimmed.includes(".io") || trimmed.includes(".dev") || trimmed.includes(".in"))) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString?: string | Date | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
