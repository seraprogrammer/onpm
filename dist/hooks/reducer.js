export function createReducerHook(t) {
  return function (s, e, o) {
    const n = t.getCurrentInstance(),
      c = n.currentHook++;
    if (!n.hooks[c]) {
      const a = o ? o(e) : e;
      n.hooks[c] = {
        state: a,
        dispatch: (e) => {
          const o = s(n.hooks[c].state, e);
          o !== n.hooks[c].state &&
            ((n.hooks[c].state = o),
            t.dirtyInstances || (t.dirtyInstances = new Set()),
            t.dirtyInstances.add(n),
            t.scheduleUpdate());
        },
      };
    }
    return [n.hooks[c].state, n.hooks[c].dispatch];
  };
}
