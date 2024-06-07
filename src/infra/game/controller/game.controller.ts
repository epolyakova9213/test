import {Rect} from "@/infra/game/controller/rect/rect";
import {GameState} from "@/infra/game/controller/game.state";
import {AnimationQueue} from "@/infra/game/controller/animation-queue";

export class GameController {
    state: GameState

    rects: any[] = []

    init(svg: typeof this.state.mainLayer) {
        if (this.state) return

        this.state = new GameState()
        this.state.mainLayer = svg

        this.state.mainLayer.addEventListener('dblclick', this.onDblClick)
    }

    onDblClick = (event: MouseEvent) => {
        if (!this.state.isValid) return
        if (event.currentTarget !== this.state.mainLayer) return

        const sizes = this.state.fieldSizes!

        this.rects.push(new Rect(this, [
            Math.min(sizes.width - this.state.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.state.defaultHeight / 2, event.offsetY)
        ]))
    }

    dispose = () => {
        this.state.mainLayer.removeEventListener('dblclick', this.onDblClick)
        this.rects.forEach(r => r.dispose())
        this.rects = []
        this.state.dispose()
    }
}