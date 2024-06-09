/**
 * Multiple raf is worse than one raf.
 * Here we manage functions for one next raf
 */
export class AnimationQueue {
    queue: Function[] = []
    id: number | undefined

    push(f: Function, previousClear?: boolean) {
        if (previousClear) {
            this.queue = []
            this.dispose()
        }

        if (!this.queue.length) {
            this.raf()
        }

        this.queue.push(f)
    }

    raf() {
        this.id = requestAnimationFrame(() => {
            this.id = undefined
            const queue = this.queue
            this.queue = []

            queue.forEach(f => f())
        })
    }

    dispose() {
        this.id && cancelAnimationFrame(this.id)
    }
}