export function createStateHook(e) {
  return function (t) {
    const o = e.getCurrentInstance(),
      n = o.currentHook++;
    return (
      o.hooks[n] ||
        (o.hooks[n] = {
          value: t,
          setValue: (t) => {
            const s = "function" == typeof t ? t(o.hooks[n].value) : t;
            s !== o.hooks[n].value &&
              ((o.hooks[n].value = s),
              e.dirtyInstances || (e.dirtyInstances = new Set()),
              e.dirtyInstances.add(o),
              e.scheduleUpdate());
          },
        }),
      [() => o.hooks[n].value, o.hooks[n].setValue]
    );
  };
}
