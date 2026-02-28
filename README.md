# PhimHay - Xem Phim Online Chất Lượng Cao

> Nền tảng xem phim trực tuyến được xây dựng bằng React + Tailwind CSS v4 + Node.js Express, sử dụng API từ [ophim](https://ophim1.com).

---

## Cấu Trúc Dự Án

```
my-app/
│
├── client/                                    # (React + Vite) Giao diện người dùng
│   ├── public/                                # Tài nguyên tĩnh
│   ├── src/
│   │   ├── components/                        # Các component tái sử dụng
│   │   │   ├── common/                        # Component dùng chung toàn app
│   │   │   │   ├── ErrorBoundary.jsx          # Bắt lỗi render, hiện UI fallback thay vì crash app
│   │   │   │   ├── ErrorState.jsx             # UI trạng thái lỗi + nút Thử lại, dùng chung mọi page
│   │   │   │   ├── Footer.jsx                 # Footer chung: thông tin, liên kết, mạng xã hội
│   │   │   │   ├── HorizontalSlider.jsx       # Slider cuộn ngang + mũi tên, dùng cho các section phim
│   │   │   │   ├── Loading.jsx                # Spinner loading, hỗ trợ full-screen
│   │   │   │   ├── MovieCard.jsx              # Thẻ phim (poster, badge, overlay hover), dùng memo tối ưu
│   │   │   │   ├── MovieGrid.jsx              # Grid hiển thị danh sách phim responsive
│   │   │   │   ├── Navbar.jsx                 # Thanh điều hướng: logo, menu, tìm kiếm + gợi ý autocomplete
│   │   │   │   ├── Pagination.jsx             # Phân trang dùng chung (có/không số trang)
│   │   │   │   ├── PageTransition.jsx         # Hiệu ứng logo khi chuyển trang (scale + fade + slide out)
│   │   │   │   ├── PlayIcon.jsx               # SVG icon play dùng chung toàn app
│   │   │   │   ├── SearchSuggestions.jsx       # Dropdown gợi ý phim khi gõ tìm kiếm (debounce, keyboard nav)
│   │   │   │   └── SectionHeader.jsx          # Header section dùng chung (accent bar + link Xem thêm)
│   │   │   │
│   │   │   └── home/                          # Component riêng cho trang chủ
│   │   │       ├── HeroCarousel.jsx           # Banner carousel tự động chuyển slide, hiển thị phim nổi bật
│   │   │       ├── LiveTVSection.jsx           # Section truyền hình trực tiếp (dữ liệu tĩnh)
│   │   │       ├── MovieSection.jsx           # Section phim có slider ngang (phim bộ, phim lẻ, hành động...)
│   │   │       ├── Top10Section.jsx           # Top 10 hôm nay, hiển thị số thứ tự kiểu Netflix
│   │   │       └── TrendingSection.jsx        # Section thịnh hành, có category tabs lọc quốc gia
│   │   │
│   │   ├── hooks/                             # Custom React hooks
│   │   │   ├── useDebounce.js                 # Hook debounce giá trị, tránh gọi API liên tục khi gõ phím
│   │   │   ├── useMovies.js                   # Hook gọi API phim: loading, error, AbortController cancel
│   │   │   └── usePageTitle.js                # Hook cập nhật document.title theo trang hiện tại
│   │   │
│   │   ├── pages/                             # Các trang (lazy load)
│   │   │   ├── CategoryPage.jsx               # Trang danh sách phim theo loại (phim bộ, phim lẻ, hoạt hình...)
│   │   │   ├── HomePage.jsx                   # Trang chủ: tổng hợp tất cả sections
│   │   │   ├── MovieDetailPage.jsx            # Trang chi tiết phim: thông tin, poster, danh sách tập, player
│   │   │   └── SearchPage.jsx                 # Trang kết quả tìm kiếm, có phân trang
│   │   │
│   │   ├── services/                          # Tầng giao tiếp API
│   │   │   └── api.js                         # Axios instance, interceptor xử lý lỗi, các method gọi API
│   │   │
│   │   ├── styles/                            # Style toàn cục
│   │   │   └── global.css                     # Tailwind CSS v4, custom theme (màu, font), keyframes animation
│   │   │
│   │   ├── utils/                             # Tiện ích, hằng số
│   │   │   ├── constants.js                   # URL ảnh CDN, nav links, live channels, category tabs
│   │   │   └── helpers.js                     # Hàm dùng chung: parseApiData, handleImageError, scrollToTop, layout constants
│   │   │
│   │   ├── App.jsx                            # Router chính, lazy load pages, ErrorBoundary bọc toàn app
│   │   └── main.jsx                           # Entry point: mount React vào DOM
│   │
│   ├── .env                                   # Biến môi trường client (VITE_API_URL)
│   ├── index.html                             # HTML template, load font Roboto
│   ├── package.json                           # Dependencies: react, react-router-dom, axios, @tailwindcss/vite
│   └── vite.config.js                         # Cấu hình Vite: proxy /api -> backend, code splitting, minify
│
├── server/                                    # (Node.js Express) API Backend
│   ├── src/
│   │   ├── config/                            # Cấu hình tập trung
│   │   │   └── index.js                       # Đọc biến .env, export config cho toàn server
│   │   │
│   │   ├── controllers/                       # Xử lý request
│   │   │   └── movieController.js             # Controller phim: parse params, gọi service, trả response chuẩn
│   │   │
│   │   ├── middlewares/                       # Middleware Express
│   │   │   ├── errorHandler.js                # Xử lý lỗi tập trung + handler 404
│   │   │   ├── rateLimiter.js                 # Giới hạn request: 100 req/phút chung, 30 cho search, 60 cho suggest
│   │   │   └── security.js                    # Helmet (bảo mật headers) + CORS (chỉ cho phép client origin)
│   │   │
│   │   ├── routes/                            # Định tuyến API
│   │   │   ├── index.js                       # Router gốc: gộp health check + movie routes
│   │   │   └── movieRoutes.js                 # Routes phim: /home, /new, /series, /single, /search, /detail...
│   │   │
│   │   ├── services/                          # Tầng business logic
│   │   │   └── movieService.js                # Gọi ophim API, áp dụng cache, validate input, sanitize slug
│   │   │
│   │   ├── utils/                             # Tiện ích server
│   │   │   ├── ApiError.js                    # Class lỗi chuẩn: badRequest, notFound, tooManyRequests, internal
│   │   │   ├── cache.js                       # LRU Cache in-memory: getOrSet (Cache-Aside pattern), invalidate
│   │   │   └── logger.js                      # Winston logger: console + file rotation, structured logging
│   │   │
│   │   └── app.js                             # Khởi tạo Express app: gắn middleware, routes, error handler
│   │
│   ├── .env                                   # Biến môi trường server (PORT, API URL, cache TTL, rate limit)
│   ├── package.json                           # Dependencies: express, axios, helmet, cors, compression, winston
│   └── server.js                              # Entry point: start server, graceful shutdown, xử lý crash
│
├── .gitignore                                 # Bỏ qua node_modules, .env, logs, dist
└── package.json                               # Root scripts: chạy cả client + server cùng lúc (concurrently)
```

---

## Kỹ Thuật Áp Dụng

### Backend (Server)

| Kỹ thuật | Mô tả |
|----------|-------|
| **LRU Cache** | Cache-Aside pattern, cache response từ ophim 5 phút, giảm tải API gốc |
| **Rate Limiting** | 100 req/phút chung, 30 req/phút riêng cho search (chống spam) |
| **Helmet + CORS** | Bảo mật HTTP headers, chỉ cho phép GET request từ client origin |
| **Compression** | Nén response > 1KB (level 6), tiết kiệm bandwidth |
| **Winston Logger** | Structured logging, file rotation trong production (5MB/file, 5 files) |
| **Centralized Error** | Mọi lỗi đi qua 1 middleware, ApiError class chuẩn hoá status code |
| **Graceful Shutdown** | Đóng kết nối sạch sẽ khi nhận SIGTERM/SIGINT, timeout 10s |
| **Input Sanitization** | Validate + clean slug, keyword, clamp page >= 1 trước khi gọi API bên thứ 3 |

### Frontend (Client)

| Kỹ thuật | Mô tả |
|----------|-------|
| **Lazy Loading** | `React.lazy` + `Suspense`, chỉ tải page khi người dùng truy cập |
| **Page Transition** | Hiệu ứng logo PhimHay khi chuyển trang (scale, fade, slide out) |
| **Error Boundary** | Bắt lỗi render, hiển thị UI fallback thay vì crash toàn bộ app |
| **React.memo** | Tránh re-render không cần thiết cho MovieCard, Loading, Footer và các section |
| **Custom Hooks** | Tách logic gọi API khỏi UI, hỗ trợ AbortController cancel request, enabled flag |
| **Debounce** | useDebounce hook tránh gọi API liên tục khi gõ tìm kiếm (delay 400ms) |
| **Search Autocomplete** | Gợi ý phim real-time khi gõ, keyboard navigation, click outside đóng |
| **DOMPurify** | Sanitize HTML content từ API trước khi render, chống XSS injection |
| **Iframe Sandbox** | Sandbox attribute + validate URL https trước khi nhúng iframe player |
| **Page Title** | usePageTitle hook tự động cập nhật document.title theo trang/phim hiện tại |
| **Shared Components** | Tách code lặp thành component dùng chung: SectionHeader, Slider, ErrorState... |
| **Code Splitting** | Vite manualChunks tách vendor (react, react-dom) thành bundle riêng |
| **Image Lazy Load** | `loading="lazy"` cho ảnh ngoài viewport, giảm thời gian tải trang |
| **Vite Proxy** | Dev proxy `/api/*` sang backend, không cần cấu hình CORS khi dev |
| **Tailwind CSS v4** | Utility-first CSS framework, custom theme với @theme directive |

---

## Cài Đặt & Chạy

```bash
# 1. Cài tất cả dependencies
npm run install:all

# 2. Chạy cả client + server cùng lúc
npm run dev

# Hoặc chạy riêng
npm run dev:server    # Backend: http://localhost:5000
npm run dev:client    # Frontend: http://localhost:5173
```

### Biến Môi Trường

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
OPHIM_BASE_URL=https://ophim1.com/v1/api
CACHE_TTL=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=/api
```

---

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra sức khoẻ server (uptime, cache stats, memory) |
| GET | `/api/movies/home` | Dữ liệu trang chủ |
| GET | `/api/movies/new?page=1` | Phim mới cập nhật |
| GET | `/api/movies/series?page=1` | Danh sách phim bộ |
| GET | `/api/movies/single?page=1` | Danh sách phim lẻ |
| GET | `/api/movies/anime?page=1` | Danh sách hoạt hình |
| GET | `/api/movies/tv-shows?page=1` | Danh sách TV shows |
| GET | `/api/movies/detail/:slug` | Chi tiết phim theo slug |
| GET | `/api/movies/search?keyword=xxx&page=1` | Tìm kiếm phim |
| GET | `/api/movies/suggest?keyword=xxx` | Gợi ý tìm kiếm nhanh (tối đa 8 kết quả) |
| GET | `/api/movies/genres` | Danh sách tất cả thể loại |
| GET | `/api/movies/countries` | Danh sách tất cả quốc gia |
| GET | `/api/movies/genre/:slug?page=1` | Phim theo thể loại |
| GET | `/api/movies/country/:slug?page=1` | Phim theo quốc gia |

---

## Build Production

```bash
# Build client
npm run build

# Chạy production (server phục vụ cả static files)
NODE_ENV=production npm start
```
