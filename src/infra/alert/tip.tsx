import React, {useState} from 'react'
import styles from './alert.module.scss'

export const Tip: React.FC<React.PropsWithChildren> = React.memo(({
                                                                      children,
                                                                  }) => {

    const [child, setChild] = useState(() => children)


    if (!child) return null
    return (
        <div className={styles.container}>
            <div className={styles.textWrapper}
                 onAnimationEnd={() => {
                     setChild(null)
                 }}>
                {
                    children
                }
            </div>
        </div>
    )
})
