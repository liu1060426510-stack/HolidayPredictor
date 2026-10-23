export type Region = "北部" | "中部" | "南部" | "東部" | "離島";
export type OfficialStatus = "停止上班上課" | "正常上班上課" | "尚未宣布";

export type CountyForecast = {
  id: string;
  name: string;
  region: Region;
  status: OfficialStatus;
  probability: number;
  gust: number;
  wind: number;
  rain24h: number;
  updatedAt: string;
};

export type LiveStream = {
  id: string;
  city: string;
  region: Region;
  title: string;
  subtitle: string;
  viewers: string;
  accent: string;
  status: "LIVE" | "REPLAY";
};

export type DisasterReport = {
  id: string;
  location: string;
  category: string;
  summary: string;
  time: string;
  status: "待審核" | "已核准";
};

export const LEGAL_DISCLAIMER =
  "本站預測數據由演算法結合氣象預報推算，實際停班停課資訊請以行政院人事行政總處（DGPA）及各縣市政府官方公告為準。";

export const countyForecasts: CountyForecast[] = [
  { id: "taipei", name: "臺北市", region: "北部", status: "停止上班上課", probability: 88, gust: 10.8, wind: 7.1, rain24h: 242, updatedAt: "1 分鐘前" },
  { id: "new-taipei", name: "新北市", region: "北部", status: "停止上班上課", probability: 84, gust: 10.2, wind: 6.8, rain24h: 228, updatedAt: "1 分鐘前" },
  { id: "keelung", name: "基隆市", region: "北部", status: "停止上班上課", probability: 81, gust: 10.4, wind: 6.6, rain24h: 265, updatedAt: "2 分鐘前" },
  { id: "taoyuan", name: "桃園市", region: "北部", status: "停止上班上課", probability: 78, gust: 9.8, wind: 6.4, rain24h: 186, updatedAt: "2 分鐘前" },
  { id: "hsinchu-city", name: "新竹市", region: "北部", status: "尚未宣布", probability: 71, gust: 9.4, wind: 6.2, rain24h: 164, updatedAt: "3 分鐘前" },
  { id: "hsinchu-county", name: "新竹縣", region: "北部", status: "尚未宣布", probability: 76, gust: 9.7, wind: 6.4, rain24h: 218, updatedAt: "3 分鐘前" },
  { id: "yilan", name: "宜蘭縣", region: "東部", status: "停止上班上課", probability: 75, gust: 10.1, wind: 6.9, rain24h: 312, updatedAt: "2 分鐘前" },
  { id: "miaoli", name: "苗栗縣", region: "中部", status: "尚未宣布", probability: 64, gust: 8.7, wind: 5.4, rain24h: 148, updatedAt: "4 分鐘前" },
  { id: "taichung", name: "臺中市", region: "中部", status: "尚未宣布", probability: 58, gust: 8.1, wind: 5.2, rain24h: 96, updatedAt: "4 分鐘前" },
  { id: "changhua", name: "彰化縣", region: "中部", status: "尚未宣布", probability: 52, gust: 7.8, wind: 4.7, rain24h: 84, updatedAt: "4 分鐘前" },
  { id: "nantou", name: "南投縣", region: "中部", status: "尚未宣布", probability: 61, gust: 8.2, wind: 5.1, rain24h: 177, updatedAt: "5 分鐘前" },
  { id: "yunlin", name: "雲林縣", region: "中部", status: "尚未宣布", probability: 49, gust: 7.3, wind: 4.4, rain24h: 71, updatedAt: "5 分鐘前" },
  { id: "chiayi-city", name: "嘉義市", region: "南部", status: "尚未宣布", probability: 42, gust: 6.8, wind: 4.1, rain24h: 55, updatedAt: "5 分鐘前" },
  { id: "chiayi-county", name: "嘉義縣", region: "南部", status: "尚未宣布", probability: 54, gust: 7.6, wind: 4.6, rain24h: 102, updatedAt: "5 分鐘前" },
  { id: "tainan", name: "臺南市", region: "南部", status: "尚未宣布", probability: 45, gust: 6.4, wind: 3.9, rain24h: 48, updatedAt: "6 分鐘前" },
  { id: "kaohsiung", name: "高雄市", region: "南部", status: "尚未宣布", probability: 39, gust: 6.1, wind: 3.8, rain24h: 32, updatedAt: "6 分鐘前" },
  { id: "屏東", name: "屏東縣", region: "南部", status: "尚未宣布", probability: 36, gust: 5.8, wind: 3.5, rain24h: 28, updatedAt: "6 分鐘前" },
  { id: "hualien", name: "花蓮縣", region: "東部", status: "尚未宣布", probability: 68, gust: 9.2, wind: 6.0, rain24h: 246, updatedAt: "3 分鐘前" },
  { id: "taitung", name: "臺東縣", region: "東部", status: "尚未宣布", probability: 59, gust: 8.3, wind: 5.3, rain24h: 134, updatedAt: "6 分鐘前" },
  { id: "penghu", name: "澎湖縣", region: "離島", status: "尚未宣布", probability: 47, gust: 9.0, wind: 6.1, rain24h: 38, updatedAt: "7 分鐘前" },
  { id: "kinmen", name: "金門縣", region: "離島", status: "尚未宣布", probability: 28, gust: 5.7, wind: 3.2, rain24h: 22, updatedAt: "7 分鐘前" },
  { id: "lienchiang", name: "連江縣", region: "離島", status: "尚未宣布", probability: 21, gust: 5.1, wind: 2.9, rain24h: 17, updatedAt: "7 分鐘前" },
];

