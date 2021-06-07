import { declareModule, Icon, ImageArt, makeIconModuleOnModule, ToolbarName } from '@collboard/modules-sdk';
import * as React from 'react';
import { Vector } from 'xyzt';
import packageJson from '../package.json';
import { CameraArt } from './CameraArt';

declareModule(() => {
    let cameraArt: CameraArt | null;
    /*!!! remove*/ let stream: MediaStream;

    return makeIconModuleOnModule({
        manifest: {
            name: 'CameraTool',
            title: { en: 'Camera', cs: 'Fotoaparát' },
            ...packageJson,
        },
        toolbar: ToolbarName.Tools,
        icon: ({ apiClientPromise, materialArtVersioningSystemPromise }) => ({
            autoSelect: true,
            section: 2,
            focusScope: 'camera',
            char: '📷',
            boardCursor: 'crosshair',
            menu: () => (
                <>
                    <Icon
                        char="📸"
                        onClick={async () => {
                            //const track = stream.getTracks()[0];
                            //let imageCapture = new ImageCapture(track);

                            const imageUrl = await (
                                await apiClientPromise
                            ).fileUpload(await cameraArt!.capture('image/jpeg'));

                            const imageArt = new ImageArt(imageUrl, 'camera');
                            imageArt.shift = cameraArt!.shift;

                            (await materialArtVersioningSystemPromise)
                                .createPrimaryOperation()
                                .newArts(imageArt)
                                .persist();
                        }}
                    />
                </>
            ),
        }),
        moduleActivatedByIcon: {
            setup: async ({ virtualArtVersioningSystemPromise }) => {
                if (navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                }

                cameraArt = new CameraArt(stream);

                //console.log('cameraArt.size', cameraArt.videoSize);

                //const virtualCameraArt = new HTMLArt(`<video autoplay="true" id="videoElement">`);

                //await forTime(100);
                // !!! alert(123);
                const operation = (await virtualArtVersioningSystemPromise).createPrimaryOperation().newArts(cameraArt);

                const videoSize = await cameraArt!.videoSize();
                console.log(videoSize);

                operation.updateWithMutatingCallback(() => {
                    cameraArt!.shift = Vector.fromObject(videoSize).half().negate();
                });

                return operation;
            },
        },
    });
});
