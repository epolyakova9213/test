import {Rect} from "@/infra/game/controller/rect/rect";
import {GameState} from "@/infra/game/controller/game.state";
import {debounce} from "@/infra/game/controller/utils";

export class GameController {
    state: GameState
    observer: ResizeObserver

    rects: Rect[] = []

    init(svg: typeof this.state.mainLayer) {
        if (this.state) return

        this.state = new GameState()
        this.state.mainLayer = svg

        this.state.mainLayer.addEventListener('dblclick', this.onDblClick)
        this.observer = new ResizeObserver(this.onResize)
        this.observer.observe(this.state.mainLayer)
    }

    onDblClick = (event: MouseEvent) => {
        if (!this.state.isValid) return
        if (event.target !== this.state.mainLayer) return

        const sizes = this.state.fieldSizes!

        this.rects.push(new Rect(this, [
            Math.min(sizes.width - this.state.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.state.defaultHeight / 2, event.offsetY)
        ]))
    }

    onResize = () => {
        this.state.isFieldResizing = true
        this.state.animationQueue.push(stub, true)
        const fieldSizes = this.state.fieldSizes!
        const leftEdge = fieldSizes.width - this.state.defaultWidth / 2
        const bottomEdge = fieldSizes.height - this.state.defaultHeight / 2

        for (let rect of this.rects) {
            if (rect.center[0] > leftEdge || rect.center[1] > bottomEdge) {
                this.state.animationQueue.push(() => {
                    rect.goto([Math.min(rect.center[0], leftEdge), Math.min(rect.center[1], bottomEdge)])
                })
            }
        }
    }

    clearResizeFlag = () => {
        this.state.isFieldResizing = false
    }

    clearResizeFlagDebounced = debounce(this.clearResizeFlag, 100)


    dispose = () => {
        this.state.mainLayer.removeEventListener('dblclick', this.onDblClick)
        this.rects.forEach(r => r.dispose())
        this.rects = []
        this.state.dispose()
        this.observer && this.observer.unobserve(this.state.mainLayer)
    }
}

const stub = () => {
}