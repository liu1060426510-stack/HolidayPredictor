import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  Check,
  ChevronDown,
  CircleHelp,
  CloudRain,
  Compass,
  Database,
  ExternalLink,
  Eye,
  Flag,
  Gauge,
  Globe2,
  LocateFixed,
  Menu,
  MessageSquareWarning,
  Moon,
  Play,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  Sun,
  Thermometer,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  countyForecasts,
  disasterReports,
  LEGAL_DISCLAIMER,
  liveStreams,
  officialBenchmark,
  Region,
  regions,
  riskLabel,
} from "@/lib/holiday-data";

const navItems = [
  { id: "dashboard", label: "放假雷達" },
  { id: "typhoon", label: "颱風追蹤" },
  { id: "streams", label: "風雨直播" },
  { id: "reports", label: "災情回報" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionLabel({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p className="section-detail">{detail}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const halted = status === "停止上班上課";
  const announced = status !== "尚未宣布";
  return (
    <span className={`status-pill ${halted ? "status-halted" : announced ? "status-normal" : "status-pending"}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function CountyCard({ forecast }: { forecast: (typeof countyForecasts)[number] }) {
  const benchmark = officialBenchmark(forecast);
  const risk = riskLabel(forecast.probability);
  return (
    <article className={`county-card ${forecast.status === "停止上班上課" ? "county-alert" : ""}`}>
      <div className="county-card-topline">
        <span className="region-tag">{forecast.region}</span>
        <span className="updated">{forecast.updatedAt}更新</span>
      </div>
      <div className="county-name-row">
        <h3>{forecast.name}</h3>
        <StatusPill status={forecast.status} />
      </div>
      <div className="probability-row">
        <div>
          <span className="metric-caption">停班停課機率</span>
          <div className={`probability-value ${risk.className}`}>
            {forecast.probability}<small>%</small>
          </div>
        </div>
        <div className={`risk-chip ${risk.className}`}>
          <span className="risk-pulse" />{risk.label}
        </div>
      </div>
      <div className="weather-metrics">
        <div><Wind size={14} /><span>陣風</span><strong>{forecast.gust}<small>級</small></strong></div>
        <div><Gauge size={14} /><span>平均風力</span><strong>{forecast.wind}<small>級</small></strong></div>
        <div><CloudRain size={14} /><span>24h 雨量</span><strong>{forecast.rain24h}<small>mm</small></strong></div>
      </div>
      <div className="benchmark-row">
        <span>法規基準</span>
        <span className={benchmark.wind ? "met" : "not-met"}><span>{benchmark.wind ? "✓" : "—"}</span>平均風 ≥ 7</span>
        <span className={benchmark.gust ? "met" : "not-met"}><span>{benchmark.gust ? "✓" : "—"}</span>陣風 ≥ 10</span>
        <span className={benchmark.rain ? "met" : "not-met"}><span>{benchmark.rain ? "✓" : "—"}</span>雨量門檻</span>
      </div>
    </article>
  );
}

function TyphoonRadar() {
  return (
    <div className="radar-shell">
      <div className="radar-topline"><span><span className="live-dot" />SIMULATION · 即時模擬</span><span>資料時間 14:26:08</span></div>
      <div className="radar-map">
        <div className="map-grid" />
        <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
        <svg className="taiwan-outline" viewBox="0 0 200 320" aria-hidden="true">
          <path d="M123 12 C150 31 161 65 150 96 C143 116 151 132 137 152 C127 166 131 190 115 209 C106 222 101 250 85 277 C77 291 66 300 57 293 C45 283 51 258 63 237 C76 213 78 190 76 174 C73 153 88 141 92 120 C99 91 96 71 104 49 C108 37 111 21 123 12Z" />
        </svg>
        <div className="storm-core"><span className="storm-core-pulse" /><span className="storm-label">TY-07</span></div>
        <div className="map-point taipei-point"><span />臺北</div>
        <div className="map-point hualien-point"><span />花蓮</div>
        <div className="map-point kaohsiung-point"><span />高雄</div>
        <div className="track-line track-one" /><div className="track-line track-two" />
        <div className="radar-callout"><span className="callout-kicker">中心位置</span><strong>24.7°N · 122.4°E</strong><span>每小時西北西 14 km</span></div>
        <div className="radar-legend"><span><i className="legend-red" />暴風圈 180 km</span><span><i className="legend-orange" />預測路徑</span></div>
      </div>
      <div className="radar-stats">
        <div><span>近中心最大風速</span><strong>43 <small>m/s</small></strong></div>
        <div><span>七級風半徑</span><strong>180 <small>km</small></strong></div>
        <div><span>移動速度</span><strong>14 <small>km/h</small></strong></div>
        <button type="button" onClick={() => toast.info("雷達圖將在 CWA API 接入後切換為即時圖層。")}><ExternalLink size={14} />開啟互動雷達</button>
      </div>
    </div>
  );
}

function StreamCard({ stream }: { stream: (typeof liveStreams)[number] }) {
  return (
    <article className="stream-card">
      <div className="stream-thumb" style={{ "--stream-accent": stream.accent } as CSSProperties}>
        <div className="stream-scanlines" />
        <div className="stream-landscape"><span className="hill hill-a" /><span className="hill hill-b" /><span className="rain-streaks" /></div>
        <div className="stream-thumb-top"><span className={stream.status === "LIVE" ? "stream-live" : "stream-replay"}><span />{stream.status}</span><span><Eye size={12} /> {stream.viewers}</span></div>
        <button className="stream-play" type="button" onClick={() => toast.success(`正在開啟 ${stream.title}`)} aria-label={`播放 ${stream.title}`}><Play size={18} fill="currentColor" /></button>
        <span className="stream-location"><LocateFixed size={12} />{stream.city}</span>
      </div>
      <div className="stream-copy"><h3>{stream.title}</h3><p>{stream.subtitle}</p></div>
    </article>
  );
}

function ReportForm() {
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("積水");
  const [submitted, setSubmitted] = useState(false);

  function submitReport(event: FormEvent) {
    event.preventDefault();
    if (!location.trim() || !summary.trim()) {
      toast.error("請填寫地點與現場描述");
      return;
    }
    setSubmitted(true);
    toast.success("回報已送出，將在審核後顯示於公開災情流。");
    setLocation("");
    setSummary("");
  }

  return (
    <div className="report-layout">
      <form className="report-form" onSubmit={submitReport}>
        <div className="form-heading"><div className="icon-box orange"><MessageSquareWarning size={18} /></div><div><h3>回報現場狀況</h3><p>每一則回報都會先經過審核。</p></div></div>
        <label>發生地點<Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="例如：臺北市大安區仁愛路" /></label>
        <label>狀況類型<select value={category} onChange={(event) => setCategory(event.target.value)}><option>積水</option><option>強風</option><option>路況</option><option>停電</option><option>其他</option></select></label>
        <label>現場描述<Textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="請描述現場看到的風雨、積水或道路狀況" /></label>
        <div className="form-actions"><span><ShieldCheck size={14} />請勿提交個人敏感資訊</span><Button type="submit"><Send size={15} />送出回報</Button></div>
        {submitted && <div className="submission-note"><Check size={15} />已進入待審核佇列，感謝你的協助。</div>}
      </form>
      <div className="report-feed">
        <div className="feed-heading"><div><p className="eyebrow">COMMUNITY SIGNALS</p><h3>即時災情流</h3></div><span className="pending-badge"><span />{disasterReports.length + 4} 則已核准</span></div>
        {disasterReports.map((report) => <div className="report-item" key={report.id}><div className="report-item-meta"><span className="report-category">{report.category}</span><span>{report.time} · {report.id}</span></div><strong>{report.location}</strong><p>{report.summary}</p></div>)}
      </div>
    </div>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [region, setRegion] = useState<(typeof regions)[number]>("全部");
  const [search, setSearch] = useState("");
  const [streamRegion, setStreamRegion] = useState<Region | "全部">("全部");
  const [simulationMode, setSimulationMode] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("14:26:08");

  useEffect(() => {
    const timer = window.setInterval(() => setLastRefresh(new Date().toLocaleTimeString("zh-TW", { hour12: false })), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredCounties = useMemo(() => countyForecasts.filter((county) => {
    const regionMatch = region === "全部" || county.region === region;
    const searchMatch = !search || county.name.includes(search.trim());
    return regionMatch && searchMatch;
  }), [region, search]);
  const filteredStreams = useMemo(() => liveStreams.filter((stream) => streamRegion === "全部" || stream.region === streamRegion), [streamRegion]);
  const haltedCount = countyForecasts.filter((county) => county.status === "停止上班上課").length;

  function handleNav(id: string) {
    setActiveNav(id);
    setMobileNavOpen(false);
    scrollToSection(id === "dashboard" ? "dashboard" : id);
  }

  return (
    <div className="app-shell">
      <div className="emergency-strip"><div className="container emergency-inner"><span className="emergency-live"><span />LIVE</span><span>即時更新中</span><span className="emergency-divider" /><strong>目前已有 {haltedCount} 縣市宣布停班停課</strong><span className="emergency-spacer" /><span className="emergency-time">最後同步 {lastRefresh}</span><RefreshCw size={13} /></div></div>
      <header className="site-header"><div className="container header-inner"><button className="brand" onClick={() => handleNav("dashboard")} aria-label="回到首頁"><span className="brand-mark"><CloudRain size={19} /></span><span><strong>Holiday<span>Predictor</span></strong><small>台灣即時放假雷達</small></span></button><nav className={`main-nav ${mobileNavOpen ? "nav-open" : ""}`}>{navItems.map((item) => <button type="button" key={item.id} className={activeNav === item.id ? "nav-active" : ""} onClick={() => handleNav(item.id)}>{item.label}</button>)}<Link href="/admin" className="admin-nav" onClick={() => setMobileNavOpen(false)}><Settings2 size={15} />管理後台</Link></nav><div className="header-actions"><button className="icon-button" onClick={toggleTheme} aria-label="切換明暗模式">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button><Link href="/admin" className="header-admin"><Settings2 size={15} />Admin</Link><button className="menu-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="開啟選單">{mobileNavOpen ? <X size={20} /> : <Menu size={20} />}</button></div></div></header>
      <main>
        <section className="hero-section" id="dashboard"><div className="container hero-grid"><div className="hero-copy"><div className="hero-kicker"><span className="kicker-line" />TAIWAN WEATHER INTELLIGENCE</div><h1>先知道，<br /><em>再決定</em>今天怎麼走。</h1><p className="hero-lead">把風雨數據、官方公告與現場回報，<br className="desktop-only" />整理成你現在就能看懂的放假判斷。</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollToSection("county-status")}>查看我的縣市 <ArrowDownRight size={17} /></button><button className="quiet-cta" onClick={() => scrollToSection("typhoon")}><Radio size={16} />查看颱風追蹤</button></div><div className="hero-proof"><div className="avatar-stack"><span>北</span><span>中</span><span>南</span><span>東</span></div><span>22 縣市資料持續同步</span><span className="proof-divider" /><span><span className="green-dot" />CWA 資料已更新</span></div></div><div className="hero-signal"><div className="signal-card signal-card-main"><div className="signal-card-label"><span><Activity size={14} />TAIWAN STATUS INDEX</span><span className="signal-up"><ArrowUpRight size={13} />+12.4%</span></div><div className="signal-number">72<span>/100</span></div><div className="signal-meter"><span style={{ width: "72%" }} /></div><div className="signal-footer"><span>風雨風險指數</span><strong>偏高 · 北部優先注意</strong></div></div><div className="floating-data floating-data-wind"><Wind size={15} /><div><span>臺北陣風</span><strong>10.8 <small>級</small></strong></div></div><div className="floating-data floating-data-rain"><CloudRain size={15} /><div><span>24H 累積雨量</span><strong>242 <small>mm</small></strong></div></div><div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" /></div></div></section>
        <section className="notice-section"><div className="container notice-inner"><div className="notice-icon"><BellRing size={16} /></div><p><strong>重要提醒</strong>{LEGAL_DISCLAIMER}</p><button type="button" onClick={() => toast.info("本平台提供演算法預測，官方資訊請以 DGPA 與各縣市政府公告為準。")}><CircleHelp size={15} /></button></div></section>
        <section className="status-section" id="county-status"><div className="container"><SectionLabel eyebrow="01 / COUNTY STATUS" title="全台停班停課雷達" detail="依 CWA 風雨預測與法規基準，計算未來 24 小時的風險機率。" /><div className="status-toolbar"><div className="filter-tabs">{regions.map((item) => <button type="button" key={item} className={region === item ? "filter-active" : ""} onClick={() => setRegion(item)}>{item}</button>)}</div><div className="search-control"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜尋縣市" /><SlidersHorizontal size={15} /></div></div><div className="status-summary"><span>顯示 <strong>{filteredCounties.length}</strong> / 22 縣市</span><span className="summary-legend"><span className="legend-key key-halted" />停止上班 <span className="legend-key key-pending" />尚未宣布 <span className="legend-key key-normal" />正常上班</span></div><div className="county-grid">{filteredCounties.map((forecast) => <CountyCard key={forecast.id} forecast={forecast} />)}</div>{filteredCounties.length === 0 && <div className="empty-state"><Search size={22} /><h3>找不到這個縣市</h3><p>試試看搜尋「臺北」或切換其他區域。</p></div>}</div></section>
        <section className="typhoon-section" id="typhoon"><div className="container"><SectionLabel eyebrow="02 / STORM TRACKING" title="颱風與雷達圖" detail="Test Typhoon Scenario · 模擬資料每 30 秒刷新" /><TyphoonRadar /></div></section>
        <section className="streams-section" id="streams"><div className="container"><SectionLabel eyebrow="03 / LIVE CAMERAS" title="各地風雨直播" detail="從現場看見風雨，掌握你所在的城市。" /><div className="stream-toolbar"><div className="stream-filters">{["全部", "北部", "中部", "南部", "東部", "離島"].map((item) => <button type="button" key={item} className={streamRegion === item ? "stream-filter-active" : ""} onClick={() => setStreamRegion(item as Region | "全部")}>{item}</button>)}</div><button type="button" className="outline-action" onClick={() => toast.info("直播管理功能將在後台啟用。 ")}><Globe2 size={15} />查看全部直播 <ArrowUpRight size={14} /></button></div><div className="stream-grid">{filteredStreams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}</div></div></section>
        <section className="reports-section" id="reports"><div className="container"><SectionLabel eyebrow="04 / COMMUNITY REPORTS" title="一起回報現場" detail="你的一則訊息，可能正好讓別人避開風險。" /><ReportForm /></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><span className="brand-mark"><CloudRain size={17} /></span><div><strong>Holiday<span>Predictor</span></strong><p>台灣即時放假雷達</p></div></div><div className="footer-status"><span><Database size={14} />資料模式</span><button className={`mode-switch ${simulationMode ? "mode-simulation" : "mode-real"}`} onClick={() => { setSimulationMode((mode) => !mode); toast.info(simulationMode ? "已切換至 Real API Mode（尚待配置 API Key）" : "已切換至 Simulation Mode"); }}><span />{simulationMode ? "Simulation Mode" : "Real API Mode"}</button><span className="footer-divider" /><span><Signal size={14} />API status <strong className="api-ok">Operational</strong></span></div><div className="footer-links"><Link href="/admin">Admin Console <ArrowUpRight size={13} /></Link><a href="#dashboard">回到頂部 <ArrowUpRight size={13} /></a></div></div><div className="container footer-bottom"><span>© 2026 HolidayPredictor · Built for typhoon days in Taiwan.</span><span>資料來源：中央氣象署 CWA · DGPA · 社群回報</span></div></footer>
    </div>
  );
}
