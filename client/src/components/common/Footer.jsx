import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-background w-full py-12 border-t border-white/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
        <Link to="/" className="font-display-lg text-headline-md text-primary-container">
          {APP_NAME}
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
