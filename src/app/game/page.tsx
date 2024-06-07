import {Game} from "@/infra/game/view/game";
import './game.css'

export const metadata = {
    title: 'NextJS Game'
}

export default function Page() {
    return <Game/>
}