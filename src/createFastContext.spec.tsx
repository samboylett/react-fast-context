import { act, render, screen } from "@testing-library/react";
import { FC, useState } from "react";
import { createFastContext } from './createFastContext';
import { FastContext } from './FastContext';

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

        describe("when rendering the provider", () => {
            let Provider: FC;
            let changeContextValue: (value: Value) => void;

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
    });
});