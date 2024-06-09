import styles from './home.module.scss'

/**
 * Please, read README.md first
 */

export default function Home() {
    return (
        <div className={styles.container}>
            <p className={styles.article}>
                There is an interactive field on the Game page. Double clicking on an empty
                space in the field adds a rectangle to the field. The rectangle is also draggable
                within the field.
            </p>
        </div>
    );
}
