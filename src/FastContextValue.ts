import EventEmitter from "events";

export interface FastContextValue<Value> {
  value: Value;
  events: EventEmitter;
}