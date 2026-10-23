# HolidayPredictor

台灣即時放假預測與災情直播平台的初始全端 MVP。

本專案涵蓋台灣 22 縣市的停班停課機率預測、中央氣象署（CWA）氣象資料、官方公告、颱風與雷達追蹤、全台 CCTV／直播、群眾災情回報，以及具備 RBAC 邊界的管理後台。

## 已完成

- 公開首頁：即時 ticker、法律免責聲明、明暗模式、響應式導覽。
- 22 縣市停班停課儀表板：區域篩選、城市搜尋、官方狀態、機率、風雨參數、法規基準 checklist。
- 颱風情境追蹤：中心位置、暴風圈、預測路徑與模擬資料模式。
- 風雨直播：九份、陽明山、墾丁、高雄港、花蓮等直播卡片與區域篩選。
- 群眾災情回報：回報表單、待審核狀態與已核准災情流。
- `/admin` 管理後台：狀態覆寫、系統公告、直播管理、災情審核與系統 metrics 初始介面。
- tRPC API 邊界與 Drizzle schema：縣市狀態、直播、災情回報、公告、氣象紀錄。

## 本機開發

```bash
pnpm install
pnpm dev
```

開發伺服器預設使用 `PORT=3000`。其他常用指令：

```bash
pnpm check       # TypeScript 型別檢查
pnpm build       # Vite + Express production build
pnpm test        # Vitest
pnpm db:migrate  # 套用 Drizzle migrations
```

## 專案文件

- [實作與設計計畫](plan.md)
- [開發 TODO](TODO.md)
- [完整產品規格](docs/holidaypredictor-spec.txt)

## 資料與安全注意事項

目前前台使用 Simulation Mode mock data，Real API Mode 只保留切換介面；接入 CWA／DGPA 前需配置安全的 server-side secrets、API rate limit、快取與錯誤回退。規格中的 `admin@example.com`／`admin123` 僅可作為本機開發示範，正式環境必須改用密碼雜湊、環境變數與初始密碼輪替。

本專案沿用 React / Express / tRPC / Drizzle starter。平台設定可透過 `webdev.config` 管理，私密金鑰只應留在 server-side。
