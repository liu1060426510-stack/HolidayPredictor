# HolidayPredictor TODO

## 已完成：可預覽的公開首頁骨架

- [x] 顯示即時更新 ticker、停班停課縣市數量與法律免責聲明。
- [x] 提供 light/dark mode toggle 與 mobile-responsive navigation。
- [x] 提供完整台灣 22 縣市資料結構，可依北部、中部、南部、東部、離島篩選或城市搜尋。
- [x] 每個縣市顯示「正常上班上課」「停止上班上課」「尚未宣布」、預測機率、陣風、平均風力、24 小時雨量與官方基準 checklist。
- [x] 提供颱風中心、暴風圈、移動速度與預測路徑的 mock map 視覺區，以及衛星／雷達入口。
- [x] 提供九份、墾丁、高雄港、陽明山、花蓮等地的直播卡片與區域篩選。
- [x] 提供群眾災情回報表單，提交後以 pending moderation 狀態回饋。
- [x] 提供 Simulation Mode／Real API Mode 控制列與資料 freshness 標示。

## 已完成：後台與資料層邊界

- [x] 新增 `/admin` 管理後台入口，涵蓋城市狀態覆寫、機率調整、公告、直播管理、回報審核與系統 metrics 卡片。
- [x] 新增 `/reports` 公開回報頁入口並共用回報元件。
- [x] 新增 Drizzle schema 的縣市狀態、直播、災情回報、公告與氣象紀錄資料表形狀。
- [x] 新增 tRPC `holiday` router 的 mock query 與回報 mutation 邊界。

## 後續整合：保留產品要求

- [ ] 接入 CWA F-C0032-001、F-D0047-091、風速與即時颱風 API，包含 rate limit、快取與錯誤回退。
- [ ] 接入 DGPA 官方公告，並將 parser 與手動 admin override 串接到正式資料庫。
- [ ] 加入真正的 admin session／RBAC route guard 與安全的初始密碼輪替；示範帳密不可用於 production。
- [ ] 將即時資料更新由 mock polling-ready interface 替換為 SSE 或 WebSocket。
- [ ] 將直播 mock entries 改為可驗證的 YouTube Live ID 與後台 CRUD。
- [ ] 建立正式 migration、seed 與 production observability，包括 API logs、online counter 與性能 metrics。
- [ ] 補上合規的通知整合（LINE／Web Push）與使用者隱私、內容審核政策。
