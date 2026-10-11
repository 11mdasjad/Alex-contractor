declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_USER_IDS?: string;
    ENQUIRY_EMAIL_TO?: string;
    EMAIL_FROM?: string;
    RESEND_API_KEY?: string;
  }
}
