/** Full path including Vite base (e.g. /worker) for navigations outside React Router. */
export function appPath(path) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
