import { MutableRefObject } from "react";
import { FastContextValue } from "./FastContextValue";

/**
 * The value of a fast context when viewed by a native context.
 */
export type FastContextValueRef<Value> = MutableRefObject<FastContextValue<Value>>;