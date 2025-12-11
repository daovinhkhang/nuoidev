import Link from 'next/link';
import styles from './page.module.css';

export default function PolicyPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.avatar}>ND</div>
                <div>
                    <h1 className={styles.title}>Chính sách "Nuôi Dev"</h1>
                    <p className={styles.lead}>Phiên bản nhẹ, hài hước & minh bạch cho những ai muốn ủng hộ công việc dev.</p>
                </div>
            </header>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Vì sao bạn nên nuôi tôi?</h2>
                <p className={styles.text}>
                    Tôi là dev freelance/opensource, cần thời gian & tài nguyên để build, maintain và học.
                    Mỗi khoản đóng góp giúp tôi tập trung fix bug và phát triển tính năng mới.
                </p>

                <h3 className={styles.subTitle}>Cam kết minh bạch</h3>
                <ul className={styles.list}>
                    <li>Tôi sẽ cập nhật định kỳ (tuần/tháng) những gì đã chi tiêu từ khoản sponsor.</li>
                    <li>Mọi khoản chi lớn sẽ có ghi chú; bạn có thể yêu cầu thêm bằng chứng.</li>
                    <li>Không chuyển sponsor thành "yêu cầu ép buộc" — tôi vẫn giữ quyền quyết định kỹ thuật.</li>
                </ul>

                <h3 className={styles.subTitle}>Các mức đóng góp (gợi ý)</h3>
                <div className={styles.tiers}>
                    <div className={styles.tier}>
                        <h3 className={styles.tierTitle}>20k — Trà đá</h3>
                        <p className={styles.tierDesc}>Một ly trà để dev tỉnh táo fix 1 bug nhỏ.</p>
                        <Link href="#donate-20" className={styles.btn}>Donate</Link>
                    </div>
                    <div className={styles.tier}>
                        <h3 className={styles.tierTitle}>50k / tháng — Cơm trưa</h3>
                        <p className={styles.tierDesc}>Giúp dev ăn no, code khỏe.</p>
                        <Link href="#donate-50" className={styles.btn}>Donate</Link>
                    </div>
                    <div className={styles.tier}>
                        <h3 className={styles.tierTitle}>100k / tháng — Server</h3>
                        <p className={styles.tierDesc}>Hỗ trợ hosting, domain, CI.</p>
                        <Link href="#donate-100" className={styles.btn}>Donate</Link>
                    </div>
                    <div className={styles.tier}>
                        <h3 className={styles.tierTitle}>500k+ / tháng — VIP</h3>
                        <p className={styles.tierDesc}>Trợ lực dài hạn, access beta & shoutout.</p>
                        <Link href="#donate-500" className={styles.btn}>Donate</Link>
                    </div>
                </div>

                <h3 className={styles.subTitle}>Perks (Cảm ơn)</h3>
                <ul className={styles.list}>
                    <li>Newsletter cập nhật tiến độ.</li>
                    <li>Tag tên trong README/<em>Supporter wall</em> nếu đóng góp lâu dài.</li>
                    <li>Quyền truy cập sớm vào công cụ hoặc feature beta.</li>
                </ul>

                <h3 className={styles.subTitle}>Nguyên tắc</h3>
                <ul className={styles.list}>
                    <li>Sponsor không = quyền yêu cầu dev làm theo ý bạn 100%.</li>
                    <li>Mức đóng góp càng nhỏ càng được hoan nghênh — tinh thần hỗ trợ là chính.</li>
                    <li>Nếu sponsor muốn minh bạch hơn, tôi sẽ cố gắng đáp ứng trong phạm vi hợp lý.</li>
                </ul>

                <h3 className={styles.subTitle}>Cách liên hệ & donate</h3>
                <p className={styles.text}>
                    Thêm các kênh chuyển khoản / ví: Momo, ZaloPay, chuyển khoản ngân hàng, PayPal (quốc tế).
                    Gửi email <code className={styles.code}>daovinhkhang0834@gmail.com</code> để nhận invoice hoặc gợi ý support.
                </p>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Phiên bản ngắn (copy nhanh)</h2>
                <pre className={styles.pre}>
                    Gửi hỗ trợ cho Dev:
                    20k (trà đá) — 50k (cơm) — 100k (server) — 500k+ (VIP).
                    Minh bạch, cập nhật định kỳ, perks: newsletter & access beta.
                </pre>
                <p className={styles.text}>Bạn muốn mình xuất file PDF / Markdown / HTML khác? Click nút dưới.</p>
                <p style={{ marginTop: 12 }}>
                    <Link href="#download-html" className={styles.btn} style={{ display: 'inline-flex', width: 'auto' }}>
                        Tải HTML
                    </Link>
                </p>
            </div>

            <footer className={styles.footerNote}>
                Lưu ý: mẫu này mang tính tham khảo. Tuỳ chỉnh nội dung, tên, kênh nhận tiền trước khi public.
            </footer>
        </div>
    );
}
