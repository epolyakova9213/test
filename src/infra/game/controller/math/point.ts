/**
 * 2D point or vector
 */
export type IPoint = [number, number]

export class Point {

    /**
     * Sum two vectors
     */
    static sum(p1: IPoint, p2: IPoint): IPoint {
        return [
            p1[0] + p2[0],
            p1[1] + p2[1]
        ]
    }

    /**
     * Subtract second vector from the first one
     */
    static sub(isGreater: IPoint, Than: IPoint): IPoint {
        return [
            isGreater[0] - Than[0],
            isGreater[1] - Than[1]
        ]
    }

    /**
     * Can be thought of as finding the top left corner of a rectangle by the top left and bottom right
     */
    static min(p1: IPoint, p2: IPoint): IPoint {
        return [
            Math.min(p1[0], p2[0]),
            Math.min(p1[1], p2[1])
        ]
    }

    /**
     * is coords of two points equal?
     */
    static isEqual(p1: IPoint, p2: IPoint): boolean {
        return p1[0] === p2[0] && p1[1] === p2[1]
    }

    /**
     * scale vector in two dimensions respectively
     */
    static scale(p: IPoint, factor: number): IPoint {
        return [
            p[0] * factor,
            p[1] * factor,
        ]
    }
}