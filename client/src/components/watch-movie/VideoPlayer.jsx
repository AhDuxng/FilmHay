import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiArrowLeftLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiListUnordered,
  RiMovie2Line,
  RiSkipForwardLine,
} from 'react-icons/ri';
import { getThumbUrl } from '../../utils/helpers';

export const VideoPlayer = ({
  movie,
  cdnBase = '',
  currentEpisode,
  episodeLabel,
  servers = [],
  activeServerIndex = 0,
  activeEpisodeIndex = 0,
}) => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const backgroundUrl = movie ? getThumbUrl(movie, cdnBase) : '';

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main 
      ref={containerRef}
      className={`relative flex-1 w-full h-full bg-black flex flex-col ${showControls ? 'group' : ''}`}
    >
      <div className="absolute inset-0 bg-black">
        {currentEpisode?.link_embed ? (
          <iframe
            title={`${movie?.name || 'Phim'} - ${episodeLabel}`}
            src={currentEpisode.link_embed}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer"
            className="h-full w-full border-0"
          />
        ) : currentEpisode?.link_m3u8 ? (
          <video controls autoPlay className="h-full w-full bg-black" src={currentEpisode.link_m3u8} />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-cover bg-center px-6 text-center"
            style={{ backgroundImage: backgroundUrl ? `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url('${backgroundUrl}')` : undefined }}
          >
            <div>
              <RiMovie2Line className="mx-auto h-14 w-14 text-primary-container" aria-hidden="true" />
              <h2 className="mt-3 font-headline-md text-headline-md text-white">Nguồn phát chưa sẵn sàng</h2>
              <p className="mt-2 font-body-md text-body-md text-secondary">Phim này hiện chưa có tập hoặc server xem trong API.</p>
            </div>
          </div>
        )}
      </div>
      
      <header className={`absolute top-0 w-full z-10 player-header-gradient p-margin-mobile md:p-margin-desktop flex justify-between items-start transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            aria-label="Back" 
            className="p-2 rounded-full bg-surface/30 backdrop-blur-md hover:bg-surface/50 text-white transition-colors"
          >
            <RiArrowLeftLine className="h-6 w-6" aria-hidden="true" />
          </button>
          <div>
            <h1 className="font-headline-md text-headline-md text-white line-clamp-1">{movie?.name || 'Xem phim'}</h1>
            <p className="font-body-md text-body-md text-secondary">{episodeLabel}</p>
          </div>
        </div>
        <button
          aria-label="Episodes"
          onClick={() => setShowEpisodes((value) => !value)}
          className="p-2 rounded-full bg-surface/30 backdrop-blur-md hover:bg-surface/50 text-white transition-colors"
        >
          <RiListUnordered className="h-6 w-6" aria-hidden="true" />
        </button>
      </header>

      <div className={`absolute bottom-0 w-full z-10 player-controls-gradient pt-24 pb-margin-mobile md:pb-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col gap-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center text-white">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm text-secondary">Đang phát</p>
            <h2 className="truncate font-headline-md text-body-lg text-white">{episodeLabel}</h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {currentEpisode?.link_m3u8 ? (
              <a href={currentEpisode.link_m3u8} target="_blank" rel="noreferrer" aria-label="Open source" className="hover:text-primary-container transition-colors">
                <RiExternalLinkLine className="h-6 w-6" aria-hidden="true" />
              </a>
            ) : null}
            <Link
              to={`/watch/${movie?.slug || ''}?server=${activeServerIndex}&episode=${activeEpisodeIndex + 1}`}
              aria-label="Next Episode"
              className={`hover:text-primary-container transition-colors flex items-center gap-1 text-label-sm font-label-sm ${servers[activeServerIndex]?.server_data?.[activeEpisodeIndex + 1] ? '' : 'pointer-events-none opacity-40'}`}
            >
              <RiSkipForwardLine className="h-6 w-6" aria-hidden="true" />
              <span className="hidden md:inline">Tập tiếp</span>
            </Link>
            <button aria-label="Episodes" onClick={() => setShowEpisodes((value) => !value)} className="hover:text-primary-container transition-colors">
              <RiListUnordered className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <aside className={`absolute right-0 top-0 z-20 h-full w-full max-w-md bg-[#111]/95 p-margin-mobile md:p-margin-desktop transition-transform duration-300 ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-white">Danh sách tập</h2>
          <button aria-label="Close episodes" onClick={() => setShowEpisodes(false)} className="text-white hover:text-primary-container">
            <RiCloseLine className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {servers.map((server, index) => (
            <Link
              key={`${server.server_name}-${index}`}
              to={`/watch/${movie?.slug}?server=${index}&episode=0`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${index === activeServerIndex ? 'border-primary-container bg-primary-container text-white' : 'border-white/15 bg-white/5 text-secondary hover:bg-white/10'}`}
            >
              {server.server_name || `Server ${index + 1}`}
            </Link>
          ))}
        </div>

        <div className="grid max-h-[calc(100vh-180px)] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
          {(servers[activeServerIndex]?.server_data || []).map((episode, index) => (
            <Link
              key={`${episode.slug || episode.name}-${index}`}
              to={`/watch/${movie?.slug}?server=${activeServerIndex}&episode=${index}`}
              className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold transition ${index === activeEpisodeIndex ? 'border-primary-container bg-primary-container text-white' : 'border-white/15 bg-white/5 text-secondary hover:border-white/35 hover:bg-white/10'}`}
            >
              {episode.name || `Tập ${index + 1}`}
            </Link>
          ))}
        </div>
      </aside>
    </main>
  );
};
