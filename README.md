# PhimHay - Xem Phim Online Chất Lượng Cao

> Nền tảng xem phim trực tuyến được xây dựng bằng React + Node.js Express, sử dụng API từ [ophim](https://ophim1.com).

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
│   │   │   │   ├── Footer.jsx                 # Footer chung: thông tin, liên kết, mạng xã hội
│   │   │   │   ├── Loading.jsx                # Spinner loading, hỗ trợ full-screen
│   │   │   │   ├── MovieCard.jsx              # Thẻ phim (poster, badge, overlay hover), dùng memo tối ưu
│   │   │   │   └── Navbar.jsx                 # Thanh điều hướng: logo, menu, tìm kiếm, nút VIP/đăng nhập
│   │   │   │
│   │   │   └── home/                          # Component riêng cho trang chủ
│   │   │       ├── HeroCarousel.jsx           # Banner carousel tự động chuyển slide, hiển thị phim nổi bật
│   │   │       ├── LiveTVSection.jsx           # Section truyền hình trực tiếp (dữ liệu tĩnh)
│   │   │       ├── MovieSection.jsx           # Section phim có slider ngang (phim bộ, phim lẻ, hành động...)
│   │   │       ├── PromoBanner.jsx            # Banner quảng cáo gói VIP
│   │   │       ├── Top10Section.jsx           # Top 10 hôm nay, hiển thị số thứ tự kiểu Netflix
│   │   │       └── TrendingSection.jsx        # Section thịnh hành, có category tabs lọc quốc gia
│   │   │
│   │   ├── hooks/                             # Custom React hooks
│   │   │   └── useMovies.js                   # Hook gọi API phim: xử lý loading, error, cancel request
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
│   │   │   └── global.css                     # CSS toàn bộ giao diện (giống streaming-site.html gốc)
│   │   │
│   │   ├── utils/                             # Tiện ích, hằng số
│   │   │   └── constants.js                   # URL ảnh CDN, badge map, nav links, live channels, category tabs
│   │   │
│   │   ├── App.jsx                            # Router chính, lazy load pages, ErrorBoundary bọc toàn app
│   │   └── main.jsx                           # Entry point: mount React vào DOM
│   │
│   ├── .env                                   # Biến môi trường client (VITE_API_URL)
│   ├── index.html                             # HTML template, load font Roboto
│   ├── package.json                           # Dependencies: react, react-router-dom, axios
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
│   │   │   ├── rateLimiter.js                 # Giới hạn request: 100 req/phút chung, 30 req/phút cho search
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
| **Helmet + CORS** | Bảo mật HTTP headers, chỉ cho phép request từ client origin |
| **Compression** | Nén response > 1KB (level 6), tiết kiệm bandwidth |
| **Winston Logger** | Structured logging, file rotation trong production (5MB/file, 5 files) |
| **Centralized Error** | Mọi lỗi đi qua 1 middleware, ApiError class chuẩn hoá status code |
| **Graceful Shutdown** | Đóng kết nối sạch sẽ khi nhận SIGTERM/SIGINT, timeout 10s |
| **Input Sanitization** | Validate + clean slug, keyword trước khi gọi API bên thứ 3 |

### Frontend (Client)

| Kỹ thuật | Mô tả |
|----------|-------|
| **Lazy Loading** | `React.lazy` + `Suspense`, chỉ tải page khi người dùng truy cập |
| **Error Boundary** | Bắt lỗi render, hiển thị UI fallback thay vì crash toàn bộ app |
| **React.memo** | Tránh re-render không cần thiết cho MovieCard và các section |
| **Custom Hooks** | Tách logic gọi API khỏi UI, tái sử dụng giữa các page |
| **Code Splitting** | Vite manualChunks tách vendor (react, react-dom) thành bundle riêng |
| **Image Lazy Load** | `loading="lazy"` cho ảnh ngoài viewport, giảm thời gian tải trang |
| **Vite Proxy** | Dev proxy `/api/*` sang backend, không cần cấu hình CORS khi dev |

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
