import {GameRect} from "@/infra/game/controller/rect/gameRect";
import {GameState} from "@/infra/game/controller/game.state";
import {debounce} from "@/infra/game/controller/utils";
import {Rect} from "@/infra/game/controller/math/rect";

export class GameController {
    state: GameState
    observer: ResizeObserver

    rects: GameRect[] = []

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

        this.rects.push(new GameRect(this, [
            Math.min(sizes.width - this.state.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.state.defaultHeight / 2, event.offsetY)
        ]))
    }

    onResize = () => {
        this.state.isFieldResizing = true
        const field = this.state.fieldSizes!

        for (let rect of this.rects) {
            if (!Rect.isIn(rect.rect, field)) {
                rect.adjust(field)
                if (!rect.isSpawning) {
                    this.state.animationQueue.push(rect.goto)
                }
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