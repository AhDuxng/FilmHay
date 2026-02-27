import { memo } from 'react';
import { LIVE_CHANNELS } from '../../utils/constants';

/**
 * Section truyền hình trực tiếp
 * Data tĩnh (static) vì không có API live TV
 */
const LiveTVSection = memo(function LiveTVSection() {
    return (
        <section className="px-12 max-lg:px-6 max-md:px-4 mb-10 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] max-md:text-lg font-bold text-white pl-3.5 relative">
                    <span className="absolute left-0 top-0.5 bottom-0.5 w-1 bg-primary rounded-sm" />
                    Truyền hình trực tiếp
                </h2>
                <a href="#" className="text-[13px] text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                    Xem thêm →
                </a>
            </div>

            {/* Danh sách kênh */}
            <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2.5 scrollbar-hide">
                {LIVE_CHANNELS.map((channel, index) => (
                    <div key={index} className="flex-[0_0_180px] rounded-lg overflow-hidden bg-dark-light transition-transform duration-300 cursor-pointer hover:-translate-y-1">
                        {/* Thumbnail */}
                        <div className="relative">
                            <div
                                className="w-full aspect-video flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${channel.color})` }}
                            >
                                <span className="text-[28px]">{channel.emoji}</span>
                            </div>
                            {/* LIVE badge */}
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-[3px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-live-pulse" />
                                LIVE
                            </div>
                        </div>
                        {/* Info */}
                        <div className="px-3 py-2.5">
                            <div className="text-[13px] font-semibold mb-1 truncate">{channel.name}</div>
                            <div className="text-[11px] text-neutral-500">{channel.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
});

export default LiveTVSection;
