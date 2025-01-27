export default function o(o, t) {
  const n = o.getCurrentInstance(),
    r = n.currentHook++;
  return n.hooks[r] || (n.hooks[r] = { current: t }), n.hooks[r];
}
