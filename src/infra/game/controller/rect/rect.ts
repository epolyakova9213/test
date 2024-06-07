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

    constructor(public gameController: GameController, public center: IPoint) {
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

    getDBySides(width: number, height: number) {
        return `M0,0m${-width / 2},${-height / 2}h${width}v${height}h${-width}v${-height}`
    }

    spawn = () => {
        this.g.setAttribute('transform', Matrix.toStyle(identityMatrix))

        let position: IPoint = [0, 0]
        let cycles = 60 // 60 frames
        let deltaX = this.center[0] / cycles
        let deltaY = this.center[1] / cycles

        const go = () => {
            position[0] = Math.min(position[0] + deltaX, this.center[0])
            position[1] = Math.min(position[1] + deltaY, this.center[1])
            this.g.setAttribute('transform', Matrix.toStyle(Matrix.translateIdentity(...position)))

            if (position[0] !== this.center[0] || position[1] !== this.center[1]) {
                this.state.animationQueue.push(go)
            } else {
                this.isSpawning = false
            }
        }

        this.state.animationQueue.push(go)
    }

    dispose() {
        this.state.mainLayer.removeChild(this.g)
    }
}