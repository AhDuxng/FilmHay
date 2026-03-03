import { memo } from 'react';
import PlayIcon from './PlayIcon';

const Loading = memo(function Loading({ fullScreen = false }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'}`}>
            {/* Vong tron xoay cinema */}
            <div
                className="relative"
                style={{ width: fullScreen ? 64 : 48, height: fullScreen ? 64 : 48 }}
            >
                <svg
                    className="block"
                    viewBox="25 25 50 50"
                    style={{ animation: 'cinemaRotate 1.4s linear infinite' }}
                    width="100%"
                    height="100%"
                >
                    <circle
                        cx="50" cy="50" r="20"
                        fill="none"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        style={{
                            animation: 'cinemaDash 1.4s ease-in-out infinite, cinemaColor 2.8s ease-in-out infinite',
                        }}
                    />
                </svg>
                {/* Icon play nho o giua */}
                {fullScreen && (
                    <PlayIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 fill-primary/60" />
                )}
            </div>
            {fullScreen && (
                <span className="text-sm text-neutral-500 animate-pulse">Đang tải...</span>
            )}
        </div>
    );
});

export default Loading;
