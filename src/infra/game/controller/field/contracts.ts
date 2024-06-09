import {IRect} from "@/infra/game/controller/math/rect";

export type IResizeSubscribeArgument = {
    domRect: DOMRect,
    fieldRect: IRect
}

export interface IResizeSubscriber {
    (args: IResizeSubscribeArgument): void
}