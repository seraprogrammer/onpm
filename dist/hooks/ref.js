export function createRefHook(o) {
  return function (n) {
    const r = o.getCurrentInstance(),
      t = r.currentHook++;
    return r.hooks[t] || (r.hooks[t] = { current: n }), r.hooks[t];
  };
}
