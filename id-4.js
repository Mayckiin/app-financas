export function uid(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
