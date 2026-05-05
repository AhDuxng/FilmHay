import { memo } from 'react';
import { FaPlay } from 'react-icons/fa6';

const PlayIcon = memo(function PlayIcon({ className = 'h-4 w-4' }) {
  return <FaPlay className={className} />;
});

export default PlayIcon;
