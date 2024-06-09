'use client'

import React, {useEffect, useRef, useState} from "react";
import {GameController} from "@/infra/game/controller/game.controller";

/**
 * use another key for rerender component
 */
export const Game: React.FC = React.memo(() => {

    const [controller] = useState(() => new GameController())

    const containerRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        if (containerRef.current) {
            controller.init(containerRef.current!)
        }

        return controller.dispose
    }, [])

    return (
        <div ref={containerRef}>
        </div>

    )
})