import {Rect} from "@/infra/game/controller/math/rect";
import styles from './field.module.scss'
import {IResizeSubscriber} from "@/infra/game/controller/field/contracts";


export class Field {
    /**
     * layer that hold static objects
     */
    mainLayer: SVGSVGElement
    /**
     * layer that holds moving objects for optimization
     */
    animationLayer: SVGSVGElement

    /**
     * resize observer
     */
    observer: ResizeObserver

    /**
     * actual DOMRect
     */
    domRect: DOMRect = new DOMRect(0, 0, 0, 0)

    /**
     * resize subscribers.
     * the variable is needed because the project does not use a state manager
     */
    subscribers: IResizeSubscriber[] = []

    /**
     * IRect from the actual dom element sizes
     */
    get fieldRect() {
        return Rect.fromSizesAndCenter(this.domRect.width, this.domRect.height)
    }

    constructor(public container: HTMLDivElement) {
        this.init()
    }

    /**
     * subscribe on field resizing
     */
    resizesSubscribe(f: IResizeSubscriber) {
        this.subscribers.push(f)
    }

    /**
     * create layers, create resize observer
     */
    init() {

        this.container.classList.add(styles.container)

        this.mainLayer = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
        this.mainLayer.classList.add(styles.mainLayer)

        this.animationLayer = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
        this.animationLayer.classList.add(styles.animationLayer)

        this.observer = new ResizeObserver(this.onResize)
        this.observer.observe(this.container)

        this.container.appendChild(this.mainLayer)
        this.container.appendChild(this.animationLayer)
    }

    onResize = () => {
        // save actual DOM rect on every resize event
        this.domRect = this.container.getBoundingClientRect()
        // invoke all subscribers
        this.subscribers.forEach(f => f({domRect: this.domRect, fieldRect: this.fieldRect}))
    }

    dispose() {
        this.observer?.unobserve(this.container)
    }

}