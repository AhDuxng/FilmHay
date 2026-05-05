import { memo } from 'react';
import { RiLoader4Line, RiPlayMiniFill } from 'react-icons/ri';

const Loading = memo(function Loading({ fullScreen = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : 'min-h-[220px]'}`}>
      <div className="relative">
        <RiLoader4Line className="text-5xl text-primary animate-spin" />
        <RiPlayMiniFill className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-white" />
      </div>
      <p className="text-sm text-neutral-400">Đang tải dữ liệu...</p>
    </div>
  );
});

export default Loading;
