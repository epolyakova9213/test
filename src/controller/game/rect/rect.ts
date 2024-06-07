import {IPoint} from "@/controller/game/contracts";
import {GameState} from "@/controller/game/game.state";
import {Matrix} from "@/controller/game/utils";
import {identityMatrix} from "@/controller/game/constants";

export class Rect {
    g: SVGGElement
    path: SVGPathElement
    isSpawning = false

    constructor(public svg: SVGSVGElement, public gameState: GameState, public center: IPoint) {
        this.init()
    }

    init() {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add('rect')

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDBySides(this.gameState.defaultWidth, this.gameState.defaultHeight))
        this.g.appendChild(this.path)

        this.svg.appendChild(this.g)

        this.spawn()
    }

    getDBySides(width: number, height: number) {
        return `M0,0m${-width / 2},${-height / 2}h${width}v${height}h${-width}v${-height}`
    }

    spawn() {
        this.isSpawning = true

        let position: IPoint = [0, 0]
        this.g.setAttribute('transform', Matrix.toStyle(identityMatrix))

        const go = () => {
            if (position[0] < this.center[0]) {
                position[0] += 1
            } else {
                position[0] = this.center[0]
            }

            if (position[1] < this.center[1]) {
                position[1] += 1
            } else {
                position[1] = this.center[1]
            }

            this.g.setAttribute('transform', Matrix.toStyle(Matrix.translateIdentity(...position)))

            if (position[0] !== this.center[0] || position[1] !== this.center[1]) {
                requestAnimationFrame(go)
            } else {
                this.isSpawning = false
            }
        }

        go()
    }

    dispose() {
        this.svg.removeChild(this.g)
    }
}