import { act, render, renderHook, RenderHookResult, screen } from "@testing-library/react";
import { FC, ReactNode, RefObject, useState } from "react";
import { createFastContext, FastContext, useCurrentContext } from './index';

describe('createFastContext', () => {
    test("is a function", () => {
        expect(createFastContext).toEqual(expect.any(Function));
    });

    describe("when called", () => {
        interface Value {
            foo: string;
            bar: number;
        }

        let fastContext: FastContext<Value>;
        let changeContextValue: (value: Value) => void;

        beforeEach(() => {
            fastContext = createFastContext<Value>({
                foo: "default-foo-value",
                bar: 50,
            });
        });

        test("returns a consumer", () => {
            expect(fastContext.Consumer).toEqual(expect.any(Function));
        });

        test("returns a provider", () => {
            expect(fastContext.Provider).toEqual(expect.any(Function));
        });

        describe("useCurrentContext", () => {
            let currentContextRenderCount: number;
            let hook: RenderHookResult<RefObject<Value>, void>;

            test("is a function", () => {
                expect(useCurrentContext).toEqual(expect.any(Function));
            });

            describe("when rendered", () => {
                beforeEach(() => {
                    currentContextRenderCount = 0;

                    hook = renderHook<RefObject<Value>, void>(() => {
                        currentContextRenderCount++;

                        return useCurrentContext(fastContext);
                    });
                });

                test("returns the default context value", () => {
                    expect(hook.result.current.current).toEqual({
                        foo: "default-foo-value",
                        bar: 50,
                    })
                });

                test("has rendered once", () => {
                    expect(currentContextRenderCount).toEqual(1);
                });
            });

            describe("when rendered in provider", () => {
                let Provider: FC<{ children: ReactNode }>;
                let changeState: (value: Value) => void;

                beforeEach(() => {
                    currentContextRenderCount = 0;
                    Provider = ({ children }) => {
                        const [value, setValue] = useState<Value>({
                            foo: "foo1",
                            bar: 789,
                        });

                        changeState = setValue;

                        return (
                            <fastContext.Provider value={value}>
                                {children}
                            </fastContext.Provider>
                        );
                    };

                    hook = renderHook<RefObject<Value>, void>(() => {
                        currentContextRenderCount++;

                        return useCurrentContext(fastContext);
                    }, {
                        wrapper: Provider,
                    });
                });

                test("returns the current context value", () => {
                    expect(hook.result.current.current).toEqual({
                        foo: "foo1",
                        bar: 789,
                    })
                });

                test("has rendered once", () => {
                    expect(currentContextRenderCount).toEqual(1);
                });

                describe("when context updates", () => {
                    beforeEach(() => {
                        act(() => {
                            changeState({
                                foo: "foo2",
                                bar: 790,
                            });
                        });
                    });

                    test("returns the new current context value", () => {
                        expect(hook.result.current.current).toEqual({
                            foo: "foo2",
                            bar: 790,
                        })
                    });
    
                    test("has still rendered once", () => {
                        expect(currentContextRenderCount).toEqual(1);
                    });
                });
            });
        });

        describe("when rendering the consumer only", () => {
            beforeEach(() => {                
                render(
                    <div data-testid="value">
                        <fastContext.Consumer shouldUpdate={() => false}>
                            {value => JSON.stringify(value)}
                        </fastContext.Consumer>
                    </div>
                );
            });

            test("renders the default value", () => {
                expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "default-foo-value", bar: 50 }))
            });
        });

        describe("when rendering the provider", () => {
            let Provider: FC;
            
            beforeEach(() => {
                Provider = () => {
                    const [value, setValue] = useState<Value>({ foo: "flip", bar: 123 });
                    changeContextValue = setValue;

                    return (
                        <fastContext.Provider value={value}>
                            <fastContext.baseContext.Consumer>
                                {readValue => JSON.stringify(readValue.current.value)}
                            </fastContext.baseContext.Consumer>
                        </fastContext.Provider>
                    );
                };
                
                render(<div data-testid="value"><Provider /></div>);
            });

            test("renders the context value", () => {
                expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "flip", bar: 123 }))
            });

            describe("when value updates", () => {
                beforeEach(() => {
                    act(() => {
                        changeContextValue({
                            foo: "flop",
                            bar: 456,
                        });
                    });
                });

                test("renders the new context value", () => {
                    expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "flop", bar: 456 }))
                });
            });
        });

        describe("when rendering the consumer in the provider", () => {
            let Consumer: FC;
            let Provider: FC<{ children: ReactNode }>;
            let shouldUpdate: jest.Mock<boolean>;
            let consumerRenderCount: number;
            let consumerChildrenRenderCount: number;

            beforeEach(() => {  
                shouldUpdate = jest.fn();
                consumerRenderCount = 0;
                consumerChildrenRenderCount = 0;
                
                Consumer = () => {
                    consumerRenderCount++;

                    return (
                        <fastContext.Consumer shouldUpdate={shouldUpdate}>
                            {value => {
                                consumerChildrenRenderCount++;

                                return JSON.stringify(value);
                            }}
                        </fastContext.Consumer>
                    );
                };

                Provider = ({ children }) => {
                    const [value, setValue] = useState<Value>({ foo: "flap", bar: 321 });
                    changeContextValue = setValue;

                    return (
                        <fastContext.Provider value={value}>
                            {children}
                        </fastContext.Provider>
                    );
                };

                render(
                    <div data-testid="value">
                        <Provider>
                            <Consumer />
                        </Provider>
                    </div>
                );
            });

            test("renders the context value", () => {
                expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "flap", bar: 321 }))
            });

            test("does not call shouldUpdate", () => {
                expect(shouldUpdate).not.toHaveBeenCalled();
            });

            test("renders once", () => {
                expect(consumerRenderCount).toEqual(1);
                expect(consumerChildrenRenderCount).toEqual(1);
            });

            describe("when updating but shouldUpdate returns false", () => {
                beforeEach(() => {
                    shouldUpdate.mockReturnValue(false);

                    act(() => {
                        changeContextValue({
                            foo: "poof",
                            bar: 2,
                        });
                    });
                });

                test("calls shouldUpdate with old and new values", () => {
                    expect(shouldUpdate).toHaveBeenCalledWith({ foo: "flap", bar: 321 }, { foo: "poof", bar: 2 });
                });

                test("renders the old context value", () => {
                    expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "flap", bar: 321 }))
                });

                test("does not render again", () => {
                    expect(consumerRenderCount).toEqual(1);
                    expect(consumerChildrenRenderCount).toEqual(1);
                });
            });

            describe("when updating but shouldUpdate returns true", () => {
                beforeEach(() => {
                    shouldUpdate.mockReturnValue(true);

                    act(() => {
                        changeContextValue({
                            foo: "foop",
                            bar: 3,
                        });
                    });
                });

                test("calls shouldUpdate with old and new values", () => {
                    expect(shouldUpdate).toHaveBeenCalledWith({ foo: "flap", bar: 321 }, { foo: "foop", bar: 3 });
                });

                test("renders the new context value", () => {
                    expect(screen.queryByTestId("value")?.textContent).toEqual(JSON.stringify({ foo: "foop", bar: 3 }))
                });

                test("only consumer child has rendered twice", () => {
                    expect(consumerRenderCount).toEqual(1);
                    expect(consumerChildrenRenderCount).toEqual(2);
                });
            });
        });
    });
});