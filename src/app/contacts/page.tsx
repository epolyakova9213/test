import styles from './contacts.module.scss'
export const metadata = {
    title: 'NextJS Contacts'
}

export default function Page() {
    return (
        <div>
            <h1>Contact me</h1>
                <form className={styles.form}>
                    <input className={styles.name}
                           type={'text'}/>
                    <input className={styles.email}
                           type={'email'}/>
                    <input className={styles.subject}
                           type={'text'}/>
                    <textarea className={styles.message}/>
                    <button className={styles.submit}>Submit</button>
                </form>
        </div>
    )
}