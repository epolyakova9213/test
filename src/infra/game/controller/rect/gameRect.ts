import {Matrix} from "@/infra/game/controller/math/matrix";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {IPoint, Point} from "@/infra/game/controller/math/point";

type ISpaceProps = {
    center: IPoint,
    width: number,
    height: number
}

type ISubscribeEventType = 'mousedown' | 'mouseup'

export class GameRect {
    g: SVGGElement
    path: SVGPathElement
    isSpawning = true
    isDragging: undefined | {
        dragStart: IPoint,
        mousePosition: IPoint | undefined
    } = undefined

    subscribers: Record<ISubscribeEventType, ((rect: GameRect) => void)[]> = {
        mousedown: [],
        mouseup: []
    }

    subscribeOn(eventType: keyof typeof this.subscribers, f: (gameRect: GameRect) => void) {
        this.subscribers[eventType].push(f)
    }

    constructor(public spaceProps: ISpaceProps, public spawnCenter: IPoint) {
    }


    get rect(): IRect {
        return Rect.fromSizesAndCenter(
            this.spaceProps.width,
            this.spaceProps.height,
            this.spaceProps.center
        )
    }

    setOnLayer = (layer: SVGSVGElement) => {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add('rect')
        this.g.addEventListener('mousedown', this.onMouseDown)

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDAttrBySides(
            this.spaceProps.width,
            this.spaceProps.height
        ))
        this.g.appendChild(this.path)

        layer.appendChild(this.g)
    }

    goto = (newCenter: IPoint = this.spaceProps.center) => {
        this.spaceProps.center = newCenter
        this.g.setAttribute('transform', Matrix.toStyle(Matrix.translateIdentity(...newCenter)))
    }

    getDAttrBySides(width: number, height: number) {
        return `M0,0m${-width / 2},${-height / 2}h${width}v${height}h${-width}v${-height}`
    }

    get parentLayer() {
        return this.g.parentNode
    }

    adjust(fieldSizes: IRect) {
        if (this.isSpawning) {
            this.spawnCenter[0] = Math.min(this.spawnCenter[0], fieldSizes.right - this.spaceProps.width / 2)
            this.spawnCenter[1] = Math.min(this.spawnCenter[1], fieldSizes.bottom - this.spaceProps.height / 2)
            this.spawnCenter[0] = Math.max(this.spawnCenter[0], fieldSizes.left + this.spaceProps.width / 2)
            this.spawnCenter[1] = Math.max(this.spawnCenter[1], fieldSizes.top + this.spaceProps.height / 2)
        }
        this.spaceProps.center[0] = Math.min(this.spaceProps.center[0], fieldSizes.right - this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.min(this.spaceProps.center[1], fieldSizes.bottom - this.spaceProps.height / 2)
        this.spaceProps.center[0] = Math.max(this.spaceProps.center[0], fieldSizes.left + this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.max(this.spaceProps.center[1], fieldSizes.top + this.spaceProps.height / 2)

    }

    onMouseDown = (event: MouseEvent) => {
        if (!event.target || !this.g.contains(event.target as Node)) return

        const domRect = (this.parentLayer as SVGSVGElement)?.getBoundingClientRect()
        if (!domRect) return

        this.isDragging = {
            dragStart: Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top]),
            mousePosition: Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top])
        }
        document.addEventListener('mouseup', this.onMouseUp)
        document.addEventListener('mousemove', this.onMouseMove)

        this.subscribers.mousedown.forEach(f => f(this))
    }

    onMouseUp = () => {
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
        this.subscribers.mouseup.forEach(f => f(this))
    }
    onMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) return
        if (!event.movementX && !event.movementY) return

        const domRect = (this.parentLayer as SVGSVGElement)?.getBoundingClientRect()
        if (!domRect) return

        const fieldRect = Rect.fromSizesAndCenter(domRect.width, domRect.height)

        requestAnimationFrame(() => {
                if (this.isDragging?.mousePosition) {
                    this.spaceProps.center = this.isDragging.mousePosition
                    if (!Rect.isIn(this.rect, fieldRect)) {
                        this.adjust(fieldRect)
                    }
                    this.goto()
                    this.isDragging!.mousePosition = undefined
                }
            }
        )

        this.isDragging.mousePosition = Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top])
    }

    dispose() {
        (this.parentLayer as SVGSVGElement).removeChild(this.g)
        this.onMouseUp()
        this.g.removeEventListener('mousedown', this.onMouseDown)
    }
}

