import { Context, ReactElement, ReactNode } from "react";
import { FastContextValueRef } from "./FastContextValueRef";

/**
 * The fast context type.
 */
export interface FastContext<Value> {
    /**
     * The native context type used internally.
     * 
     * @private
     */
    baseContext: Context<FastContextValueRef<Value>>;

    /**
     * Provider component for the context.
     */
    Provider: (props: { value: Value, children: ReactNode }) => ReactElement;

    /**
     * Consumer component for the context.
     */
    Consumer: (props: {
        children: (value: Value) => ReactNode;
        shouldUpdate: (oldValue: Value, newValue: Value) => boolean;
    }) => ReactElement;
}