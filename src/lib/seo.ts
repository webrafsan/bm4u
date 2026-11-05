export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bm4u.net').replace(/\/$/, '');
export const SITE_NAME = 'BM 4 U';
export const SITE_LOGO = '/logo.png';

// Generated social card (src/app/og/route.tsx). Pass exactly one of page / product / post.
export function ogImage(target: { page?: string; product?: string; post?: string } = {}) {
  const [key, value] = Object.entries(target).find(([, v]) => v) ?? ['page', 'default'];
  return `/og?${key}=${encodeURIComponent(value as string)}`;
}
export const SITE_DESCRIPTION =
  'Buy high-limit Facebook Business Managers, BM2500, Reinstated 2-line & 3-line accounts, TikTok manual payment accounts with 24H guarantee and instant delivery.';

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Trim to a length that search engines display without cutting mid-word.
export function truncate(text: string, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

// A page's openGraph/twitter replaces the layout's wholesale (no deep merge), so every page
// that sets its own must carry the full set or it loses og:image, site_name and the twitter title.
export function pageSocial({ title, description, path, image }: { title: string; description: string; path: string; image?: string }) {
  const img = image || ogImage();
  return {
    openGraph: {
      type: 'website' as const,
      siteName: SITE_NAME,
      locale: 'en_US',
      title,
      description,
      url: path,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [img],
    },
  };
}

// Post dates are stored as display strings ("September 15, 2026"). Read them as UTC so the ISO
// value does not drift a day with the server's timezone.
export function toIsoDate(value?: string) {
  if (!value) return undefined;
  const d = new Date(/\d{4}-\d{2}-\d{2}T/.test(value) ? value : `${value} UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
