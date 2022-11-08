import { RefObject, useContext } from "react";
import { FastContext } from "./FastContext";
import { FastContextValueRef } from "./FastContextValueRef";

/**
 * Use a fast context as a ref. Will never cause the component to update, but the latest value can always be accessed.
 * Useful for callbacks accessing values in the context which don't effect a components render.
 * 
 * @param {FastContext} fastContext - The context to use
 * @returns {FastContextValueRef<Value>} The context value
 */
export function useCurrentContext<Value>(fastContext: FastContext<Value>): RefObject<Value> {
    const context = useContext<FastContextValueRef<Value>>(fastContext.baseContext);

    return {
        get current() {
            return context.current.value;
        }
    };
}