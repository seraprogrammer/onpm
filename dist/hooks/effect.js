export default function e(e, n, t) {
  const o = e.getCurrentInstance(),
    s = o.currentHook++,
    c = o.hooks[s];
  (!c || !t || t.length !== c.length || t.some((e, n) => e !== c[n])) &&
    o.pendingEffects.push(() => {
      o.cleanups.has(s) && o.cleanups.get(s)();
      const e = n();
      (o.hooks[s] = t), "function" == typeof e && o.cleanups.set(s, e);
    });
}
