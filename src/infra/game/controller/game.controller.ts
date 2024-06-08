import {GameField} from "@/infra/game/controller/game-field/game-field";
import {GameLogic} from "@/infra/game/controller/game-logic/gameLogic";

export class GameController {
    gameField: GameField
    gameLogic: GameLogic


    init(container: HTMLDivElement) {
        this.gameField = new GameField(container)
        this.gameLogic = new GameLogic(this.gameField)
    }


    dispose = () => {
        this.gameField.dispose()
        this.gameLogic.dispose()
    }
}