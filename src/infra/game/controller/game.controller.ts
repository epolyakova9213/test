import {GameState} from "@/infra/game/controller/game.state";
import {GameField} from "@/infra/game/controller/game-field/game-field";
import {GameLogic} from "@/infra/game/controller/game-logic/gameLogic";

export class GameController {
    gameState: GameState
    gameField: GameField
    gameLogic: GameLogic


    init(container: HTMLDivElement) {
        this.gameState = new GameState()
        this.gameField = new GameField(container)
        this.gameLogic = new GameLogic(this.gameField, this.gameState)
    }


    dispose = () => {
        this.gameState.dispose()
        this.gameField.dispose()
        this.gameLogic.dispose()
    }
}