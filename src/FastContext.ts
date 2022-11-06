import { Context, ReactNode } from "react";
import { FastContextValue } from "./FastContextValue";
import { FastContextValueRef } from "./FastContextValueRef";

export interface FastContext<Value> {
    baseContext: Context<FastContextValueRef<Value>>;
    Provider: (props: { value: Value, children: ReactNode }) => ReactNode;
    Consumer: (props: {
        children: (value: Value) => ReactNode;
        shouldUpdate: (oldValue: Value, newValue: Value) => boolean;
    }) => ReactNode;
}