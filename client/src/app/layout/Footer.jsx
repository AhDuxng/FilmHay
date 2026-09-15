import { Link } from 'react-router-dom';
import { APP_NAME } from '@/shared/lib/constants';
import Cube from '@/shared/components/ui/Cube';

const Footer = () => {
  return (
    <footer className="bg-background w-full py-12 border-t border-outline">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
        <Link to="/" className="flex items-center gap-1">
          <Cube size={16} animated={false} className="-ml-2 shrink-0" />
          <span className="text-ramp font-display-lg text-headline-md">{APP_NAME}</span>
        </Link>
        <ul className="flex flex-wrap justify-center gap-6">
          <li><Link to="/danh-sach/phim-bo" className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200">Phim bộ</Link></li>
          <li><Link to="/danh-sach/phim-le" className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200">Phim lẻ</Link></li>
          <li><Link to="/the-loai/hoat-hinh" className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200">Hoạt hình</Link></li>
          <li><Link to="/search" className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200">Tìm kiếm</Link></li>
        </ul>
        <p className="font-body-md text-body-md text-secondary">
          © 2025 FilmHay. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
