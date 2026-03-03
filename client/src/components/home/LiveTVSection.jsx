import { memo } from 'react';
import { LIVE_CHANNELS } from '../../utils/constants';
import { SECTION_PADDING } from '../../utils/helpers';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';

const LiveTVSection = memo(function LiveTVSection() {
    return (
        <section className={`${SECTION_PADDING} mb-10 relative`}>
            <SectionHeader title="Truyền hình trực tiếp" moreLink="#" />

            {/* Danh sach kenh */}
            <HorizontalSlider>
                {LIVE_CHANNELS.map((channel) => (
                    <div key={channel.name} className="flex-[0_0_180px] rounded-lg overflow-hidden bg-dark-light transition-transform duration-300 cursor-pointer hover:-translate-y-1">
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
            </HorizontalSlider>
        </section>
    );
});

export default LiveTVSection;
