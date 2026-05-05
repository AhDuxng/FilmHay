import { memo } from 'react';
import { RiBroadcastLine, RiFlashlightLine, RiLiveLine } from 'react-icons/ri';
import { CONTENT_WRAP, SECTION_PADDING } from '../../utils/helpers';
import SectionHeader from '../common/SectionHeader';
import HorizontalSlider from '../common/HorizontalSlider';

const channels = [
  { name: 'Thể thao 24h', desc: 'Diễn biến mới nhất', tone: 'from-[#4f1d95] to-[#7c3aed]' },
  { name: 'Giải trí tổng hợp', desc: 'Talkshow và reality', tone: 'from-[#0f766e] to-[#14b8a6]' },
  { name: 'Anime Plus', desc: 'Marathon anime', tone: 'from-[#be185d] to-[#f43f5e]' },
  { name: 'Cinema Action', desc: 'Bom tấn hành động', tone: 'from-[#9a3412] to-[#ea580c]' },
];

const LiveTVSection = memo(function LiveTVSection() {
  return (
    <section className={`${SECTION_PADDING} ${CONTENT_WRAP} mt-10`}>
      <SectionHeader title="Kênh phát trực tiếp" />
      <HorizontalSlider scrollAmount={420}>
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="min-w-[250px] overflow-hidden rounded-2xl border border-white/10 bg-surface-2"
          >
            <div className={`h-36 bg-gradient-to-br ${channel.tone} p-4`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <RiLiveLine className="text-sm" />
                  Live
                </span>
                <RiBroadcastLine className="text-2xl text-white/80" />
              </div>

              <div className="mt-10">
                <p className="text-lg font-bold text-white">{channel.name}</p>
                <p className="text-sm text-white/85">{channel.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-300">
              <RiFlashlightLine className="text-primary" />
              Đang phát sóng
            </div>
          </div>
        ))}
      </HorizontalSlider>
    </section>
  );
});

export default LiveTVSection;
