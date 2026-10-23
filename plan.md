# HolidayPredictor 實作計畫

## 產品方向

HolidayPredictor 是台灣即時放假預測與災情直播平台。第一版先以可預覽的 MVP 交付完整資訊架構與主要互動：22 縣市狀態與機率儀表板、颱風情境視覺化、直播入口、災情回報與管理後台入口。資料層先保留 CWA／DGPA 的可替換介面，預設使用 Simulation Mode 的 mock data，避免未配置 API key 時破壞使用流程。

## 技術與結構

- React + TypeScript + Vite，沿用 WebDev `web-db-user` starter。
- Tailwind CSS v4 與 Lucide Icons；不引入不必要的 UI 套件。
- Express + tRPC 路由保留後端邊界；Drizzle schema 定義 counties、streams、reports、announcements、weather logs 的持久化形狀。
- `/manus-routes.json` 宣告 `/`、`/admin` 與 `/reports` 三個產品路由。
- 前台 mock data 以 type-safe 結構集中管理，後續可由 tRPC query 替換；模式切換保留在 footer 的控制列。

## 專案結構

- `client/src/pages/Home.tsx`：公開首頁、縣市 dashboard、颱風 map、直播與回報互動。
- `client/src/pages/Admin.tsx`：管理後台初始入口，提供覆寫、審核、公告與 metrics 卡片。
- `client/src/lib/holiday-data.ts`：22 縣市、直播、回報資料與共同型別。
- `server/routers.ts`：auth 與 HolidayPredictor tRPC API 邊界。
- `drizzle/schema.ts`：使用者、縣市狀態、直播、災情回報、公告與氣象紀錄 schema。
- `client/public/manus-routes.json`：平台 route manifest。

## Design

### 三個可選方向

- **Storm Control Room / night navy dashboard**：0.06
- **Civic weather almanac / warm paper**：0.07
- **Taiwan signal map / luminous cyan**：0.08

### 採用：Storm Control Room / night navy dashboard

**Design Movement**：將防災指揮中心的資訊密度轉化成清晰、克制的數位 dashboard，讓重要警示像航海儀表一樣先被讀到。

**Core Principles**：1) 警示先於裝飾；2) 數據有明確層級；3) 每個卡片都能導向行動；4) 手機尺寸仍保留核心決策資訊。

**Color Philosophy**：深海軍藍作為穩定背景，橙紅色只用於高風險與停止上班上課，酸橙綠表示資料新鮮與安全，藍綠色代表氣象資料與地理層。

**Layout Paradigm**：桌面以「左側指揮欄 + 右側資料舞台」呈現，主 dashboard 採上下節奏而非平均卡片牆；手機改成單欄閱讀流，將警示、狀態、颱風與回報依優先級排序。

**Signature Elements**：斜切角的警示標籤、細線等高線與雷達波紋、具有資料 freshness 的小型 pulse dot。

**Interaction Philosophy**：互動需要回應風險語境：篩選立即更新狀態、模式切換明確標示 Simulation、回報成功後以 toast 與 pending badge 回饋，而不是靜默完成。

**Animation**：只使用 150–260ms 的 opacity、translate 與 pulse；雷達波紋慢速循環，重要警示不做跳動避免造成疲勞。

**Typography System**：`Noto Sans TC` 優先，搭配 `IBM Plex Mono` 顯示時間、風力與機率。標題使用緊湊粗體，數值使用等寬字，正文保持高對比與較寬行距。

**Brand Essence**：把天氣不確定性翻譯成可行動的台灣在地決策工具；個性為可靠、敏捷、在地。

**Brand Voice**：標題直接而有判斷，「先看你所在的縣市，再決定今天怎麼走。」CTA 使用行動語氣，「回報現場狀況」與「查看官方依據」。

**Wordmark & Logo**：以等高線包住一個向上箭頭與雨滴的幾何標記，代表「看見風雨變化，提前決策」；文字標誌採 HolidayPredictor + 即時放假雷達。

**Signature Brand Color**：`Signal Orange #FF6B35`，只在警示、行動與高機率結果出現，建立平台識別。

## API 邊界

- CWA adapter：支援 `F-C0032-001`、`F-D0047-091`、風速與颱風資料，先以 simulation adapter 供 UI 使用。
- DGPA adapter：官方公告抓取失敗時回退至最近一次快取與 admin override。
- Realtime：先以 client polling-ready interface 表達更新；後續可接 SSE／WebSocket，不改動 UI 型別。
- Auth：沿用 starter 的 Manus session；後續加入 admin role guard 與 `admin@example.com` 開發 seed。
