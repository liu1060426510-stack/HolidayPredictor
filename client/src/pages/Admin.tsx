import { useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  CloudRain,
  Database,
  FileClock,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Megaphone,
  MoreHorizontal,
  Radio,
  Search,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { countyForecasts, disasterReports } from "@/lib/holiday-data";

const sideItems = [
  { icon: LayoutDashboard, label: "總覽", active: true },
  { icon: SlidersHorizontal, label: "狀態覆寫" },
  { icon: Radio, label: "直播管理" },
  { icon: ShieldCheck, label: "災情審核" },
  { icon: Megaphone, label: "系統公告" },
];

export default function Admin() {
  const [override, setOverride] = useState("臺北市");
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const halted = countyForecasts.filter((county) => county.status === "停止上班上課").length;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand"><span className="brand-mark"><CloudRain size={18} /></span><span><strong>Holiday<span>Predictor</span></strong><small>CONTROL ROOM</small></span></Link>
        <div className="admin-profile"><div className="profile-avatar">AD</div><div><strong>系統管理員</strong><span>admin@example.com</span></div><span className="profile-online" /></div>
        <nav className="admin-nav-list">{sideItems.map(({ icon: Icon, label, active }) => <button key={label} className={active ? "admin-side-active" : ""} onClick={() => toast.info(`${label}模組正在準備中。`)}><Icon size={17} />{label}{label === "災情審核" && <span className="nav-count">8</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="system-health"><span className="health-dot" /><div><strong>All systems operational</strong><small>最後檢查 · 14:25:48</small></div></div><Link href="/" className="back-home"><ArrowLeft size={15} />返回公開首頁</Link></div>
      </aside>
      <main className="admin-main"><header className="admin-header"><div><p className="eyebrow">ADMIN CONSOLE / OVERVIEW</p><h1>營運總覽</h1></div><div className="admin-header-actions"><div className="admin-search"><Search size={15} /><Input placeholder="搜尋模組或縣市" /></div><button className="admin-icon-btn" onClick={() => setAnnouncementOpen(true)}><Megaphone size={17} /><span /></button><button className="admin-user-btn"><div className="profile-avatar small">AD</div><ChevronRight size={14} /></button></div></header>
        <div className="admin-alert"><div className="admin-alert-icon"><Activity size={17} /></div><div><strong>Simulation Mode 正在運作</strong><p>目前前台顯示 Test Typhoon Scenario。正式上線前請配置 CWA 與 DGPA API。</p></div><button onClick={() => toast.info("已保留資料模式切換於公開頁面底部。")}>查看設定 <ArrowUpRight size={14} /></button></div>
        <section className="admin-metrics"><div className="admin-metric-card"><div className="metric-icon blue"><Users size={17} /></div><span>目前線上人數</span><strong>2,481</strong><small><span className="metric-positive">+18.6%</span> vs. 1 小時前</small><div className="mini-chart blue-chart"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-metric-card"><div className="metric-icon orange"><SlidersHorizontal size={17} /></div><span>停班停課縣市</span><strong>{halted}<small> / 22</small></strong><small><span className="metric-negative">+2</span> 過去 30 分鐘</small><div className="metric-progress"><span style={{ width: `${(halted / 22) * 100}%` }} /></div></div><div className="admin-metric-card"><div className="metric-icon green"><Database size={17} /></div><span>API 成功率</span><strong>99.84<small>%</small></strong><small><span className="metric-positive">Healthy</span> · 423 requests</small><div className="mini-chart green-chart"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-metric-card"><div className="metric-icon purple"><FileClock size={17} /></div><span>待審核回報</span><strong>8</strong><small><span className="metric-neutral">需要處理</span> · 最早 12 分鐘前</small><div className="metric-progress purple-progress"><span style={{ width: "62%" }} /></div></div></section>
        <section className="admin-columns"><div className="admin-panel override-panel"><div className="panel-heading"><div><p className="eyebrow">EMERGENCY OVERRIDE</p><h2>緊急手動介入</h2></div><span className="panel-live"><span />可即時發布</span></div><p className="panel-intro">當官方爬蟲尚未同步時，可在這裡即時調整城市狀態。每次覆寫都會留下操作紀錄。</p><label className="admin-label">選擇縣市<div className="select-wrap"><select value={override} onChange={(event) => setOverride(event.target.value)}>{countyForecasts.map((county) => <option key={county.id}>{county.name}</option>)}</select><ChevronRight size={15} /></div></label><div className="override-current"><div><span>目前官方狀態</span><strong><span className="status-dot status-dot-orange" />{countyForecasts.find((county) => county.name === override)?.status}</strong></div><div><span>演算法預測</span><strong className="override-number">{countyForecasts.find((county) => county.name === override)?.probability}% <small>高機率</small></strong></div></div><div className="override-actions"><Button variant="outline" onClick={() => toast.success(`${override} 已恢復自動同步`)}>恢復自動</Button><Button onClick={() => toast.success(`${override} 已發布「停止上班上課」覆寫`)}><ShieldCheck size={15} />發布停止上班</Button></div><div className="audit-note"><LockKeyhole size={14} />需要二次確認 · 發布後將通知所有前台訪客</div></div><div className="admin-panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE AUDIT LOG</p><h2>最近操作</h2></div><button className="more-btn"><MoreHorizontal size={18} /></button></div><div className="audit-list"><div className="audit-row"><span className="audit-icon orange"><Megaphone size={14} /></span><div><strong>發布緊急公告</strong><p>臺北市停止上班上課 · system_admin</p></div><time>2 分鐘前</time></div><div className="audit-row"><span className="audit-icon blue"><Radio size={14} /></span><div><strong>更新直播頻道</strong><p>九份山城 · YouTube Live ID</p></div><time>18 分鐘前</time></div><div className="audit-row"><span className="audit-icon purple"><ShieldCheck size={14} /></span><div><strong>核准災情回報</strong><p>R-2401 · 大安區強風</p></div><time>26 分鐘前</time></div><div className="audit-row"><span className="audit-icon green"><ServerCog size={14} /></span><div><strong>API adapter 健康檢查</strong><p>CWA rainfall forecast · 200 OK</p></div><time>31 分鐘前</time></div></div><button className="panel-link" onClick={() => toast.info("完整 audit log 將在資料庫接入後提供。")}>查看完整紀錄 <ArrowUpRight size={14} /></button></div></section>
        <section className="admin-panel moderation-panel"><div className="panel-heading"><div><p className="eyebrow">MODERATION QUEUE</p><h2>災情回報審核</h2></div><button className="panel-link" onClick={() => toast.info("審核工作台正在準備中。")}>開啟工作台 <ArrowUpRight size={14} /></button></div><div className="moderation-table"><div className="table-row table-head"><span>回報內容</span><span>類型</span><span>提交時間</span><span>狀態</span><span /></div>{[...disasterReports, { id: "R-2404", location: "新竹縣 · 五峰鄉", category: "路況", summary: "山區道路有零星落石，待現場確認。", time: "08:16", status: "待審核" as const }].map((report) => <div className="table-row" key={report.id}><div className="report-table-copy"><strong>{report.location}</strong><span>{report.summary}</span></div><span className="table-category">{report.category}</span><span>{report.time} · {report.id}</span><span className={`table-status ${report.status === "待審核" ? "waiting" : "approved"}`}>{report.status === "待審核" ? "待處理" : <><Check size={13} />已核准</>}</span><button className="row-more" onClick={() => toast.success(`${report.id} 已標記為已核准。`)}><MoreHorizontal size={17} /></button></div>)}</div></section>
      </main>
      {announcementOpen && <div className="modal-backdrop" onClick={() => setAnnouncementOpen(false)}><div className="announcement-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setAnnouncementOpen(false)}><X size={18} /></button><div className="modal-icon"><Megaphone size={19} /></div><p className="eyebrow">BROADCAST ALERT</p><h2>發布系統公告</h2><p>這則公告會顯示在所有前台訪客的緊急通知列。</p><textarea placeholder="例如：臺北市已宣布明日停止上班上課。" /><div className="modal-footer"><span><Gauge size={14} />預計觸及 2,481 位訪客</span><Button onClick={() => { setAnnouncementOpen(false); toast.success("系統公告已送出。") }}>立即發布 <ArrowUpRight size={14} /></Button></div></div></div>}
    </div>
  );
}
