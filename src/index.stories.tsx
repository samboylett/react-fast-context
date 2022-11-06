import { Meta } from '@storybook/react';
import { useState } from 'react';
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

export const ProviderWithConsumer = () => {
    const [foo, setFoo] = useState<string>("");
    const [bar, setBar] = useState<number>(0);
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(true);

    return (
        <context.Provider value={{ foo, bar }}>
            <label>
                Foo <input value={foo} onChange={e => setFoo(e.target.value)} />
            </label>
            
            <label>
                Bar <input value={bar} type="number" onChange={e => setBar(parseInt(e.target.value))} />
            </label>
            
            <label>
                Should update <input checked={shouldUpdate} type="checkbox" onChange={e => setShouldUpdate(e.target.checked)} />
            </label>

            <context.Consumer shouldUpdate={() => shouldUpdate}>
                {value => (
                    <pre>
                        {JSON.stringify(value, null, 2)}
                    </pre>
                )}
            </context.Consumer>
        </context.Provider>
    )
}