import { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer - chan trang voi thong tin lien he, the loai, social
 * Responsive: 4 cot -> 2 cot -> 1 cot
 */
const Footer = memo(function Footer() {
    return (
        <footer className="bg-surface mt-15 px-12 max-lg:px-6 max-md:px-4 pt-12 max-lg:pt-10 max-md:pt-8 pb-6 max-md:pb-4">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-lg:grid-cols-2 max-md:grid-cols-1 gap-10 max-md:gap-6 mb-10">
                {/* Brand & Social */}
                <div>
                    <h3 className="text-2xl font-black bg-gradient-to-br from-primary to-cyan bg-clip-text text-transparent mb-3">
                        PhimHay
                    </h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed max-w-[350px]">
                        Nền tảng xem phim trực tuyến hàng đầu với kho nội dung đa dạng, chất lượng cao. Xem mọi lúc, mọi nơi trên mọi thiết bị.
                    </p>
                    <div className="flex gap-3 mt-3">
                        <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-primary transition-colors">
                            <svg className="w-4 h-4 fill-neutral-300" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
                        </a>
                        <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-primary transition-colors">
                            <svg className="w-4 h-4 fill-neutral-300" viewBox="0 0 24 24"><path d="M22.46 6c-.85.38-1.78.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.42-.01-.63.96-.69 1.79-1.56 2.45-2.55z" /></svg>
                        </a>
                        <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-primary transition-colors">
                            <svg className="w-4 h-4 fill-neutral-300" viewBox="0 0 24 24"><path d="M21.8 8.001a2.75 2.75 0 00-1.94-1.93C18.26 5.5 12 5.5 12 5.5s-6.26 0-7.86.57A2.75 2.75 0 002.2 8c-.57 1.6-.57 4.94-.57 4.94s0 3.34.57 4.94a2.75 2.75 0 001.94 1.93c1.6.57 7.86.57 7.86.57s6.26 0 7.86-.57a2.75 2.75 0 001.94-1.93c.57-1.6.57-4.94.57-4.94s0-3.34-.57-4.94zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-primary transition-colors">
                            <svg className="w-4 h-4 fill-neutral-300" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z" /></svg>
                        </a>
                    </div>
                </div>

                {/* The loai */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-4">Thể loại</h4>
                    <Link to="/the-loai/hanh-dong" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim hành động</Link>
                    <Link to="/the-loai/tinh-cam" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim tình cảm</Link>
                    <Link to="/the-loai/hai-huoc" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim hài</Link>
                    <Link to="/the-loai/kinh-di" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim kinh dị</Link>
                    <Link to="/the-loai/hoat-hinh" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim hoạt hình</Link>
                    <Link to="/the-loai/tai-lieu" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Phim tài liệu</Link>
                </div>

                {/* Ho tro */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-4">Hỗ trợ</h4>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Trung tâm trợ giúp</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Câu hỏi thường gặp</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Liên hệ</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Báo lỗi</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Góp ý</a>
                </div>

                {/* Ve chung toi */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-4">Về chúng tôi</h4>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Giới thiệu</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Điều khoản sử dụng</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Chính sách bảo mật</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Tuyển dụng</a>
                    <a href="#" className="block text-[13px] text-neutral-500 mb-2.5 hover:text-primary transition-colors">Quảng cáo</a>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-neutral-800 pt-5 flex max-md:flex-col justify-between items-center max-md:gap-4 max-md:text-center">
                <p className="text-xs text-neutral-600">&copy; 2026 PhimHay. Đây là website demo, không phải dịch vụ thương mại.</p>
            </div>
        </footer>
    );
});

export default Footer;
