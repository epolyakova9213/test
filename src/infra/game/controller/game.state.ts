import {AnimationQueue} from "@/infra/game/controller/animation-queue";

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

    get fieldSizes() {
        if (!this.isValid) return undefined
        return this.mainLayer.getBoundingClientRect()
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