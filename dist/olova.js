import e from "./hooks/state.js";
import t from "./hooks/effect.js";
import n from "./hooks/memo.js";
import s from "./hooks/callback.js";
import o from "./hooks/reducer.js";
import r from "./hooks/ref.js";
import i from "./hooks/context.js";
const c = new (class {
  constructor() {
    (this.rootElement = null),
      (this.components = new Map()),
      (this.componentStack = []),
      (this.componentInstances = new Map()),
      (this.pendingUpdates = []),
      (this.pendingEffects = []),
      (this.contextSubscriptions = new WeakMap()),
      (this.isBatchingUpdates = !1),
      (this.hasScheduledFlush = !1),
      (this.dirtyInstances = null);
  }
  createElement(e, t, ...n) {
    return null == e
      ? (console.error("Element type cannot be null or undefined"), null)
      : "function" == typeof e || "string" == typeof e
      ? { type: e, props: { ...t, children: n.flat() } }
      : (console.error("Invalid element type:", e), null);
  }
  render(e, t) {
    try {
      if (null == e) return;
      if ("string" == typeof e || "number" == typeof e)
        return void t.appendChild(document.createTextNode(e));
      if (Array.isArray(e)) return void e.forEach((e) => this.render(e, t));
      if ("function" == typeof e.type) {
        const n = e.type,
          s = this.getComponentInstance(n);
        if (n.__isMemoized) {
          const n = s.lastProps;
          if (n && this.deepEqual(n, e.props) && s.lastResult)
            return void this.render(s.lastResult, t);
        }
        this.componentStack.push(s),
          (s.currentHook = 0),
          (s.lastProps = e.props);
        const o = n(e.props);
        return (
          (s.lastResult = o), this.componentStack.pop(), void this.render(o, t)
        );
      }
      if ("string" != typeof e.type)
        return void console.error("Invalid element type:", e.type);
      const n = document.createElement(e.type);
      this.applyProps(n, e.props),
        (e.props.children || []).forEach((e) => this.render(e, n)),
        t.appendChild(n);
    } catch (e) {
      console.error("Render error:", e);
    }
  }
  applyProps(e, t) {
    Object.keys(t || {}).forEach((n) => {
      if ("ref" === n && t[n]) t[n].current = e;
      else if (n.startsWith("on")) {
        const s = n.toLowerCase().substring(2);
        e.addEventListener(s, t[n]);
      } else
        "children" !== n &&
          ("className" === n ? e.setAttribute("class", t[n]) : (e[n] = t[n]));
    });
  }
  getComponentInstance(e) {
    return (
      this.componentInstances.has(e) ||
        this.componentInstances.set(e, {
          hooks: [],
          currentHook: 0,
          effects: [],
          cleanups: new Map(),
          pendingEffects: [],
          contextSubscriptions: new Set(),
          lastProps: null,
          lastResult: null,
        }),
      this.componentInstances.get(e)
    );
  }
  renderComponent(e, t) {
    const n = this.getComponentInstance(e);
    this.componentStack.push(n), (n.currentHook = 0);
    if (!n.lastResult || this.shouldComponentUpdate(n, e)) {
      const s = e();
      (n.lastResult = s),
        this.render(s, t),
        n.pendingEffects.length > 0 &&
          (this.pendingEffects.push(...n.pendingEffects),
          (n.pendingEffects = []));
    } else this.render(n.lastResult, t);
    this.componentStack.pop();
  }
  shouldComponentUpdate(e, t) {
    return (
      !t.__isMemoized || !e.lastProps || !this.deepEqual(e.lastProps, t.props)
    );
  }
  getCurrentInstance() {
    return this.componentStack[this.componentStack.length - 1];
  }
  createContext(e) {
    const t = {
      _currentValue: e,
      _defaultValue: e,
      _subscribers: new Set(),
      _version: 0,
      Provider: ({ value: e, children: n }) => {
        const s = this.getCurrentInstance(),
          o = s.currentHook++,
          r = s.hooks[o];
        return (
          this.shallowEqual(r, e) ||
            ((t._currentValue = e),
            t._version++,
            t._subscribers.forEach((t) => {
              (t.instance.hooks[t.hookIndex] = e), this.scheduleUpdate();
            })),
          (s.hooks[o] = e),
          n
        );
      },
      Consumer: ({ children: e }) => {
        if ("function" != typeof e)
          throw new Error("Context.Consumer expects a function as a child");
        return e(t._currentValue);
      },
    };
    return t;
  }
  scheduleUpdate() {
    this.isBatchingUpdates ||
      ((this.isBatchingUpdates = !0),
      this.pendingUpdates.push(() => {
        if (this.rootElement) {
          const e = this.dirtyInstances || new Set();
          for (
            this.components.forEach((t, n) => {
              const s = this.getComponentInstance(t);
              e.has(s) && ((n.innerHTML = ""), this.renderComponent(t, n));
            }),
              this.dirtyInstances = new Set();
            this.pendingEffects.length > 0;

          ) {
            this.pendingEffects.shift()();
          }
        }
      }),
      this.hasScheduledFlush ||
        ((this.hasScheduledFlush = !0),
        queueMicrotask(() => {
          this.flushUpdates(), (this.isBatchingUpdates = !1);
        })));
  }
  flushUpdates() {
    for (; this.pendingUpdates.length > 0; ) {
      this.pendingUpdates.shift()();
    }
    this.hasScheduledFlush = !1;
  }
  mount(e, t) {
    for (
      this.rootElement = t,
        this.components.set(t, e),
        this.renderComponent(e, t);
      this.pendingEffects.length > 0;

    ) {
      this.pendingEffects.shift()();
    }
  }
  unmount(e) {
    const t = this.components.get(e);
    if (t) {
      const n = this.componentInstances.get(t);
      n &&
        (n.contextSubscriptions.forEach((e) => e()),
        n.contextSubscriptions.clear(),
        n.cleanups.forEach((e) => e()),
        n.cleanups.clear(),
        this.componentInstances.delete(t)),
        this.components.delete(e);
    }
    e.innerHTML = "";
  }
  memo(e) {
    const t = (t) => {
      const n = this.getCurrentInstance();
      if (!n) return e(t);
      const s = n.currentHook++,
        o = n.hooks[s] || { props: null, result: null },
        r = !o.props || !this.deepEqual(t, o.props);
      if (!o.result || r) {
        const o = e(t);
        return (n.hooks[s] = { props: t, result: o }), o;
      }
      return o.result;
    };
    return (t.__isMemoized = !0), (t.__original = e), t;
  }
  shallowEqual(e, t) {
    if (e === t) return !0;
    if (!e || !t) return !1;
    if ("object" != typeof e || "object" != typeof t) return e === t;
    const n = Object.keys(e),
      s = Object.keys(t);
    return (
      n.length === s.length &&
      n.every((n) => t.hasOwnProperty(n) && e[n] === t[n])
    );
  }
  deepEqual(e, t) {
    if (e === t) return !0;
    if (!e || !t) return !1;
    if (typeof e != typeof t) return !1;
    if ("object" != typeof e) return e === t;
    if (Array.isArray(e))
      return (
        !(!Array.isArray(t) || e.length !== t.length) &&
        e.every((e, n) => this.deepEqual(e, t[n]))
      );
    const n = Object.keys(e),
      s = Object.keys(t);
    return (
      n.length === s.length &&
      n.every((n) => t.hasOwnProperty(n) && this.deepEqual(e[n], t[n]))
    );
  }
})();
export const h = c.createElement.bind(c);
export const Fragment = (e) => (e ? e.children : null);
export const $state = (t) => e(c, t);
export const $effect = (e, n) => t(c, e, n);
export const $memo = (e, t) => n(c, e, t);
export const $callback = (e, t) => s(c, e, t);
export const $reducer = (e, t) => o(c, e, t);
export const $ref = (e) => r(c, e);
export const $context = (e) => i(c, e);
export const createContext = c.createContext.bind(c);
export const memo = c.memo.bind(c);
export default c;
