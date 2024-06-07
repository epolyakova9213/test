import {AnimationQueue} from "@/infra/game/controller/animation-queue";

export class GameState {
    defaultWidth = 20
    defaultHeight = 20

    animationQueue: AnimationQueue

    mainLayer: SVGSVGElement
    animationLayer: SVGSVGElement

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