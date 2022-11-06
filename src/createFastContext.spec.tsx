import { act, render, screen } from "@testing-library/react";
import { FC, ReactNode, useState } from "react";
import { createFastContext } from './createFastContext';
import { FastContext } from './FastContext';
import { FastContextShouldUpdate } from "./FastContextShouldUpdate";

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

            beforeEach(() => {  
                shouldUpdate = jest.fn();
                
                Consumer = () => (
                    <fastContext.Consumer shouldUpdate={shouldUpdate}>
                        {value => JSON.stringify(value)}
                    </fastContext.Consumer>
                );

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
            })
        });
    });
});