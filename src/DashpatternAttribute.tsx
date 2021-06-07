import { declareModule, Icon, IconColor, makeAttributeModule } from '@collboard/modules-sdk';
import * as React from 'react';
import packageJson from '../package.json';

export const DASHPATTERNS: { [key: string]: { char: string; dasharray: number[] } } = {
    solid: { char: '—', dasharray: [] },
    dotted: { char: '⋯', dasharray: [1, 4] },
    dashed: { char: '┅', dasharray: [4] },
};

declareModule(
    makeAttributeModule<string>({
        manifest: {
            name: 'DashpatternAttribute',
            ...packageJson,
        },
        standard: true,
        attribute: {
            type: 'string',
            name: 'dashpattern',
            defaultValue: 'solid',
        },
        inputRender: (value: string, onChange: (value: string) => void) => (
            <>
                {Object.entries(DASHPATTERNS).map(([key, { char }]) => (
                    <Icon {...{ key, char }} active={value === key} onClick={() => onChange(key)} />
                ))}
            </>
        ),
    }),
);
