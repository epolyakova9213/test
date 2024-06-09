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
    isDragging: undefined | {
        dragStart: IPoint,
        newCenterPosition: IPoint | undefined,
        innerOffset: IPoint,
    } = undefined

    subscribers: Record<ISubscribeEventType, ((rect: GameRect) => void)[]> = {
        mousedown: [],
        mouseup: []
    }

    subscribeOn(eventType: keyof typeof this.subscribers, f: (gameRect: GameRect) => void) {
        this.subscribers[eventType].push(f)
    }

    constructor(public spaceProps: ISpaceProps) {
        this.init()
    }

    init() {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add('rect')
        this.g.addEventListener('mousedown', this.onMouseDown)

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDAttrBySides(
            this.spaceProps.width,
            this.spaceProps.height
        ))
        this.g.appendChild(this.path)
    }

    get rect(): IRect {
        return Rect.fromSizesAndCenter(
            this.spaceProps.width,
            this.spaceProps.height,
            this.spaceProps.center
        )
    }

    setOnLayer = (layer: SVGSVGElement) => {
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
        this.spaceProps.center[0] = Math.min(this.spaceProps.center[0], fieldSizes.right - this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.min(this.spaceProps.center[1], fieldSizes.bottom - this.spaceProps.height / 2)
        this.spaceProps.center[0] = Math.max(this.spaceProps.center[0], fieldSizes.left + this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.max(this.spaceProps.center[1], fieldSizes.top + this.spaceProps.height / 2)

    }

    onMouseDown = (event: MouseEvent) => {
        if (!event.target || !this.g.contains(event.target as Node)) return

        const domRect = (this.parentLayer as SVGSVGElement)?.getBoundingClientRect()
        if (!domRect) return

        const selfDomRect = this.g.getBoundingClientRect()
        let innerOffset = [event.offsetX, event.offsetY]
        innerOffset = Point.diff(innerOffset, this.spaceProps.center)

        console.log(innerOffset)

        this.isDragging = {
            dragStart: [event.offsetX, event.offsetY],
            newCenterPosition: this.spaceProps.center,
            innerOffset,
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
                if (this.isDragging?.newCenterPosition) {
                    this.spaceProps.center = Point.diff(this.isDragging.newCenterPosition, this.isDragging.innerOffset!)
                    if (!Rect.isIn(this.rect, fieldRect)) {
                        this.adjust(fieldRect)
                    }
                    this.goto()
                    this.isDragging!.newCenterPosition = undefined
                }
            }
        )

        this.isDragging.newCenterPosition = Point.diff([event.clientX, event.clientY], [domRect.left, domRect.top])
    }

    dispose() {
        (this.parentLayer as SVGSVGElement).removeChild(this.g)
        this.onMouseUp()
        this.g.removeEventListener('mousedown', this.onMouseDown)
    }
}

