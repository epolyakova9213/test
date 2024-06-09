import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {Field} from "@/infra/game/controller/field/field";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {SvgRect} from "@/infra/game/controller/rect/svg.rect";
import {ImagePatterns} from "@/infra/game/controller/image-patterns/image-patterns";
import {GameRect} from "@/infra/game/controller/game-logic/game.rect";

export class GameLogic {
    width = 50
    height = 50
    imagePatterns = new ImagePatterns()
    animationQueue = new AnimationQueue()
    gameRects: Set<GameRect> = new Set()

    urlsPatterns = [
        `/1.png`,
        `/2.png`,
    ]

    constructor(public gameField: Field) {
        this.init()
    }

    init() {
        this.gameField.resizesSubscribe(this.onFieldResize)
        this.gameField.container.addEventListener('dblclick', this.onDblClick)
        const sizes = {
            width: this.width,
            height: this.height,
        }
        for (let layer of [this.gameField.mainLayer, this.gameField.animationLayer]) {
            for (let url of this.urlsPatterns) {
                this.imagePatterns.addPattern(layer, url, sizes)
            }
        }


        let randomObjNum = 10
        randomObjNum &&
        setTimeout(() => {
            this.generateRandomObjects(randomObjNum)
        }, 500)
    }

    onFieldResize = ({fieldRect}: { domRect: DOMRect, fieldRect: IRect }) => {
        this.gameRects.forEach((gameRect) => {
            console.log('adjust')
            if (!Rect.isIn(gameRect.rect, fieldRect)) {
                gameRect.adjust(fieldRect)
                if (!gameRect.isSpawning) {
                    this.animationQueue.push(gameRect.goto)
                }
            }
        })
    }


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

        const url = this.urlsPatterns[Math.floor(Math.random() * this.urlsPatterns.length)]
        rect.g.style.fill = `url(#${url})`

        this.animationQueue.push(() => {
            rect.setOnLayer(this.gameField.animationLayer)
            rect.spawn()
        })

    }

    switchGameRectLayer(rect: SvgRect) {
        if (rect.parentLayer !== this.gameField.animationLayer) {
            this.gameField.animationLayer.appendChild(rect.g)
        } else if (rect.parentLayer !== this.gameField.mainLayer) {
            this.gameField.mainLayer.appendChild(rect.g)
        }
    }

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