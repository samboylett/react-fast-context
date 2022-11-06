import EventEmitter from "events";
import { Context, createContext, useRef } from "react";
import { FastContext } from "./FastContext";
import { FastContextValue } from "./FastContextValue";
import { FastContextValueRef } from "./FastContextValueRef";


export function createFastContext<Value extends unknown>(defaultValue: Value): FastContext<Value> {
  const baseContext = createContext<FastContextValueRef<Value>>({
    current: {
      value: defaultValue,
      events: new EventEmitter(),
    }
  });

  return {
    baseContext,

    Provider: ({ value, children }) => {
      const events = useRef(new EventEmitter());
      const fastValue = useRef<FastContextValue<Value>>({
        value,
        events: events.current,
      });

      return (
        <baseContext.Provider value={fastValue}>
          {children}
        </baseContext.Provider>
      );
    },
    
    Consumer: ({ children }) => {
      return (
        <baseContext.Consumer>
          {value => (
            <>
              {children(value.current.value)}
            </>
          )}
        </baseContext.Consumer>
      )
    }
  };
}
