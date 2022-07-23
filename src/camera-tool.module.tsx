import { declareModule, Icon, ImageArt, makeIconModuleOnModule, React, ToolbarName } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../package.json';
import { CameraArt } from './camera-art.module';

declareModule(() => {
    let cameraArt: CameraArt | null;
    /*!!! remove*/ let stream: MediaStream;

    return makeIconModuleOnModule({
        manifest: {
            name: '@hejny/camera-tool',
            title: { en: 'Camera', cs: 'Fotoaparát' },
            version,
            description,
            contributors,
            license,
            repository,
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { usercontentSystem, materialArtVersioningSystem } = await systems.request(
                'usercontentSystem',
                'materialArtVersioningSystem',
            );
            return {
                autoSelect: true,
                section: 2,
                focusScopeName: null,
                togglable: true,
                icon: '📷',
                boardCursor: 'crosshair',
                menu: (
                    <>
                        <Icon
                            icon="📸"
                            onClick={async () => {
                                //const track = stream.getTracks()[0];
                                //let imageCapture = new ImageCapture(track);

                                const imageUrl = await usercontentSystem.upload(await cameraArt!.capture('image/jpeg'));

                                const imageArt = new ImageArt(imageUrl, 'camera');
                                imageArt.shift = cameraArt!.shift;

                                materialArtVersioningSystem.createPrimaryOperation().newArts(imageArt).persist();
                            }}
                        />
                    </>
                ),
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { virtualArtVersioningSystem, appState } = await systems.request(
                    'virtualArtVersioningSystem',
                    'appState',
                );
                if (navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                }

                cameraArt = new CameraArt(stream);

                //console.log('cameraArt.size', cameraArt.videoSize);

                //const virtualCameraArt = new HTMLArt(`<video autoplay="true" id="videoElement">`);

                //await forTime(100);
                // !!! alert(123);
                const operation = virtualArtVersioningSystem.createPrimaryOperation().newArts(cameraArt);
                const videoSize = await cameraArt!.videoSize();

                appState.transform.subscribe((transform) => {
                    operation.updateWithMutatingCallback(() => {
                        cameraArt?.setShift(Vector.fromObject(videoSize).half().negate().apply(transform.inverse()));
                    });
                });

                return operation;
            },
        },
    });
});
