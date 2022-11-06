import { MutableRefObject } from "react";
import { FastContextValue } from "./FastContextValue";

export type FastContextValueRef<Value> = MutableRefObject<FastContextValue<Value>>;