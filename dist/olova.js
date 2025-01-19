const memoize = (e) => {
  const t = new Map();
  return (...n) => {
    const r = JSON.stringify(n);
    return t.has(r) || t.set(r, e(...n)), t.get(r);
  };
};
let currentObserver = null;
function diffProps(e = {}, t = {}, n) {
  void 0 !== t.className && ((t.class = t.className), delete t.className),
    void 0 !== e.className && ((e.class = e.className), delete e.className);
  for (const [r, o] of Object.entries(e))
    r in t ||
      (r.startsWith("on")
        ? n.removeEventListener(r.slice(2).toLowerCase(), o)
        : "style" === r
        ? (n.style.cssText = "")
        : n.removeAttribute(r));
  for (const [r, o] of Object.entries(t))
    if (null != o && e[r] !== o)
      if (r.startsWith("on")) {
        const t = r.slice(2).toLowerCase();
        e[r] && n.removeEventListener(t, e[r]), n.addEventListener(t, o);
      } else if ("ref" === r)
        o && "object" == typeof o && "current" in o
          ? (o.current = n)
          : "function" == typeof o && o(n);
      else if ("style" === r) {
        const e = n.style;
        "object" == typeof o ? Object.assign(e, o) : (e.cssText = o);
      } else n.setAttribute(r, o);
}
const diffChildren = memoize((e, t, n) => {
  const r = Array.isArray(e) ? e.flat() : [e],
    o = Array.isArray(t) ? t.flat() : [t],
    s = Math.max(r.length, o.length);
  for (let e = 0; e < s; e++) {
    const t = r[e],
      s = o[e];
    if (!t || s)
      if (t || !s) {
        if (t instanceof Node && s instanceof Node)
          t.nodeType !== s.nodeType || t.nodeName !== s.nodeName
            ? n.replaceChild(s, t)
            : (diffProps(t.attributes, s.attributes, t),
              diffChildren(
                Array.from(t.childNodes),
                Array.from(s.childNodes),
                t
              ));
        else if (t !== s) {
          const t = n.childNodes[e];
          t && (t.textContent = String(s));
        }
      } else {
        const e = s instanceof Node ? s : document.createTextNode(String(s));
        n.appendChild(e);
      }
    else t instanceof Node && n.removeChild(t);
  }
});
class Signal {
  constructor(e) {
    (this._value = e),
      (this.observers = new Map()),
      (this.pending = new Set()),
      (this.isBatching = !1);
  }
  get value() {
    return (
      currentObserver &&
        (this.observers.has("_root") || this.observers.set("_root", new Set()),
        this.observers.get("_root").add(currentObserver)),
      this._value
    );
  }
  set value(e) {
    if (this._value === e) return;
    const t = this._value;
    if (((this._value = e), this.observers.has("_root")))
      for (const e of this.observers.get("_root")) this.pending.add(e);
    if ("object" == typeof t && "object" == typeof e) {
      const n = new Set([...Object.keys(t), ...Object.keys(e)]);
      for (const r of n)
        if (t[r] !== e[r] && this.observers.has(r))
          for (const e of this.observers.get(r)) this.pending.add(e);
    }
    this.batchUpdate();
  }
  batchUpdate() {
    this.isBatching ||
      ((this.isBatching = !0),
      Promise.resolve().then(() => {
        this.pending.forEach((e) => e()),
          this.pending.clear(),
          (this.isBatching = !1);
      }));
  }
  observe(e, t) {
    this.observers.has(e) || this.observers.set(e, new Set()),
      this.observers.get(e).add(t);
  }
  unobserve(e, t) {
    this.observers.has(e) && this.observers.get(e).delete(t);
  }
}
function $signal(e) {
  const t = new Signal(e),
    n = () => t.value;
  return (
    (n.toString = () => t.value),
    (n.observe = (e, n) => t.observe(e, n)),
    (n.unobserve = (e, n) => t.unobserve(e, n)),
    [
      n,
      (e) => {
        t.value = "function" == typeof e ? e(t.value) : e;
      },
    ]
  );
}
function $effect(e, t) {
  let n,
    r = !0,
    o = null;
  const s = () => {
    "function" == typeof n && (n(), (n = void 0)), (currentObserver = o);
    const t = e();
    (currentObserver = null), "function" == typeof t && (n = t);
  };
  return (
    (o = () => {
      if (r || !t) return s(), void (r = !1);
      Array.isArray(t) && 0 === t.length ? r && (s(), (r = !1)) : s();
    }),
    o(),
    () => {
      n && n();
    }
  );
}
function $memo(e) {
  const [t, n] = $signal(e());
  return $effect(() => n(e())), t;
}
function $ref(e) {
  const [t, n] = $signal({
    current: e,
    toString() {
      return this.current;
    },
    valueOf() {
      return this.current;
    },
  });
  return {
    get current() {
      return t().current;
    },
    set current(e) {
      n((t) => (t.current === e ? t : { ...t, current: e }));
    },
    toString() {
      return this.current.toString();
    },
    valueOf() {
      return this.current;
    },
  };
}
function h(e, t, ...n) {
  if (e === Fragment || Array.isArray(e)) {
    const r = document.createDocumentFragment(),
      o = e === Fragment ? t?.children || n : e;
    return (
      Array.isArray(o) &&
        o.flat().forEach((e) => {
          null != e &&
            r.appendChild(
              e instanceof Node ? e : document.createTextNode(String(e))
            );
        }),
      r
    );
  }
  if (!e) return null;
  const r = "function" == typeof e ? e(t) : document.createElement(e);
  if (("string" == typeof e && r && t && diffProps({}, t, r), n.length)) {
    const e = document.createDocumentFragment(),
      t = (n) => {
        if (null != n)
          if ("function" == typeof n) {
            const t = document.createTextNode("");
            $effect(() => {
              const e = n();
              if (Array.isArray(e)) {
                const n = document.createDocumentFragment();
                e.forEach((e) => {
                  n.appendChild(
                    e instanceof Node ? e : document.createTextNode(String(e))
                  );
                }),
                  t.parentNode && t.parentNode.replaceChild(n, t);
              } else t.textContent = String(e);
            }),
              e.appendChild(t);
          } else
            n instanceof Node
              ? e.appendChild(n)
              : Array.isArray(n)
              ? n.flat().forEach(t)
              : e.appendChild(document.createTextNode(String(n)));
      };
    n.forEach(t), r.appendChild(e);
  }
  return r;
}
const Component = (e, t) => {
    if ("function" != typeof e)
      throw new Error("Invalid Component: must be a function");
    return e(t);
  },
  Fragment = (e) => e.children;
