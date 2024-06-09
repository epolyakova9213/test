import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {Field} from "@/infra/game/controller/field/field";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {SvgRect} from "@/infra/game/controller/rect/svg.rect";
import {ImagePatterns} from "@/infra/game/controller/image-patterns/image-patterns";
import {GameRect} from "@/infra/game/controller/game-logic/game.rect";

/**
 * Main logic of game
 */
export class GameLogic {
    /**
     * default sizes for every figure
     */
    width = 50
    height = 50

    /**
     * place the image pattern to dom.
     * I choose fill the rect with image instead of creating of another <image> tag
     */
    imagePatterns = new ImagePatterns()

    /**
     * multiple raf is worse than one raf. Function manager for next frame rendering
     */
    animationQueue = new AnimationQueue()

    /**
     * our objects
     */
    gameRects: Set<GameRect> = new Set()

    /**
     * images urls for filling rect
     */
    urlsPatterns = [
        `/1.png`,
        `/2.png`,
    ]

    constructor(public gameField: Field) {
        this.init()
    }

    init() {
        // resize subscribe
        this.gameField.resizesSubscribe(this.onFieldResize)
        // dblclick subscribe
        this.gameField.container.addEventListener('dblclick', this.onDblClick)
        const sizes = {
            width: this.width,
            height: this.height,
        }

        // add image patterns to DOM
        for (let layer of [this.gameField.mainLayer, this.gameField.animationLayer]) {
            for (let url of this.urlsPatterns) {
                this.imagePatterns.addPattern(layer, url, sizes)
            }
        }

        // generate random objects in setTimeout because field is not prepare yet
        // (because there is no state manager for the project)
        let randomObjNum = 10
        randomObjNum &&
        setTimeout(() => {
            this.generateRandomObjects(randomObjNum)
        }, 500)
    }

    /**
     * Resize event listener.
     * We check each rectangle to make sure it fits within the field dimensions.
     * Then we align it along the edge of the field.
     * If we shift the relative sizes, then a case is possible when the center is in the border of the field,
     * and the edge of the rectangle goes beyond the border
     */
    onFieldResize = ({fieldRect}: { domRect: DOMRect, fieldRect: IRect }) => {
        this.gameRects.forEach((gameRect) => {
            if (!Rect.isIn(gameRect.rect, fieldRect)) {
                gameRect.adjust(fieldRect)
                if (!gameRect.isSpawning) {
                    this.animationQueue.push(gameRect.goto)
                }
            }
        })
    }


    /**
     * dblclick event listener. Create new GameRect
     * @param event
     */
    onDblClick = (event: MouseEvent) => {
        const sizes = this.gameField.fieldRect

        const rect = new GameRect({
                width: this.width,
                height: this.height,
                center: [this.width / 2, this.height / 2],
            }, [
                Math.max(Math.min(sizes.width - this.width / 2, event.offsetX), this.width / 2),
                Math.max(Math.min(sizes.height - this.height / 2, event.offsetY), this.height / 2)
            ],
            this
        )

        this.gameRects.add(rect)

        // fill rect with random image pattern
        const url = this.urlsPatterns[Math.floor(Math.random() * this.urlsPatterns.length)]
        rect.g.style.fill = `url(#${url})`

        // set to DOM and start spawn in next frame
        this.animationQueue.push(() => {
            rect.setOnLayer(this.gameField.animationLayer)
            rect.spawn()
        })

    }

    /**
     * When rect is moving we place it on another animation layer for
     * rendering optimisation purpose
     */
    switchGameRectLayer(rect: SvgRect) {
        if (rect.parentLayer !== this.gameField.animationLayer) {
            this.gameField.animationLayer.appendChild(rect.g)
        } else if (rect.parentLayer !== this.gameField.mainLayer) {
            this.gameField.mainLayer.appendChild(rect.g)
        }
    }

    /**
     * Generate n rects with random position via 'dblclick' event
     */
    generateRandomObjects(n: number) {
        const domRect = this.gameField.fieldRect
        for (let i = 0; i < n; i++) {
            this.onDblClick({
                offsetX: Math.random() * domRect.width,
                offsetY: Math.random() * domRect.height,
                target: this.gameField.animationLayer,
            } as MouseEvent)
        }
    }

    dispose() {
        this.gameField.container.removeEventListener('dblclick', this.onDblClick)
        this.animationQueue.dispose()
        this.gameRects.forEach((value, gameRect) => gameRect.dispose())
        this.gameRects.clear()
    }
}