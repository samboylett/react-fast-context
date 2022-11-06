import { MutableRefObject, RefObject } from "react";
import { FastContextValue } from "./FastContextValue";

export type FastContextValueRef<Value> = MutableRefObject<FastContextValue<Value>>;