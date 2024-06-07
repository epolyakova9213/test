import {Rect} from "@/controller/game/rect/rect";
import {GameState} from "@/controller/game/game.state";

export class GameController {
    private svg: SVGSVGElement
    private state: GameState

    rects: any[] = []

    get isReady() {
        return !!(this.svg)
    }

    init(svg: typeof this.svg) {
        if (this.svg) return
        this.svg = svg

        this.state = new GameState()

        this.svg.addEventListener('dblclick', this.onDblClick)
    }

    onDblClick = (event: MouseEvent) => {
        this.rects.push(
            new Rect(this.svg, this.state,[event.offsetX, event.offsetY])
        )
    }

    dispose = () => {
        this.svg.removeEventListener('dblclick', this.onDblClick)
        this.rects.forEach(r => r.dispose())
        this.rects = []
    }
}