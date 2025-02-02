export function createEffectHook(n) {
  return function (e, t) {
    const o = n.getCurrentInstance(),
      u = o.currentHook++;
    o.hooks[u] ||
      (o.hooks[u] = { deps: null, cleanup: null, effect: e, lastRun: 0 });
    const c = o.hooks[u];
    (t
      ? c.deps &&
        n.areArraysEqual(
          t.map((n) => ("function" == typeof n ? n() : n)),
          c.deps
        )
      : 0 !== c.lastRun) ||
      ("function" == typeof c.cleanup && c.cleanup(),
      (c.cleanup = e()),
      (c.deps = t?.map((n) => ("function" == typeof n ? n() : n))),
      (c.lastRun = Date.now()));
  };
}
