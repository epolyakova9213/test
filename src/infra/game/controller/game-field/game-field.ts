import {IRect, Rect} from "@/infra/game/controller/math/rect";
import styles from './game-field.module.scss'


type IResizeSubscribeArgument = {
    domRect: DOMRect,
    fieldRect: IRect
}

interface IResizeSubscriber {
    (args: IResizeSubscribeArgument): void
}

export class GameField {
    mainLayer: SVGSVGElement
    animationLayer: SVGSVGElement

    observer: ResizeObserver

    domRect: DOMRect = new DOMRect(0, 0, 0, 0)

    subscribers: IResizeSubscriber[] = []

    get fieldRect() {
        return Rect.fromSizesAndCenter(this.domRect.width, this.domRect.height)
    }

    constructor(public container: HTMLDivElement) {
        this.init()
    }

    resizesSubscribe(f: IResizeSubscriber) {
        this.subscribers.push(f)
    }

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
        this.domRect = this.container.getBoundingClientRect()
        this.subscribers.forEach(f => f({domRect: this.domRect, fieldRect: this.fieldRect}))
    }

    dispose() {
        this.observer?.unobserve(this.container)
    }

}