import { declareModule, makeIconModuleOnModule, Registration, Separator, ToolbarName } from '@collboard/modules-sdk';
import * as React from 'react';
import packageJson from '../package.json';
import { SampleArt } from './SampleArt';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: 'SampleTool',
            title: { en: 'Drawing', cs: 'Kreslení' },
            categories: ['Basic', 'Art'],
            ...packageJson,
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { attributesSystem } = await systems.request('attributesSystem');
            return {
                section: 2,
                char: '✒️',
                boardCursor: 'crosshair',
                menu: () => (
                    <>
                        {attributesSystem.inputRender('weight')}
                        <Separator />
                        {attributesSystem.inputRender('color')}
                        <Separator />
                        {attributesSystem.inputRender('dashpattern')}
                    </>
                ),
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const {
                    touchController,
                    appState,
                    attributesSystem,
                    materialArtVersioningSystem,
                    collSpace,
                } = await systems.request(
                    'touchController',
                    'appState',
                    'attributesSystem',
                    'materialArtVersioningSystem',
                    'collSpace',
                );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        next: (touch) => {
                            appState.cancelSelection();

                            const artInProcess = new SampleArt(
                                [],
                                attributesSystem.getAttributeValue('color') as string,
                                attributesSystem.getAttributeValue('dashpattern') as string,
                                attributesSystem.getAttributeValue('weight') as number,
                            );

                            const operation = materialArtVersioningSystem.createPrimaryOperation();
                            operation.newArts(artInProcess);

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    next: (touchFrame) => {
                                        artInProcess.path.push(collSpace.pickPoint(touchFrame.position).point);
                                        operation.update(artInProcess);
                                    },
                                    complete: () => {
                                        operation.persist();
                                    },
                                }),
                            );
                        },
                    }),
                );
            },
        },
    }),
);
