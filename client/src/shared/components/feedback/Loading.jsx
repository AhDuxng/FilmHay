import { memo } from 'react';
import Cube from '@/shared/components/ui/Cube';

const Loading = memo(function Loading({ fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : 'min-h-[220px]'}`}
      role="status"
      aria-live="polite"
    >
      <Cube size={44} />
      <p className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary">Đang tải dữ liệu</p>
    </div>
  );
});

export default Loading;
