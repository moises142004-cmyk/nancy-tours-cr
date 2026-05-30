// api/sitemap.xml.js
// Vercel Serverless Function — Supabase-driven sitemap.
// Cached by Vercel's CDN for 1 hour; Supabase is hit at most once/hour
// regardless of crawl frequency. Falls back to static-only sitemap if the
// Supabase fetch fails (we'd rather emit something than 500 the crawler).

const SUPABASE_URL = 'https://bxafkbnfdgoqofdwccpo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';
const SITE = 'https://nancytourscr.com';

const STATIC = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/tours', priority: '0.9', changefreq: 'weekly' },
  { loc: '/sobre-nancy', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contacto', priority: '0.8', changefreq: 'monthly' },
];

function escapeXml(s) {
  return String(s ?? '').replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[c]);
}

function absImg(s) {
  if (!s) return null;
  if (/^https?:/i.test(s)) return s;
  return SITE + '/' + String(s).replace(/^\//, '');
}

module.exports = async (req, res) => {
  // Fetch tours via PostgREST. Bail gracefully on error — still emit static URLs.
  let tours = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/tours_with_counts?select=slug,title,hero,updated_at,state&state=neq.completed&order=tentative_date.asc.nullslast`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'nancy_tours',
        },
      }
    );
    if (r.ok) tours = await r.json();
  } catch (e) {
    // Log but continue with static-only sitemap.
    console.error('[sitemap] supabase fetch failed:', e);
  }

  const today = new Date().toISOString().slice(0, 10);

  const urls = [];

  STATIC.forEach((s) => {
    urls.push(
      `  <url>\n` +
      `    <loc>${SITE}${s.loc}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${s.changefreq}</changefreq>\n` +
      `    <priority>${s.priority}</priority>\n` +
      `  </url>`
    );
  });

  tours.forEach((t) => {
    const lastmod = t.updated_at ? String(t.updated_at).slice(0, 10) : today;
    const imageBlock = absImg(t.hero)
      ? `\n    <image:image><image:loc>${escapeXml(absImg(t.hero))}</image:loc></image:image>`
      : '';
    urls.push(
      `  <url>\n` +
      `    <loc>${SITE}/tours/${escapeXml(t.slug)}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>0.8</priority>${imageBlock}\n` +
      `  </url>`
    );
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls.join('\n') + '\n' +
    `</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
};
