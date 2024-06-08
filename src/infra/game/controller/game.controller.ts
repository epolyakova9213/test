import {GameRect} from "@/infra/game/controller/rect/gameRect";
import {GameState} from "@/infra/game/controller/game.state";
import {Rect} from "@/infra/game/controller/math/rect";

export class GameController {
    state: GameState
    observer: ResizeObserver

    gameRects: GameRect[] = []

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

        const sizes = this.state.fieldSizes!.fieldRect

        this.gameRects.push(new GameRect(this, [
            Math.min(sizes.width - this.state.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.state.defaultHeight / 2, event.offsetY)
        ]))
    }

    onResize = () => {
        const domRect = this.state.mainLayer.getBoundingClientRect()
        const fieldRect = Rect.fromSizesAndCenter(domRect.width, domRect.height)
        this.state.fieldSizes = {domRect, fieldRect}

        for (let gameRect of this.gameRects) {
            if (!Rect.isIn(gameRect.rect, fieldRect)) {
                gameRect.adjust(fieldRect)
                if (!gameRect.isSpawning) {
                    this.state.animationQueue.push(gameRect.goto)
                }
            }
        }
    }

    generateRandom(n: number) {
        const domRect = this.state.fieldSizes!.fieldRect
        for (let i = 0; i < n; i++) {
            this.onDblClick({
                offsetX: Math.random() * domRect.width,
                offsetY: Math.random() * domRect.height,
                target: this.state.mainLayer,
            } as MouseEvent)
        }
    }

    dispose = () => {
        this.state.mainLayer.removeEventListener('dblclick', this.onDblClick)
        this.gameRects.forEach(r => r.dispose())
        this.gameRects = []
        this.state.dispose()
        this.observer && this.observer.unobserve(this.state.mainLayer)
    }
}