// Next.js/Vercel has no Cloudflare Worker bindings or Sites identity gateway.
// Keep storage absent so existing API guards fail closed instead of losing data.
export const env: Cloudflare.Env = {};
export const trustedSitesIdentity = false;
