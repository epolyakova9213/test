import {IPoint} from "@/infra/game/controller/contracts";
import {GameState} from "@/infra/game/controller/game.state";
import {GameController} from "@/infra/game/controller/game.controller";
import {Matrix} from "@/infra/game/controller/math/matrix";
import {IRect, Rect} from "@/infra/game/controller/math/rect";

export class GameRect {
    g: SVGGElement
    path: SVGPathElement
    isSpawning = true
    state: GameState
    center: IPoint = [this.gameController.state.defaultWidth / 2, this.gameController.state.defaultHeight / 2]

    constructor(public gameController: GameController, public spawnCenter: IPoint) {
        this.state = this.gameController.state
        this.state.animationQueue.push(this.init)
    }

    get rect(): IRect {
        return Rect.fromSizesAndCenter(
            this.gameController.state.defaultWidth,
            this.gameController.state.defaultHeight,
            this.center
        )
    }

    init = () => {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add('rect')

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDAttrBySides(
            this.gameController.state.defaultWidth,
            this.gameController.state.defaultHeight
        ))
        this.g.appendChild(this.path)

        this.state.mainLayer.appendChild(this.g)

        this.spawn()
    }

    goto = (newCenter: IPoint = this.center) => {
        this.center = newCenter
        this.g.setAttribute('transform', Matrix.toStyle(Matrix.translateIdentity(...newCenter)))

    }

    getDAttrBySides(width: number, height: number) {
        return `M0,0m${-width / 2},${-height / 2}h${width}v${height}h${-width}v${-height}`
    }

    spawn = () => {
        this.goto()

        let cycles = 300 // 60 frames
        let deltaX = this.spawnCenter[0] / cycles
        let deltaY = this.spawnCenter[1] / cycles

        const nextStep = () => {
            this.goto([
                Math.min(this.center[0] + deltaX, this.spawnCenter[0]),
                Math.min(this.center[1] + deltaY, this.spawnCenter[1])
            ])

            if (this.center[0] !== this.spawnCenter[0] || this.center[1] !== this.spawnCenter[1]) {
                this.state.animationQueue.push(nextStep)
            } else {
                this.isSpawning = false
            }
        }

        this.state.animationQueue.push(nextStep)
    }

    adjust(fieldSizes: IRect) {
        if (this.isSpawning) {
            this.spawnCenter[0] = Math.min(this.spawnCenter[0], fieldSizes.right - this.gameController.state.defaultWidth / 2)
            this.spawnCenter[1] = Math.min(this.spawnCenter[1], fieldSizes.bottom - this.gameController.state.defaultHeight / 2)
        }
        this.center[0] = Math.min(this.center[0], fieldSizes.right - this.gameController.state.defaultWidth / 2)
        this.center[1] = Math.min(this.center[1], fieldSizes.bottom - this.gameController.state.defaultHeight / 2)
    }

    dispose() {
        this.state.mainLayer.removeChild(this.g)
    }
}