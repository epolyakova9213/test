import {Field} from "@/infra/game/controller/field/field";
import {GameLogic} from "@/infra/game/controller/game-logic/game.logic";

export class GameController {
    gameField: Field
    gameLogic: GameLogic


    init(container: HTMLDivElement) {
        this.gameField = new Field(container)
        this.gameLogic = new GameLogic(this.gameField)
    }


    dispose = () => {
        this.gameField.dispose()
        this.gameLogic.dispose()
    }
}