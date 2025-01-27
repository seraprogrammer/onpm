export default function o(o, t, n) {
  const e = o.getCurrentInstance(),
    r = e.currentHook++,
    [s, u] = e.hooks[r] || [void 0, void 0];
  if (
    !u ||
    !n ||
    n.length !== u.length ||
    n.some((t, n) => !o.shallowEqual(t, u[n]))
  ) {
    const o = t();
    return (e.hooks[r] = [o, n]), o;
  }
  return s;
}
