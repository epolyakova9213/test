import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {IRect, Rect} from "@/infra/game/controller/math/rect";

export class GameState {
    defaultWidth = 20
    defaultHeight = 20

    animationQueue: AnimationQueue

    container: HTMLDivElement
    mainLayer: SVGSVGElement
    _animationLayer: SVGSVGElement

    set animationLayer(node: typeof this._animationLayer) {
        this._animationLayer = node
    }

    get animationLayer() {
        return this._animationLayer || this.mainLayer
    }

    get isValid() {
        return !!(this.mainLayer && this.fieldSizes)
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