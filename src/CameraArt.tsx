import { Abstract2dBoxArt, declareModule, makeArtModule } from '@collboard/modules-sdk';
import * as React from 'react';
import { forValueDefined } from 'waitasecond';
import { Vector } from 'xyzt';
import packageJson from '../package.json';

export class CameraArt extends Abstract2dBoxArt {
    constructor(private stream: MediaProvider) {
        super();
    }

    private videoElement: HTMLVideoElement | null = null;

    public renderBox() {
        return (
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

declareModule(() =>
    makeArtModule({
        name: 'Camera',
        class: CameraArt,
        ...packageJson,
    }),
);
