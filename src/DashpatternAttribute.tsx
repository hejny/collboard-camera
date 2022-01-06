import { declareModule, Icon, IconColor, makeAttributeModule } from '@collboard/modules-sdk';
import * as React from 'react';
import { contributors, description, license, repository, version } from '../package.json';

export const DASHPATTERNS: { [key: string]: { char: string; dasharray: number[] } } = {
    solid: { char: '—', dasharray: [] },
    dotted: { char: '⋯', dasharray: [1, 4] },
    dashed: { char: '┅', dasharray: [4] },
};

declareModule(
    makeAttributeModule<string>({
        manifest: {
            name: '@collboard/module-sample-objects/sample-art/dashpattern-attribute',
            version,
            description,
            contributors,
            license,
            repository,
            flags: {
                isTemplate: true,
            },
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