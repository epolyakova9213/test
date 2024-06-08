import {AnimationQueue} from "@/infra/game/controller/animation-queue";
import {GameField} from "@/infra/game/controller/game-field/game-field";
import {GameState} from "@/infra/game/controller/game.state";
import {IRect, Rect} from "@/infra/game/controller/math/rect";
import {GameRect} from "@/infra/game/controller/rect/gameRect";
import {IPoint, Point} from "@/infra/game/controller/math/point";

export class GameLogic {
    animationQueue = new AnimationQueue()
    gameRects: Map<GameRect, {
        isSpawning: boolean,
        spawnCenter: IPoint,
    }> = new Map()

    constructor(public gameField: GameField, public gameState: GameState) {
        this.init()
    }

    init() {
        this.gameField.resizesSubscribe(this.onFieldResize)
        this.gameField.container.addEventListener('dblclick', this.onDblClick)
    }

    onFieldResize = ({fieldRect}: { domRect: DOMRect, fieldRect: IRect }) => {
        this.gameRects.forEach(({spawnCenter, isSpawning}, gameRect) => {
            if (!Rect.isIn(gameRect.rect, fieldRect)) {
                this.adjustGameRect(fieldRect, gameRect)
                if (!isSpawning) {
                    this.animationQueue.push(gameRect.goto)
                }
            }
        })
    }

    adjustGameRect(fieldSizes: IRect, rect: GameRect) {
        const entry = this.gameRects.get(rect)
        if (!entry) return
        if (entry.isSpawning) {
            entry.spawnCenter[0] = Math.min(entry.spawnCenter[0], fieldSizes.right - rect.spaceProps.width / 2)
            entry.spawnCenter[1] = Math.min(entry.spawnCenter[1], fieldSizes.bottom - rect.spaceProps.height / 2)
            entry.spawnCenter[0] = Math.max(entry.spawnCenter[0], fieldSizes.left + rect.spaceProps.width / 2)
            entry.spawnCenter[1] = Math.max(entry.spawnCenter[1], fieldSizes.top + rect.spaceProps.height / 2)
        }
        rect.adjust(fieldSizes)
    }

    onDblClick = (event: MouseEvent) => {
        const sizes = this.gameField.fieldRect


        const rect = new GameRect({
            width: this.gameState.defaultWidth,
            height: this.gameState.defaultHeight,
            center: [this.gameState.defaultWidth / 2, this.gameState.defaultHeight / 2]
        })

        const spawnCenter = [
            Math.min(sizes.width - this.gameState.defaultWidth / 2, event.offsetX),
            Math.min(sizes.height - this.gameState.defaultHeight / 2, event.offsetY)
        ]

        this.gameRects.set(rect, {
            isSpawning: true,
            spawnCenter: spawnCenter
        })
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

        const entry = this.gameRects.get(rect)
        if (!entry) return

        let cycles = 60 // 60 frames
        const delta = Point.scale(Point.diff(entry.spawnCenter, rect.spaceProps.center), cycles ** -1)
        const nextStep = () => {
            if (!entry.isSpawning) return
            rect.goto(Point.min(Point.sum(rect.spaceProps.center, delta), entry.spawnCenter))

            if (!Point.isEqual(rect.spaceProps.center, entry.spawnCenter)) {
                this.animationQueue.push(nextStep)
            } else {
                entry.isSpawning = false
                this.switchGameRectLayer(rect)
            }
        }

        this.animationQueue.push(nextStep)
    }

    onGameRectMouseDown = (rect: GameRect) => {
        const entry = this.gameRects.get(rect)
        if (!entry) return
        if (entry.isSpawning) {
            entry.isSpawning = false
        } else {
            this.animationQueue.push(() => this.switchGameRectLayer(rect))
        }
    }

    onGameRectMouseUp = (rect: GameRect) => {
        this.animationQueue.push(() => this.switchGameRectLayer(rect))
    }

    dispose() {
        this.gameField.container.removeEventListener('dblclick', this.onDblClick)
        this.animationQueue.dispose()
        this.gameRects.forEach((value, gameRect) => gameRect.dispose())
        this.gameRects.clear()
    }
}