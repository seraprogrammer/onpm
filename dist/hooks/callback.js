import { createMemoHook } from "./memo.js";
export function createCallbackHook(o) {
  return function (e, r) {
    return o.$memo(() => e, r);
  };
}
