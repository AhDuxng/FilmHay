import { memo } from 'react';
import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri';
import { PAGE_PADDING, RETRY_BUTTON_CLASS } from '../../utils/helpers';

const ErrorState = memo(function ErrorState({
  title = 'Không thể tải dữ liệu',
  message = 'Đã xảy ra lỗi không mong muốn',
  onRetry,
  hasTopPadding = false,
}) {
  return (
    <div className={hasTopPadding ? PAGE_PADDING : 'py-8'}>
      <div className="mx-auto flex min-h-[320px] max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 text-center backdrop-blur">
        <RiErrorWarningLine className="mb-4 text-5xl text-primary" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">{message}</p>

        {onRetry ? (
          <button type="button" onClick={onRetry} className={`${RETRY_BUTTON_CLASS} mt-6 gap-2`}>
            <RiRefreshLine className="text-base" />
            Thử lại
          </button>
        ) : null}
      </div>
    </div>
  );
});

export default ErrorState;
