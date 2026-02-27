import { memo } from 'react';

/**
 * Banner quảng cáo VIP - gradient background với promo cards trang trí
 */
const PromoBanner = memo(function PromoBanner() {
    return (
        <div className="mx-12 max-lg:mx-6 max-md:mx-4 mb-10 max-md:mb-8 rounded-xl overflow-hidden relative h-[200px] max-md:h-[160px] flex items-center px-15 max-lg:px-8 max-md:px-5 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
            {/* Nội dung */}
            <div className="max-w-[500px]">
                <h2 className="text-[28px] max-md:text-xl font-bold bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent mb-2.5">
                    Nâng cấp VIP - Xem không giới hạn!
                </h2>
                <p className="text-sm text-neutral-400 mb-5">
                    Trải nghiệm hàng ngàn bộ phim chất lượng cao, không quảng cáo, xem trên mọi thiết bị.
                </p>
                <button className="px-7 py-2.5 bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-semibold rounded transition-all hover:shadow-[0_4px_20px_rgba(30,144,255,0.4)]">
                    Đăng ký VIP ngay
                </button>
            </div>

            {/* Cards trang trí - ẩn trên mobile */}
            <div className="absolute right-15 flex gap-3 max-md:hidden">
                <div className="w-[100px] h-[150px] rounded-lg backdrop-blur-[10px] overflow-hidden -rotate-[5deg]"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #2196f3)' }} />
                <div className="w-[100px] h-[150px] rounded-lg backdrop-blur-[10px] overflow-hidden rotate-[3deg] -translate-y-2.5"
                    style={{ background: 'linear-gradient(135deg, #0f3460, #533483)' }} />
                <div className="w-[100px] h-[150px] rounded-lg backdrop-blur-[10px] overflow-hidden -rotate-[2deg] translate-y-[5px]"
                    style={{ background: 'linear-gradient(135deg, #2d132c, #2979ff)' }} />
            </div>
        </div>
    );
});

export default PromoBanner;
