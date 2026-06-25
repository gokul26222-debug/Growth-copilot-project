export const BENCHMARKS = {
  activation_rate: 40,
  conversion_rate: 15,
  retention_rate: 80,
  churn_rate: 5,
  growth_rate: 10,
} as const;

export const SCORE_WEIGHTS = {
  activation_rate: 0.30,
  conversion_rate: 0.25,
  retention_rate: 0.25,
  churn_rate: 0.20,
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  MAX_ROWS: 10_000,
  MIN_ROWS: 2,
  ALLOWED_EXTENSIONS: ['.csv'],
} as const;

export const REQUIRED_COLUMNS = [
  'date', 'users', 'signups', 'activated_users',
  'paid_users', 'retained_users', 'cancelled_users',
] as const;

export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 10,
  ANALYSES_PER_HOUR: 5,
  ANALYSES_PER_DAY: 20,
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID: 'Email or password is incorrect. Try again or reset your password.',
  AUTH_EMAIL_TAKEN: 'This email is already registered. Try logging in instead.',
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  UPLOAD_TOO_LARGE: 'This file is over 5MB. Try a shorter date range.',
  UPLOAD_WRONG_TYPE: 'Please upload a .csv file.',
  UPLOAD_EMPTY: 'This file is empty. Check your export.',
  UPLOAD_MISSING_COLUMNS: 'Missing required columns.',
  UPLOAD_MIN_ROWS: 'Need at least 2 rows of data.',
  UPLOAD_MAX_ROWS: 'File exceeds 10,000 row limit.',
  AI_UNAVAILABLE: 'Our AI is temporarily unavailable. Try again in a minute.',
  AI_TIMEOUT: 'Analysis took too long. Please try again.',
  AI_RATE_LIMITED: 'Analysis limit reached. Please wait.',
  NETWORK_ERROR: 'Connection problem. Check your internet.',
  NOT_FOUND: 'Analysis not found. It may have been deleted.',
  RATE_LIMITED: 'Too many requests. Please wait.',
};
