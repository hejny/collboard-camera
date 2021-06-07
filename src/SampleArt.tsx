import { Abstract2dArt, classNames, declareModule, makeArtModule } from '@collboard/modules-sdk';
import * as React from 'react';
import { IVector, Vector } from 'xyzt';
import packageJson from '../package.json';
import { DASHPATTERNS } from './DashpatternAttribute';

export const SVG_PADDING = 10;
export const IS_NEAR_DISTANCE = 20;

export class SampleArt extends Abstract2dArt {
    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    public constructor(
        public path: IVector[],
        public color: string,
        public dashpattern: string,
        public weight: number,
    ) {
        super();
    }

    public get topLeftCorner() {
        return new Vector(this.minX, this.minY).add(this.shift);
    }
    public get bottomRightCorner() {
        return new Vector(this.maxX, this.maxY).add(this.shift);
    }
    public get size() {
        return this.bottomRightCorner.subtract(this.topLeftCorner);
    }
    public set size(newSize: IVector) {
        try {
            const scaleX = (newSize.x || 0) / (this.maxX - this.minX);
            const scaleY = (newSize.y || 0) / (this.maxY - this.minY);

            this.path.forEach((point) => {
                point.x = (point.x || 0) * scaleX;
                point.y = (point.y || 0) * scaleY;
            });
            this.calculateBoundingBox();
        } catch (e) {
            this.calculateBoundingBox();
        }
    }

    public isNear(point2: IVector) {
        return (
            this.path.filter((point) => Vector.add(point, this.shift).distance(point2) <= IS_NEAR_DISTANCE).length > 0
        );
    }

    public get acceptedAttributes() {
        return ['color', 'weight', 'size'];
    }

    private calculateBoundingBox() {
        const xVals = this.path.map((point) => point.x || 0);
        const yVals = this.path.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }

    private get svgpath(): string {
        return this.path
            .map((point, i) => {
                const pointRelative = Vector.subtract(
                    point,
                    new Vector(this.minX - SVG_PADDING, this.minY - SVG_PADDING),
                );
                return `${i === 0 ? 'M' : 'L'}${pointRelative.x} ${pointRelative.y}`;
            })
            .join(' ');
    }

    render(selected: boolean) {
        this.calculateBoundingBox();
        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - SVG_PADDING + (this.shift.x || 0),
                    top: this.minY - SVG_PADDING + (this.shift.y || 0),
                }}
            >
                <svg
                    width={this.maxX - this.minX + 2 * SVG_PADDING}
                    height={this.maxY - this.minY + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g>
                        <path
                            d={this.svgpath}
                            stroke={this.color}
                            strokeWidth={this.weight}
                            fillOpacity="null"
                            strokeOpacity="null"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="transparent"
                            strokeDasharray={DASHPATTERNS[this.dashpattern].dasharray
                                .map((length) => length * this.weight)
                                .join(' ')}
                        />
                    </g>
                </svg>
            </div>
        );
    }
}

declareModule(() =>
    makeArtModule({
        name: 'collboard_sample_Sample',
        class: SampleArt,
        ...packageJson,
    }),
);
