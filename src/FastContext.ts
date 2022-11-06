import { Context, ReactElement, ReactNode } from "react";
import { FastContextValueRef } from "./FastContextValueRef";

export interface FastContext<Value> {
    baseContext: Context<FastContextValueRef<Value>>;
    Provider: (props: { value: Value, children: ReactNode }) => ReactElement;
    Consumer: (props: {
        children: (value: Value) => ReactNode;
        shouldUpdate: (oldValue: Value, newValue: Value) => boolean;
    }) => ReactElement;
}