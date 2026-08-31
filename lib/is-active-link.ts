// `trailingSlash: true` (needed for the static export) makes usePathname return
// "/work/", while the nav hrefs are written "/work". Compare both without the
// trailing slash so the active state survives that mismatch.
function withoutTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function isActiveLink(pathname: string, href: string): boolean {
  return withoutTrailingSlash(pathname) === withoutTrailingSlash(href);
}
