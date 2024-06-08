export type IPoint = [number, number]

export class Point {
    static sum(p1: IPoint, p2: IPoint) {
        return [
            p1[0] + p2[0],
            p1[1] + p2[1]
        ]
    }
}