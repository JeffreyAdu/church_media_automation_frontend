/**
 * Maps raw backend / Supabase error messages to user-friendly text.
 */

const fieldLabels: Record<string, string> = {
  name: "Channel Name",
  youtube_channel_url: "YouTube Channel URL",
  rss_slug: "RSS Slug",
  podcast_title: "Podcast Title",
  podcast_description: "Podcast Description",
  podcast_author: "Podcast Author",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  firstName: "First Name",
  lastName: "Last Name",
  organizationName: "Organization Name",
};

function friendlyFieldName(raw: string): string {
  const key = raw.replace(/^,?\s*/, "").trim();
  return fieldLabels[key] || key;
}

function friendlyValidationMessage(message: string): string {
  if (/expected string, received undefined/i.test(message))
    return "is required";
  if (/expected string, received/i.test(message)) return "must be text";
  if (/expected number, received/i.test(message)) return "must be a number";
  if (/invalid url/i.test(message)) return "must be a valid URL";
  if (/string must contain at least (\d+)/i.test(message)) {
    const min = message.match(/at least (\d+)/)?.[1];
    return `must be at least ${min} characters`;
  }
  if (/too_small/i.test(message)) return "is required";
  if (/too_big/i.test(message)) return "is too long";
  if (/invalid_type/i.test(message)) return "is required";
  return message;
}

/**
 * Takes a raw detail string like "rss_slug: Invalid input: expected string, received undefined"
 * and returns a user-friendly version like "RSS Slug is required"
 */
export function formatErrorDetail(raw: string): string {
  const colonIdx = raw.indexOf(":");
  if (colonIdx === -1) return raw;

  const field = raw.slice(0, colonIdx).trim();
  const message = raw.slice(colonIdx + 1).trim();

  return `${friendlyFieldName(field)} ${friendlyValidationMessage(message)}`;
}

/**
 * Maps common backend / HTTP error messages to user-friendly text.
 */
const errorMessageMap: [RegExp, string][] = [
  [/validation failed/i, "Please fix the errors below and try again"],
  [
    /duplicate.*rss_slug/i,
    "A channel with this name already exists. Try a different name",
  ],
  [/duplicate.*youtube_channel/i, "This YouTube channel is already connected"],
  [/not found/i, "The requested resource could not be found"],
  [
    /unauthorized|invalid.*token/i,
    "Your session has expired. Please sign in again",
  ],
  [/forbidden/i, "You don't have permission to perform this action"],
  [
    /network error/i,
    "Unable to connect to the server. Check your internet connection",
  ],
  [/timeout/i, "The request timed out. Please try again"],
  [
    /internal server error|500/i,
    "Something went wrong on our end. Please try again later",
  ],
  [/rate limit/i, "Too many requests. Please wait a moment and try again"],
  [
    /invalid login credentials/i,
    "Incorrect email or password. Please try again",
  ],
  [
    /user already registered/i,
    "An account with this email already exists. Try signing in instead",
  ],
  [
    /email not confirmed/i,
    "Please check your email and confirm your account before signing in",
  ],
  [/invalid email/i, "Please enter a valid email address"],
  [
    /password.*too short|at least 6/i,
    "Password must be at least 6 characters long",
  ],
  [
    /signup.*disabled/i,
    "Sign-ups are temporarily disabled. Please try again later",
  ],
];

export function formatErrorMessage(raw: string): string {
  for (const [pattern, friendly] of errorMessageMap) {
    if (pattern.test(raw)) return friendly;
  }
  return raw;
}

/**
 * Extracts a user-friendly error object from an API/auth error.
 */
export function parseApiError(error: unknown): {
  message: string;
  details?: string[];
} {
  const err = error as Record<string, unknown>;
  const response = err?.response as Record<string, unknown> | undefined;
  const data = response?.data as Record<string, unknown> | undefined;

  const rawMessage =
    (data?.error as string) ||
    (data?.message as string) ||
    (err instanceof Error ? err.message : null) ||
    "Something went wrong. Please try again.";

  const rawDetails = Array.isArray(data?.details)
    ? (data.details as { path: string; message: string }[]).map(
        (d) => `${d.path}: ${d.message}`,
      )
    : undefined;

  return {
    message: formatErrorMessage(rawMessage),
    details: rawDetails?.map(formatErrorDetail),
  };
}
