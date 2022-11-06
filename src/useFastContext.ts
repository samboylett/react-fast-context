import { useContext, useEffect, useState } from "react";
import { EVENT_UPDATE } from "./events";
import { FastContext } from "./FastContext";
import { FastContextValueRef } from "./FastContextValueRef";

export function useFastContext<Value>(fastContext: FastContext<Value>, shouldUpdate: (oldValue: Value, newValue: Value) => boolean): Value {
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