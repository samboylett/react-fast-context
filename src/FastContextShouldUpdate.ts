/**
 * Function type to check if a component should update based on the context value change.
 */
export type FastContextShouldUpdate<Value> = (oldValue: Value, newValue: Value) => boolean;