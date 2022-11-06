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
    });
});