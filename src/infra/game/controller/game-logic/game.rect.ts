import {ISpaceProps, SvgRect} from "@/infra/game/controller/rect/svg.rect";
import {IPoint, Point} from "@/infra/game/controller/math/point";
import {IRect} from "@/infra/game/controller/math/rect";
import {GameLogic} from "@/infra/game/controller/game-logic/game.logic";

export class GameRect extends SvgRect {
    isSpawning = true

    constructor(
        spaceProps: ISpaceProps,
        public spawnCenter: IPoint,
        private gameLogic: GameLogic
    ) {
        super(spaceProps);
    }

    adjust(fieldSizes: IRect) {
        if (this.isSpawning) {
            this.spawnCenter[0] = Math.min(this.spawnCenter[0], fieldSizes.right - this.spaceProps.width / 2)
            this.spawnCenter[1] = Math.min(this.spawnCenter[1], fieldSizes.bottom - this.spaceProps.height / 2)
            this.spawnCenter[0] = Math.max(this.spawnCenter[0], fieldSizes.left + this.spaceProps.width / 2)
            this.spawnCenter[1] = Math.max(this.spawnCenter[1], fieldSizes.top + this.spaceProps.height / 2)
        }
        super.adjust(fieldSizes)
    }

    spawn = () => {
        this.goto()

        let cycles = 60 // 60 frames
        const delta = Point.scale(Point.diff(this.spawnCenter, this.spaceProps.center), cycles ** -1)
        const nextStep = () => {
            this.goto(Point.min(Point.sum(this.spaceProps.center, delta), this.spawnCenter))

            if (!Point.isEqual(this.spaceProps.center, this.spawnCenter)) {
                this.gameLogic.animationQueue.push(nextStep)
            } else {
                this.isSpawning = false
                this.gameLogic.switchGameRectLayer(this)
            }
        }

        this.gameLogic.animationQueue.push(nextStep)
    }

    onMouseUp() {
        super.onMouseUp()
        this.gameLogic.animationQueue.push(() => this.gameLogic.switchGameRectLayer(this))
    }

    onMouseDown(event) {
        super.onMouseDown(event)

        if (this.isSpawning) {
            this.isSpawning = false
        } else {
            this.gameLogic.animationQueue.push(() => this.gameLogic.switchGameRectLayer(this))
        }
    }
}