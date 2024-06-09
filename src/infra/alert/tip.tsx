import React from 'react'
import styles from './tip.module.scss'


type ITip = React.HTMLAttributes<HTMLDivElement>
export const Tip: React.FC<React.PropsWithChildren<ITip>> = React.memo(({
                                                                            children,
                                                                            ...props
                                                                        }) => {

    if (!children) return null
    return (
        <div className={styles.container}>
            <div className={styles.textWrapper}
                 {...props}>
                {
                    children
                }
            </div>
        </div>
    )
})
