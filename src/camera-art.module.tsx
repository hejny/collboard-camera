import { Abstract2dBoxArt, declareModule, makeArtModule, React } from '@collboard/modules-sdk';
import { forValueDefined } from 'waitasecond';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../package.json';

export class CameraArt extends Abstract2dBoxArt {
    public static serializeName = 'CameraArt';
    public static manifest = {
        name: '@hejny/camera-art',
        contributors,
        description,
        license,
        repository,
        version,
    };

    constructor(private stream: MediaProvider) {
        super();
    }

    private videoElement: HTMLVideoElement | null = null;

    public renderBox() {
        return (
            <div>
                {Math.random()}
                <video
                    style={{ opacity: 0.8 }}
                    autoPlay={true}
                    id="videoElement"
                    ref={(videoElement) => {
                        if (videoElement) {
                            this.videoElement = videoElement;
                            videoElement.srcObject = this.stream;
                        }
                    }}
                />
            </div>
        );
    }

    public async videoSize() {
        return await forValueDefined(async () => {
            const videoSize = Vector.fromObject(await forValueDefined(() => this.videoElement), [
                'videoWidth',
                'videoHeight',
            ]);
            if (videoSize.isZero()) {
                return undefined;
            } else {
                return videoSize;
            }
        });
    }

    public async capture(type = 'image/webp', quality?: number): Promise<Blob> {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement!.videoWidth;
        canvas.height = this.videoElement!.videoHeight;
        canvas.getContext('2d')!.drawImage(this.videoElement!, 0, 0);
        return await (await fetch(canvas.toDataURL(type, quality))).blob();
    }
}
declareModule(makeArtModule(CameraArt));
