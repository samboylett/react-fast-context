import { Meta } from '@storybook/react';
import { createFastContext } from './createFastContext';

interface Value {
    foo: string,
    bar: number;
}

export default {
    title: "Example",
} as Meta;

const context = createFastContext<Value>({
    foo: "",
    bar: 0,
});

export const DefaultConsumer = () => (
    <context.Consumer shouldUpdate={() => true}>
        {value => (
            <pre>
                {JSON.stringify(value, null, 2)}
            </pre>
        )}
    </context.Consumer>
)