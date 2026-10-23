# HolidayPredictor

台灣即時放假預測與災情直播平台的產品規格與開發基礎。

本專案規格涵蓋台灣 22 縣市的停班停課機率預測、中央氣象署（CWA）氣象資料、官方公告、颱風與雷達追蹤、全台 CCTV／直播、群眾災情回報，以及具備 RBAC 的管理後台。

## 目前內容

- [產品規格](docs/holidaypredictor-spec.txt)
- 全部頁面與介面須採用 responsive design，支援手機、平板與桌面尺寸。

## 預計技術方向

- Frontend：React／Next.js、Tailwind CSS、Lucide Icons、Leaflet 或 Mapbox
- Backend：Node.js API 或 Next.js API Routes
- Database：SQLite／PostgreSQL 搭配 Prisma 或 Drizzle ORM
- Real-time：WebSocket 或 Server-Sent Events（SSE）

## 開發注意事項

規格中的預設管理員帳號僅供本機模擬／開發使用；正式環境必須改用安全的密碼雜湊、環境變數與初始密碼輪替機制，不能直接沿用示範憑證。
