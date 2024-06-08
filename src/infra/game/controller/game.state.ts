import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {IRect, Rect} from "@/infra/game/controller/math/rect";

export class GameState {
    defaultWidth = 20
    defaultHeight = 20

    animationQueue: AnimationQueue

    mainLayer: SVGSVGElement
    animationLayer: SVGSVGElement

    get isValid() {
        return !!(this.mainLayer)
    }

    fieldSizes: undefined | { fieldRect: IRect, domRect: DOMRect }

    constructor() {
        this.init()
    }

    init() {
        this.animationQueue = new AnimationQueue()
    }

    dispose() {
        this.animationQueue.dispose()
    }

}