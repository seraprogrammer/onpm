export default function e(e, o) {
  const t = e.getCurrentInstance(),
    s = t.currentHook++;
  return (
    t.hooks[s] ||
      (t.hooks[s] = {
        value: o,
        setValue: (o) => {
          const n = "function" == typeof o ? o(t.hooks[s].value) : o;
          n !== t.hooks[s].value &&
            ((t.hooks[s].value = n),
            (e.dirtyInstances = e.dirtyInstances || new Set()),
            e.dirtyInstances.add(t),
            e.scheduleUpdate());
        },
      }),
    [t.hooks[s].value, t.hooks[s].setValue]
  );
}
