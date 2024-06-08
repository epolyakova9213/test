import {GameRect} from "@/infra/game/controller/rect/gameRect";
import {GameState} from "@/infra/game/controller/game.state";
import {Rect} from "@/infra/game/controller/math/rect";

export class GameController {
    state: GameState
    observer: ResizeObserver

    gameRects: GameRect[] = []

    init(container: typeof this.state.container) {
        if (this.state) return
        this.state = new GameState()
        this.state.container = container

        for (let i = 0; i < this.state.container.children.length; i++) {
            switch (i) {
                case 0:
                    this.state.mainLayer = this.state.container.children.item(i) as SVGSVGElement
                default:
                    this.state.animationLayer = this.state.container.children.item(i) as SVGSVGElement

            }
        }

        this.state.container.addEventListener('dblclick', this.onDblClick)
        this.observer = new ResizeObserver(this.onResize)
        this.observer.observe(this.state.container)
    }

    onDblClick = (event: MouseEvent) => {
        if (!this.state.isValid) return

        const sizes = this.state.fieldSizes!.fieldRect

        this.gameRects.push(new GameRect(this, [
            Math.min(sizes.width - this.state.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.state.defaultHeight / 2, event.offsetY)
        ]))
    }

    onResize = () => {
        const domRect = this.state.container.getBoundingClientRect()
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
                target: this.state.animationLayer,
            } as MouseEvent)
        }
    }

    dispose = () => {
        this.state.container.removeEventListener('dblclick', this.onDblClick)
        this.gameRects.forEach(r => r.dispose())
        this.gameRects = []
        this.state.dispose()
        this.observer && this.observer.unobserve(this.state.container)
    }
}