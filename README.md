# react-fast-context

A simple library which lets you create and consume a context without every update to the context trigger an update to the current component.

## Installation

```sh
npm i --save react-fast-context
```

## Usage

The API mirrors the built in React context API, but with the extra `shouldUpdate` option, which allows you to decide if an update to the value should trigger an update to the component, similar to `shouldComponentUpdate`.

### Create a context

Takes the same generic type and default value argument as `createContext`, but returns a `FastContext`.

```ts
import { createFastContext } from 'react-fast-context';

export const myContext = createFastContext<{ foo: string, bar: number }>({
    foo: "",
    bar: 0,
});
```

### Add the provider

Again, this is no different to a regular react context

```tsx
export const MyProvider = ({ children }) => (
    <myContext.Provider value={{ foo: "asdf", bar: 20 }}>
        {children}
    </myContext.Provider>
)
```

### Using a consumer

Like a regular consumer, except the `shouldUpdate` prop must be supplied to determine whether to update or not. In this case, ignore updates to `bar` as it isn't used.

```tsx
export const MyComponent = () => {
    return (
        <myContext.Consumer shouldUpdate={(oldValue, newValue) => oldValue.foo !== newValue.foo}>
            {({ foo }) => (
                <>
                    Value: {foo}
                </>
            )}
        </myContext.Consumer>
    );
};
```

### Use the hooks

You can use `useFastContext`, which is like the normal useContext, but requires a second argument to determine updates:

```ts
export const useFoo = () => {
    const { foo } = useFastContext(myContext, (oldValue, newValue) => oldValue.foo !== newValue.foo);

    return foo;
}
```

Or you can use `useCurrentContext`, which returns the context value wrapped in a ref object, so will never trigger a re-render, but can always be used to access the latest context value.

```ts
export const Component = () => {
    const ref = useCurrentContext(myContext);

    return <Child onEvent={() => {
        console.log(ref.current.foo)
    }} />
}
```