export type IMatrix = [number, number, number, number, number, number]

export class Matrix {

    /**
     * identity matrix is matrix that move CS to itself position
     */
    static translateIdentity(dx: number, dy: number) {
        return [1, 0, 0, 1, dx, dy] as IMatrix
    }

    /**
     * IMatrix as css "transform" value
     */
    static toStyle(m: IMatrix) {
        return `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`
    }
}