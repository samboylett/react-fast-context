import EventEmitter from "events";

/**
 * The context value and event emitter.
 */
export interface FastContextValue<Value> {
  value: Value;
  events: EventEmitter;
}