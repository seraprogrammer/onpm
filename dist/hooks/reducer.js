export default function o(o, e, t) {
  const n = o.getCurrentInstance(),
    s = n.currentHook++;
  n.hooks[s] = n.hooks[s] || t;
  return [
    n.hooks[s],
    (t) => {
      (n.hooks[s] = e(n.hooks[s], t)), o.scheduleUpdate();
    },
  ];
}
