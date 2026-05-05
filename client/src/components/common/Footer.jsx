import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RiFacebookFill, RiInstagramLine, RiYoutubeFill, RiTelegram2Line } from 'react-icons/ri';
import { CONTENT_WRAP, SECTION_PADDING } from '../../utils/helpers';
import { APP_NAME, LIST_QUICK_LINKS } from '../../utils/constants';

const socials = [
  { icon: RiFacebookFill, label: 'Facebook' },
  { icon: RiInstagramLine, label: 'Instagram' },
  { icon: RiYoutubeFill, label: 'YouTube' },
  { icon: RiTelegram2Line, label: 'Telegram' },
];

const Footer = memo(function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-[#090b11]">
      <div className={`${SECTION_PADDING} ${CONTENT_WRAP} py-10`}>
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">{APP_NAME}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
              Nền tảng xem phim online theo phong cách streaming: tốc độ nhanh, giao diện gọn, tối ưu trên mọi màn hình.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neutral-200 transition hover:border-white/35 hover:bg-white/10"
                  aria-label={label}
                >
                  <Icon className="text-lg" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Khám phá</h4>
            <div className="mt-3 grid gap-2">
              {LIST_QUICK_LINKS.map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-neutral-400 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Thông tin</h4>
            <div className="mt-3 grid gap-2 text-sm text-neutral-400">
              <p>Data source: OPhim API</p>
              <p>Player: embedded stream source</p>
              <p>Built for learning and demo purpose</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-neutral-500">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
});

export default Footer;
