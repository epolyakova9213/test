'use client'

import {IMatrix} from "@/infra/game/controller/contracts";
import {clearTimeout} from "node:timers";

export class Matrix {

    static translateIdentity(dx: number, dy: number) {
        return [1, 0, 0, 1, dx, dy] as IMatrix
    }

    static toStyle(m: IMatrix) {
        return `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`
    }
}

interface IDebounced<T extends Function = any> {
    (f: () => void, delay: number): (() => void);
}

export const debounce: IDebounced = (f, delay) => {
    let id: NodeJS.Timeout | undefined

    function clearTimeoutLocal() {
        if (id) {
            window.clearTimeout(id as number)
            id = undefined
        }
    }

    return () => {
        clearTimeoutLocal()

        id = setTimeout(() => {
            clearTimeoutLocal()
            f()
        }, delay)
    }
}