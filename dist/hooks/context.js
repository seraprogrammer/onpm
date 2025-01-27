export default function e(e, r) {
  const n = e.getCurrentInstance(),
    o = n.currentHook++;
  if (!n.hooks[o]) {
    n.hooks[o] = r._currentValue;
    const e = { instance: n, hookIndex: o, version: r._version };
    r._subscribers.add(e),
      n.contextSubscriptions.add(() => {
        r._subscribers.delete(e);
      });
  }
  const s = Array.from(r._subscribers).find(
    (e) => e.instance === n && e.hookIndex === o
  );
  return (
    s &&
      s.version !== r._version &&
      ((n.hooks[o] = r._currentValue), (s.version = r._version)),
    r._currentValue
  );
}
