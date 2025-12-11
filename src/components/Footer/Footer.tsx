import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.brand}>Nuôi DEV © {new Date().getFullYear()}</p>
                <div className={styles.links}>
                    <Link href="/policy" className={styles.link}>Chính sách</Link>
                </div>
            </div>
        </footer>
    );
}
