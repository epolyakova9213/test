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
    static isIn(is: IRect, In: IRect) {
        return (
            is.left >= In.left &&
            is.right <= In.right &&
            is.top >= In.top &&
            is.bottom <= In.bottom

        )
    }

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

    /**
     * @param corner - only left top now
     */
    static fromCornerPosition(width: number, height: number, corner?: IPoint): IRect {
        corner = corner || [0, 0]
        return {
            left: corner[0],
            top: corner[1],
            width,
            height,
            right: corner[0] + width,
            bottom: corner[1] + height,
            center: [
                corner[0] + width / 2,
                corner[1] + height / 2
            ]
        }
    }
}