import {Matrix} from "@/infra/game/controller/math/matrix";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {IPoint, Point} from "@/infra/game/controller/math/point";
import styles from './svg-rect.module.scss'

export type ISpaceProps = {
    center: IPoint,
    width: number,
    height: number
}

/**
 * Base game rect.
 * Rect is draggable and can regulate itself within the parent. Store size and position properties
 *
 * In theory, there should be inheritance from an even more basic figure. But within the scope of the task this is impractical
 */
export class SvgRect {
    /**
     * A group that unites path and (It was originally supposed - image as detached tag) image
     */
    g: SVGGElement

    /**
     * Path instead of rect tag.
     * Using path it is easier to operate with the center of the figure
     */
    path: SVGPathElement

    /**
     * Using as flag and as storing object of current dragging state
     */
    isDragging: undefined | {
        // Where is dragging start
        dragStart: IPoint,
        // current mouse position
        mousePosition: IPoint | undefined,
        // offset of mouse position from center of figure
        innerOffset: IPoint,
    } = undefined

    constructor(public spaceProps: ISpaceProps) {
        this.init()
    }

    /**
     * Generate SVG Layout
     */
    init() {
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        this.g.classList.add(styles.rect)
        this.g.addEventListener('mousedown', this.onMouseDownBound)

        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.path.setAttribute('d', this.getDAttrBySides(
            this.spaceProps.width,
            this.spaceProps.height
        ))
        this.g.appendChild(this.path)
    }

    /**
     * Place SVG Layout on the given layer
     */
    setOnLayer = (layer: SVGSVGElement) => {
        layer.appendChild(this.g)
    }

    /**
     * IRect by space properties
     */
    get rect(): IRect {
        return Rect.fromSizesAndCenter(
            this.spaceProps.width,
            this.spaceProps.height,
            this.spaceProps.center
        )
    }

    /**
     * Transform rect to new center position or to current center position
     */
    goto = (newCenter: IPoint = this.spaceProps.center) => {
        this.spaceProps.center = newCenter
        this.g.setAttribute('transform', Matrix.toStyle(Matrix.translateIdentity(...newCenter)))
    }

    /**
     * <path d='...'> attribute
     */
    getDAttrBySides(width: number, height: number) {
        return `M0,0m${-width / 2},${-height / 2}h${width}v${height}h${-width}v${-height}`
    }

    /**
     * layer that holds out SVG Layout
     */
    get parentLayer() {
        return this.g.parentNode
    }

    /**
     * Place the center of the figure so that the figure does not extend beyond the passed field
     */
    adjust(fieldSizes: IRect) {
        this.spaceProps.center[0] = Math.min(this.spaceProps.center[0], fieldSizes.right - this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.min(this.spaceProps.center[1], fieldSizes.bottom - this.spaceProps.height / 2)
        this.spaceProps.center[0] = Math.max(this.spaceProps.center[0], fieldSizes.left + this.spaceProps.width / 2)
        this.spaceProps.center[1] = Math.max(this.spaceProps.center[1], fieldSizes.top + this.spaceProps.height / 2)

    }

    /**
     * start dragging
     */
    onMouseDown(event: MouseEvent) {
        if (!event.target || !this.g.contains(event.target as Node)) return

        const domRect = (this.parentLayer as SVGSVGElement)?.getBoundingClientRect()
        if (!domRect) return

        // calculate offset of mouse from figure center
        let innerOffset = [event.offsetX, event.offsetY]
        innerOffset = Point.sub(innerOffset, this.spaceProps.center)

        // drag control events
        document.addEventListener('mouseup', this.onMouseUpBound)
        document.addEventListener('mousemove', this.onMouseMoveBound)

        // store dragging data to those events
        this.isDragging = {
            dragStart: [event.offsetX, event.offsetY],
            mousePosition: this.spaceProps.center,
            innerOffset,
        }
    }

    onMouseDownBound = this.onMouseDown.bind(this)

    /**
     * stop the dragging
     */
    onMouseUp() {
        document.removeEventListener('mouseup', this.onMouseUpBound)
        document.removeEventListener('mousemove', this.onMouseMoveBound)
    }

    onMouseUpBound = this.onMouseUp.bind(this)

    /**
     * dragging in process
     */
    onMouseMove(event: MouseEvent) {
        // only if dragging
        if (!this.isDragging) return

        // only if dragging actually was. There is a bug of browsers when mouse move event was generated
        // but offset of mouse equals to zero
        if (!event.movementX && !event.movementY) return

        // our parent
        const domRect = (this.parentLayer as SVGSVGElement)?.getBoundingClientRect()
        if (!domRect) return

        // IRect of parent sizes
        const fieldRect = Rect.fromSizesAndCenter(domRect.width, domRect.height)

        // despite the fact that there is a class AnimationQueue here i use raf because
        // the base figure is assumed to know nothing about the world outside it
        requestAnimationFrame(() => {
                // mousePosition could be deleted by mouseup listener
                if (this.isDragging?.mousePosition) {
                    // new center - is difference between mouse position and offset of mouse position from center that was stored
                    this.spaceProps.center = Point.sub(this.isDragging.mousePosition, this.isDragging.innerOffset!)
                    // need to check if new position is not in parent sizes
                    if (!Rect.isIn(this.rect, fieldRect)) {
                        // then align ourselves
                        this.adjust(fieldRect)
                    }
                    // finally, move ourselves
                    this.goto()
                    this.isDragging!.mousePosition = undefined
                }
            }
        )

        this.isDragging.mousePosition = Point.sub([event.clientX, event.clientY], [domRect.left, domRect.top])
    }

    onMouseMoveBound = this.onMouseMove.bind(this)

    dispose() {
        (this.parentLayer as SVGSVGElement).removeChild(this.g)
        this.onMouseUpBound()
        this.g.removeEventListener('mousedown', this.onMouseDown)
    }
}

