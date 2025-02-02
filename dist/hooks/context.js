export function createContextHook(e) {
  return function (n) {
    const s = e.getCurrentInstance(),
      t = s.currentHook++;
    if (!s.hooks[t]) {
      s.hooks[t] = n._currentValue;
      const e = { instance: s, hookIndex: t, version: n._version };
      n.subscribers.set(s, e),
        s.contextSubscriptions.add(() => {
          n.subscribers.delete(s);
        });
    }
    const r = n.subscribers.get(s);
    return (
      r &&
        r.version !== n._version &&
        ((s.hooks[t] = n._currentValue),
        (r.version = n._version),
        (e.dirtyInstances = e.dirtyInstances || new Set()),
        e.dirtyInstances.add(s),
        e.scheduleUpdate()),
      n._currentValue
    );
  };
}
