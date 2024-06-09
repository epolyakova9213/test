import {IPoint} from "@/infra/game/controller/math/point";

export type IRect = {
    center: IPoint,
    width: number,
    height: number,
    left: number,
    right: number,
    top: number,
    bottom: number
}

export class Rect {

    /**
     * is one rect contains another?
     */
    static isIn(is: IRect, In: IRect) {
        return (
            is.left >= In.left &&
            is.right <= In.right &&
            is.top >= In.top &&
            is.bottom <= In.bottom

        )
    }

    /**
     * Generate IRect from width, height and optionally center
     */
    static fromSizesAndCenter(width: number, height: number, center?: IPoint): IRect {
        const halfWidth = width / 2
        const halfHeight = height / 2
        center = center || [halfWidth, halfHeight]
        return {
            center,
            width,
            height,
            left: center[0] - halfWidth,
            right: center[0] + halfWidth,
            top: center[1] - halfHeight,
            bottom: center[1] + halfHeight
        }
    }
}