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

    get fieldSizes() {
        if (!this.isValid) return undefined
        const domRect = this.mainLayer.getBoundingClientRect()
        return {
            rect: Rect.fromSizesAndCenter(domRect.width, domRect.height),
            domRect: domRect
        }
    }

    get fieldSizesRestricted(): IRect | undefined {
        if (!this.isValid) return undefined
        const fieldSizes = this.fieldSizes!
        const halfWidth = this.defaultWidth / 2
        const halfHeight = this.defaultHeight / 2
        return Rect.fromSizesAndCenter(
            fieldSizes.rect.width - this.defaultWidth,
            fieldSizes.rect.height - this.defaultHeight,
            fieldSizes.rect.center,
        )
    }

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