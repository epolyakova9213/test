import {GameState} from "@/infra/game/controller/game.state";
import {GameController} from "@/infra/game/controller/game.controller";
import {Matrix} from "@/infra/game/controller/math/matrix";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {IPoint, Point} from "@/infra/game/controller/math/point";

export class GameRect {
    g: SVGGElement
    path: SVGPathElement
    isSpawning = true
    isDragging: undefined | {
        dragStart: IPoint,
        mousePosition: IPoint | undefined
    } = undefined
    state: GameState
    center: IPoint = [this.gameController.state.defaultWidth / 2, this.gameController.state.defaultHeight / 2]
    frameTransform: IPoint | undefined = undefined

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
        this.g.addEventListener('mousedown', this.onMouseDown)

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDAttrBySides(
            this.gameController.state.defaultWidth,
            this.gameController.state.defaultHeight
        ))
        this.g.appendChild(this.path)

        this.state.animationLayer.appendChild(this.g)

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

        let cycles = 60 // 60 frames
        const delta = Point.scale(Point.diff(this.spawnCenter, this.center), cycles ** -1)
        const nextStep = () => {
            if (!this.isSpawning) return
            this.goto(Point.min(Point.sum(this.center, delta), this.spawnCenter))

            if (!Point.isEqual(this.center, this.spawnCenter)) {
                this.state.animationQueue.push(nextStep)
            } else {
                this.stopSpawning()
                this.switchLayers()
            }
        }

        this.state.animationQueue.push(nextStep)
    }

    stopSpawning() {
        this.isSpawning = false
        this.spawnCenter = this.center
    }

    switchLayers = () => {
        if (this.g.parentNode !== this.gameController.state.animationLayer) {
            this.gameController.state.animationLayer.appendChild(this.g)
        } else if (this.g.parentNode !== this.gameController.state.mainLayer) {
            this.gameController.state.mainLayer.appendChild(this.g)
        }
    }

    adjust(fieldSizes: IRect) {
        if (this.isSpawning) {
            this.spawnCenter[0] = Math.min(this.spawnCenter[0], fieldSizes.right - this.gameController.state.defaultWidth / 2)
            this.spawnCenter[1] = Math.min(this.spawnCenter[1], fieldSizes.bottom - this.gameController.state.defaultHeight / 2)
            this.spawnCenter[0] = Math.max(this.spawnCenter[0], fieldSizes.left + this.gameController.state.defaultWidth / 2)
            this.spawnCenter[1] = Math.max(this.spawnCenter[1], fieldSizes.top + this.gameController.state.defaultHeight / 2)
        }
        this.center[0] = Math.min(this.center[0], fieldSizes.right - this.gameController.state.defaultWidth / 2)
        this.center[1] = Math.min(this.center[1], fieldSizes.bottom - this.gameController.state.defaultHeight / 2)
        this.center[0] = Math.max(this.center[0], fieldSizes.left + this.gameController.state.defaultWidth / 2)
        this.center[1] = Math.max(this.center[1], fieldSizes.top + this.gameController.state.defaultHeight / 2)

    }

    onMouseDown = (event: MouseEvent) => {
        if (!event.target || !this.g.contains(event.target as Node)) return

        if (this.isSpawning) {
            this.stopSpawning()
        } else {
            this.gameController.state.animationQueue.push(this.switchLayers)
        }

        const domRect = this.gameController.state.fieldSizes!.domRect
        this.isDragging = {
            dragStart: Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top]),
            mousePosition: Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top])
        }
        document.addEventListener('mouseup', this.onMouseUp)
        document.addEventListener('mousemove', this.onMouseMove)
    }

    onMouseUp = () => {
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
        this.gameController.state.animationQueue.push(this.switchLayers)
    }
    onMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) return
        if (!event.movementX && !event.movementY) return


        const fieldSizes = this.gameController.state.fieldSizes!

        this.gameController.state.animationQueue.push(() => {
            if (this.isDragging?.mousePosition) {
                this.center = this.isDragging.mousePosition
                if (!Rect.isIn(this.rect, fieldSizes.fieldRect)) {
                    this.adjust(fieldSizes.fieldRect)
                }
                this.goto()
                this.isDragging!.mousePosition = undefined
            }
        })

        this.isDragging.mousePosition = Point.diff([event.clientX, event.clientY], [fieldSizes.domRect.left, fieldSizes.domRect.top])
    }

    dispose() {
        this.state.mainLayer.removeChild(this.g)
        this.onMouseUp()
        this.g.removeEventListener('mousedown', this.onMouseDown)
    }
}