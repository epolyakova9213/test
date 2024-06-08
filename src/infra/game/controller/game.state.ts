import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {IRect, Rect} from "@/infra/game/controller/math/rect";

export class GameState {
    defaultWidth = 20
    defaultHeight = 20

    animationQueue: AnimationQueue

    isFieldResizing = true

    mainLayer: SVGSVGElement
    animationLayer: SVGSVGElement

    get isValid() {
        return !!(this.mainLayer)
    }

    get fieldSizes(): IRect | undefined {
        if (!this.isValid) return undefined
        const rect = this.mainLayer.getBoundingClientRect()
        return Rect.fromSizesAndCenter(rect.width, rect.height)
    }

    get fieldSizesRestricted(): IRect | undefined {
        if (!this.isValid) return undefined
        const fieldSizes = this.fieldSizes!
        const halfWidth = this.defaultWidth / 2
        const halfHeight = this.defaultHeight / 2
        return Rect.fromSizesAndCenter(
            fieldSizes.width - this.defaultWidth,
            fieldSizes.height - this.defaultHeight,
            fieldSizes.center,
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