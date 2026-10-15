// Images live in S3 behind CloudFront in production (PUBLIC_MEDIA_BASE),
// and in public/uploads during local development.
const base = (import.meta.env.PUBLIC_MEDIA_BASE ?? '').replace(/\/$/, '');

/** '/uploads/2026/06/x.jpg' -> full URL on the media host */
export const media = (path: string) => (path.startsWith('http') ? path : `${base}${path}`);

export const logo = media('/uploads/2023/03/AFHC_Golf_Classic_Graphic-e1679325016816.png');