export const liveStreams: LiveStream[] = [
  { id: "jiufen", city: "新北市", region: "北部", title: "九份山城 · 雨勢觀測", subtitle: "基隆北海岸即時畫面", viewers: "2.4K", accent: "#ff6b35", status: "LIVE" },
  { id: "yangmingshan", city: "臺北市", region: "北部", title: "陽明山 · 雲霧雷達", subtitle: "竹子湖氣象站周邊", viewers: "1.8K", accent: "#86efac", status: "LIVE" },
  { id: "kenting", city: "屏東縣", region: "南部", title: "墾丁大街 · 海象直播", subtitle: "恆春半島風況", viewers: "982", accent: "#7dd3fc", status: "LIVE" },
  { id: "kaohsiung-port", city: "高雄市", region: "南部", title: "高雄港 · 港區風雨", subtitle: "港口能見度與浪況", viewers: "764", accent: "#fcd34d", status: "LIVE" },
  { id: "hualien", city: "花蓮縣", region: "東部", title: "立霧溪 · 山區水位", subtitle: "太魯閣入口附近", viewers: "1.1K", accent: "#c4b5fd", status: "LIVE" },
  { id: "dongdamen", city: "花蓮縣", region: "東部", title: "東大門夜市 · 現場", subtitle: "市區降雨狀況", viewers: "438", accent: "#fb7185", status: "REPLAY" },
];

export const disasterReports: DisasterReport[] = [
  { id: "R-2401", location: "臺北市 · 大安區仁愛路", category: "強風", summary: "路口招牌掉落，已由警方拉設警戒線。", time: "08:42", status: "已核准" },
  { id: "R-2402", location: "新北市 · 瑞芳區九份", category: "積水", summary: "基山街低窪處約 15 公分積水，建議改道。", time: "08:36", status: "已核准" },
  { id: "R-2403", location: "宜蘭縣 · 礁溪鄉", category: "路況", summary: "台 9 線邊坡有落石，現場單線通行。", time: "08:29", status: "已核准" },
];

export const regions: Array<Region | "全部"> = ["全部", "北部", "中部", "南部", "東部", "離島"];

export function officialBenchmark(forecast: CountyForecast) {
  return {
    wind: forecast.wind >= 7,
    gust: forecast.gust >= 10,
    rain: forecast.rain24h >= 200,
  };
}

export function riskLabel(probability: number) {
  if (probability >= 75) return { label: "高機率", className: "risk-high" };
  if (probability >= 50) return { label: "中機率", className: "risk-medium" };
  return { label: "低機率", className: "risk-low" };
}
