export function createMemoHook(o) {
  return function (n, t) {
    const e = o.getCurrentInstance(),
      r = e.currentHook++,
      [u, c] = e.hooks[r] || [void 0, void 0];
    if (
      !c ||
      !t ||
      t.length !== c.length ||
      t.some((n, t) => !o.shallowEqual(n, c[t]))
    ) {
      const o = n();
      return (e.hooks[r] = [o, t]), o;
    }
    return u;
  };
}
