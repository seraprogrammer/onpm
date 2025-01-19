# Olova JavaScript Framework

Olova is a lightweight and reactive JavaScript framework that simplifies UI
development with a clean, intuitive syntax. It provides a reactivity system and
hooks to manage state and side effects, allowing developers to build modern web
applications with ease.

## Features

- **State Management**: Use the `State` hook to manage reactive state in your
  components.
- **Side Effects**: Use the `Effect` hook to run side effects in response to
  state changes.
- **JSX-style Syntax**: Write UI components using a simple, declarative
  JSX-style syntax.
- **Reactivity**: Automatically re-render components when state changes.

## Installation

To get started with Olova, first install the core library via npm or yarn.

```bash
npm install olova
```

or

```bash
yarn add olova
```

## Example Usage

Here is an example of a basic component in Olova:

```js
import Olova, { State, Effect } from "olova";

export default function Home() {
  const [count, setCount] = State(0);

  Effect(() => {
    console.log("Home is rendered");
    console.log(count);
  }, [count]);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}
```
