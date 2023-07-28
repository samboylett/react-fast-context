import EventEmitter from "events";
import { createContext, useEffect, useMemo, useRef } from "react";
import { EVENT_UPDATE } from "./events";
import { FastContext } from "./FastContext";
import { FastContextValue } from "./FastContextValue";
import { FastContextValueRef } from "./FastContextValueRef";
import { useFastContext } from "./useFastContext";

/**
 * Create a fast context.
 * 
 * @param {Value} defaultValue - The default value
 * @returns {FastContext<Value>} The fast context
 */
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

      const lastEmittedValue = useRef<Value>(value);
      fastValue.current.value = value;

      useEffect(() => {
        if (lastEmittedValue.current !== value) {
          events.current.emit(EVENT_UPDATE, value);
          lastEmittedValue.current = value;
        }
      }, [lastEmittedValue, value]);

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
