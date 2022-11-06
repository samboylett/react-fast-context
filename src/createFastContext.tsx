import EventEmitter from "events";
import { Context, createContext, useEffect, useMemo, useRef } from "react";
import { EVENT_UPDATE } from "./events";
import { FastContext } from "./FastContext";
import { FastContextValue } from "./FastContextValue";
import { FastContextValueRef } from "./FastContextValueRef";
import { useFastContext } from "./useFastContext";

export function createFastContext<Value extends unknown>(defaultValue: Value): FastContext<Value> {
  const baseContext = createContext<FastContextValueRef<Value>>({
    current: {
      value: defaultValue,
      events: new EventEmitter(),
    }
  });

  const fastContext: FastContext<Value> = {
    baseContext,

    Provider: ({ value, children }) => {
      const events = useRef(new EventEmitter());
      const fastValue = useRef<FastContextValue<Value>>({
        value,
        events: events.current,
      });

      const oldValue = fastValue.current.value;
      fastValue.current.value = value;

      useEffect(() => {
        if (oldValue !== value) {
          events.current.emit(EVENT_UPDATE, value);
        }
      }, [oldValue, value]);

      return useMemo(() => (
        <baseContext.Provider value={fastValue}>
          {children}
        </baseContext.Provider>
      ), [fastValue, children]);
    },
    
    Consumer: ({ children, shouldUpdate }) => {
      const value = useFastContext<Value>(fastContext, shouldUpdate);

      return useMemo(() => (
        <>
          {children(value)}
        </>
      ), [value, children]);
    }
  };

  return fastContext;
}
