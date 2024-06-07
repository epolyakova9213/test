import {IPoint} from "@/infra/game/controller/contracts";
import {GameState} from "@/infra/game/controller/game.state";
import {Matrix} from "@/infra/game/controller/utils";
import {identityMatrix} from "@/infra/game/controller/constants";
import {GameController} from "@/infra/game/controller/game.controller";

export class Rect {
    g: SVGGElement
    path: SVGPathElement
    isSpawning = true
    state: GameState
    center: IPoint = [0, 0]

    constructor(public gameController: GameController, public spawnCenter: IPoint) {
        this.state = this.gameController.state
        this.state.animationQueue.push(this.init)
    }

    init = () => {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add('rect')

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDBySides(
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

    getDBySides(width: number, height: number) {
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

    stopSpawn() {

    }

    dispose() {
        this.state.mainLayer.removeChild(this.g)
    }
}