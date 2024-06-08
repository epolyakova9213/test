'use client'

import {IDebounced} from "@/infra/game/controller/contracts";

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