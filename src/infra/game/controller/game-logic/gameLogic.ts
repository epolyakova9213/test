import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {GameField} from "@/infra/game/controller/game-field/game-field";
import {GameState} from "@/infra/game/controller/game.state";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {GameRect} from "@/infra/game/controller/rect/gameRect";
import {Point} from "@/infra/game/controller/math/point";

export class GameLogic {
    animationQueue = new AnimationQueue()
    gameRects: GameRect[] = []

    constructor(public gameField: GameField, public gameState: GameState) {
        this.init()
    }

    init() {
        this.gameField.resizesSubscribe(this.onFieldResize)
        this.gameField.container.addEventListener('dblclick', this.onDblClick)
    }

    onFieldResize = ({fieldRect}: { domRect: DOMRect, fieldRect: IRect }) => {
        for (let gameRect of this.gameRects) {
            if (!Rect.isIn(gameRect.rect, fieldRect)) {
                gameRect.adjust(fieldRect)
                if (!gameRect.isSpawning) {
                    this.animationQueue.push(gameRect.goto)
                }
            }
        }
    }

    onDblClick = (event: MouseEvent) => {
        const sizes = this.gameField.fieldRect


        const rect = new GameRect(this,
            {
                width: this.gameState.defaultWidth,
                height: this.gameState.defaultHeight,
                center: [this.gameState.defaultWidth / 2, this.gameState.defaultHeight / 2]
            },
            [
                Math.min(sizes.width - this.gameState.defaultWidth / 2, event.offsetX),
                Math.min(sizes.height - this.gameState.defaultHeight / 2, event.offsetY)
            ])

        this.gameRects.push(rect)
        rect.subscribeOn('mousedown', this.onGameRectMouseDown)
        rect.subscribeOn('mouseup', this.onGameRectMouseUp)

        this.animationQueue.push(() => {
            rect.setOnLayer(this.gameField.animationLayer)
            this.spawnGameRect(rect)
        })

    }

    switchGameRectLayer(rect: GameRect) {
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

    spawnGameRect(rect: GameRect) {
        rect.goto()

        let cycles = 60 // 60 frames
        const delta = Point.scale(Point.diff(rect.spawnCenter, rect.spaceProps.center), cycles ** -1)
        const nextStep = () => {
            if (!rect.isSpawning) return
            rect.goto(Point.min(Point.sum(rect.spaceProps.center, delta), rect.spawnCenter))

            if (!Point.isEqual(rect.spaceProps.center, rect.spawnCenter)) {
                this.animationQueue.push(nextStep)
            } else {
                this.stopSpawnGameRect(rect)
                this.switchGameRectLayer(rect)
            }
        }

        this.animationQueue.push(nextStep)
    }

    onGameRectMouseDown = (rect: GameRect) => {
        if (rect.isSpawning) {
            this.stopSpawnGameRect(rect)
        } else {
            this.animationQueue.push(() => this.switchGameRectLayer(rect))
        }
    }

    onGameRectMouseUp = (rect: GameRect) => {
        this.animationQueue.push(() => this.switchGameRectLayer(rect))
    }

    stopSpawnGameRect(rect: GameRect) {
        rect.isSpawning = false
        rect.spawnCenter = rect.spaceProps.center
    }

    dispose() {
        this.gameField.container.removeEventListener('dblclick', this.onDblClick)
        this.animationQueue.dispose()
        this.gameRects.forEach(r => r.dispose())
        this.gameRects.length = 0
    }
}