window.Fragment = Fragment;
const Olova = {
    render(e, t) {
      const n = "function" == typeof e ? e() : e;
      return (
        t.firstChild ? diffChildren([t.firstChild], [n], t) : t.appendChild(n),
        n
      );
    },
    mount(e, t) {
      return this.render(e, t);
    },
    unmount(e) {
      e.innerHTML = "";
    },
    Fragment: Fragment,
  },
  contextRegistry = new Map();
function $context(e) {
  const t = Symbol("context");
  return (
    contextRegistry.set(t, e),
    {
      Provider({ value: e, children: n }) {
        const r = contextRegistry.get(t);
        contextRegistry.set(t, e);
        const o = n;
        return contextRegistry.set(t, r), o;
      },
      use() {
        const n = contextRegistry.get(t);
        if (void 0 === n && void 0 === e)
          throw new Error("Context used outside of Provider");
        return n ?? e;
      },
    }
  );
}
function $callback(e, t) {
  const [n, r] = $signal(() => ({
    fn: e,
    deps: t,
    memoized: (...t) => e(...t),
  }));
  return (
    $effect(() => {
      const o = n();
      t &&
        ((o.deps &&
          t.length === o.deps.length &&
          !t.some((e, t) => e !== o.deps[t])) ||
          r({ fn: e, deps: t, memoized: (...t) => e(...t) }));
    }),
    () => n().memoized
  );
}
export {
  $signal,
  $effect,
  $memo,
  $ref,
  $context,
  $callback,
  Component,
  h,
  Fragment,
};
export default Olova;
