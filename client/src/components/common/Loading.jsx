import { memo } from 'react';
import { RiPlayMiniFill } from 'react-icons/ri';

const Loading = memo(function Loading({ fullScreen = false }) {
  return (
    <div
      className={`site-loader flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'min-h-[220px]'}`}
      role="status"
      aria-live="polite"
    >
      <div className="site-loader__visual" aria-hidden="true">
        <span className="site-loader__glow" />
        <span className="site-loader__orbit" />
        <span className="site-loader__core">
          <RiPlayMiniFill className="ml-0.5 text-2xl" />
        </span>
      </div>
      <p className="site-loader__label text-sm font-medium tracking-wide">Đang tải dữ liệu...</p>
    </div>
  );
});

export default Loading;
