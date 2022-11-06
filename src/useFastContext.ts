import { useContext, useEffect, useState } from "react";
import { EVENT_UPDATE } from "./events";
import { FastContext } from "./FastContext";
import { FastContextShouldUpdate } from "./FastContextShouldUpdate";
import { FastContextValueRef } from "./FastContextValueRef";

/**
 * Use a fast context.
 * 
 * @param {FastContext} fastContext - The context to use
 * @param {FastContextShouldUpdate} shouldUpdate - If an update should re-render the hook/component
 * @returns {Value} The context value
 */
export function useFastContext<Value>(fastContext: FastContext<Value>, shouldUpdate: FastContextShouldUpdate<Value>): Value {
    const baseContext = useContext<FastContextValueRef<Value>>(fastContext.baseContext);
    const [value, setValue] = useState<Value>(baseContext.current.value);

    useEffect(() => {
        const handleUpdate = (newValue: Value) => {
            if (shouldUpdate(value, newValue)) {
                setValue(newValue);
            }
        };

        baseContext.current.events.on(EVENT_UPDATE, handleUpdate);

        return () => {
            baseContext.current.events.off(EVENT_UPDATE, handleUpdate);
        };
    });

    return value;
}