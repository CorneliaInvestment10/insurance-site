// middleware.js
// Place this at the ROOT of your GitHub repo (same level as index.html).
// Vercel auto-detects and runs it on every request — no extra config needed.

export const config = {
  matcher:
    '/((?!splash\\.html|middleware\\.js|api|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|webp|json)$).*)',
};

function isBot(userAgent) {
  return /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|googlebot|ahrefs|semrush/i.test(
    userAgent || ''
  );
}

function hasSeenSplash(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .some((c) => c.startsWith('splash_seen='));
}

export default function middleware(request) {
  const url = new URL(request.url);

  // Only intercept normal page loads — leave form posts, API calls, etc. alone.
  if (request.method !== 'GET') return;

  // Never interstitial search engine crawlers or social preview bots —
  // this protects SEO indexing and link-preview cards.
  if (isBot(request.headers.get('user-agent'))) return;

  // Already seen it this browser session — let them through.
  if (hasSeenSplash(request)) return;

  // Send them to the splash, remembering where they were actually headed.
  const splashUrl = new URL('/splash.html', request.url);
  splashUrl.searchParams.set('to', url.pathname + url.search);

  // Built manually (not Response.redirect()) because Response.redirect()
  // returns a Response with IMMUTABLE headers per the Fetch spec — trying
  // to append Set-Cookie to it throws and crashes the function. Building
  // the Response directly with the Location header avoids that entirely.
  return new Response(null, {
    status: 307,
    headers: {
      Location: splashUrl.toString(),
      // No Max-Age/Expires = a true session cookie. It clears itself when
      // the browser closes, so the splash shows again next session rather
      // than being suppressed for a fixed period.
      'Set-Cookie': 'splash_seen=1; Path=/; SameSite=Lax',
    },
  });
}
