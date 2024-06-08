export type IPoint = [number, number]

export class Point {
    static sum(p1: IPoint, p2: IPoint): IPoint {
        return [
            p1[0] + p2[0],
            p1[1] + p2[1]
        ]
    }

    static diff(isGreater: IPoint, Than: IPoint): IPoint {
        return [
            isGreater[0] - Than[0],
            isGreater[1] - Than[1]
        ]
    }

    static min(p1: IPoint, p2: IPoint): IPoint {
        return [
            Math.min(p1[0], p2[0]),
            Math.min(p1[1], p2[1])
        ]
    }

    static isEqual(p1: IPoint, p2: IPoint): boolean {
        return p1[0] === p2[0] && p1[1] === p2[1]
    }

    static scale(p: IPoint, factor: number): IPoint {
        return [
            p[0] * factor,
            p[1] * factor,
        ]
    }
}