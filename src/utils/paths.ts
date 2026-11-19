export const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function withBase(path: string = ''): string {
  if (!path || path === '/') return `${base}/`;
  if (path.startsWith('#')) return `${base}/${path}`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
