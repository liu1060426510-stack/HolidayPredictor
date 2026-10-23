import { countyForecasts } from "../../client/src/lib/holiday-data";
import { ENV } from "../_core/env";
import { CWA_DATASETS, fetchCwaWeatherPoints } from "./cwa";
import { predictionFromCwaPoint } from "./prediction";

export type WeatherSnapshotItem = {
  countyId: string;
  countyName: string;
  region: string;
  officialStatus: "halted" | "normal" | "pending";
  probability: number;
  gust: number;
  averageWind: number;
  rainfall24h: number;
  benchmark: ReturnType<typeof predictionFromCwaPoint>["benchmark"];
  factors: ReturnType<typeof predictionFromCwaPoint>["factors"];
  source: "cwa" | "simulation";
};

export type WeatherSnapshot = {
  mode: "real" | "simulation";
  source: "cwa" | "simulation";
  dataset: string;
  fetchedAt: string;
  fromCache: boolean;
  items: WeatherSnapshotItem[];
  warning?: string;
};

const aliases: Record<string, string> = {
  臺北市: "taipei", 台北市: "taipei", 新北市: "new-taipei", 基隆市: "keelung", 桃園市: "taoyuan", 新竹市: "hsinchu-city", 新竹縣: "hsinchu-county", 苗栗縣: "miaoli", 臺中市: "taichung", 台中市: "taichung", 彰化縣: "changhua", 南投縣: "nantou", 雲林縣: "yunlin", 嘉義市: "chiayi-city", 嘉義縣: "chiayi-county", 臺南市: "tainan", 台南市: "tainan", 高雄市: "kaohsiung", 屏東縣: "pingtung", 宜蘭縣: "yilan", 花蓮縣: "hualien", 臺東縣: "taitung", 台東縣: "taitung", 澎湖縣: "penghu", 金門縣: "kinmen", 連江縣: "lienchiang",
};

const regionById = new Map(countyForecasts.map((item) => [item.id, item.region]));

function simulationSnapshot(): WeatherSnapshot {
  return {
    mode: "simulation",
    source: "simulation",
    dataset: "Test Typhoon Scenario",
    fetchedAt: new Date().toISOString(),
    fromCache: false,
    items: countyForecasts.map((item) => ({
      countyId: item.id,
      countyName: item.name,
      region: item.region,
      officialStatus: item.status === "停止上班上課" ? "halted" : item.status === "正常上班上課" ? "normal" : "pending",
      probability: item.probability,
      gust: item.gust,
      averageWind: item.wind,
      rainfall24h: item.rain24h,
      benchmark: {
        averageWind: item.wind >= 7,
        gust: item.gust >= 10,
        rainfall: item.rain24h >= 200,
        anyMet: item.wind >= 7 || item.gust >= 10 || item.rain24h >= 200,
      },
      factors: [],
      source: "simulation",
    })),
  };
}

export async function getWeatherSnapshot(): Promise<WeatherSnapshot> {
  if (ENV.weatherMode !== "real" || !ENV.cwaApiKey) return simulationSnapshot();

  try {
    const response = await fetchCwaWeatherPoints();
    const byCounty = new Map<string, typeof response.points[number]>();
    for (const point of response.points) {
      const id = aliases[point.countyName] ?? aliases[point.locationName];
      if (id && !byCounty.has(id)) byCounty.set(id, point);
    }

    const items = countyForecasts.map((simulation) => {
      const point = byCounty.get(simulation.id);
      if (!point) return {
        countyId: simulation.id,
        countyName: simulation.name,
        region: simulation.region,
        officialStatus: "pending" as const,
        probability: simulation.probability,
        gust: simulation.gust,
        averageWind: simulation.wind,
        rainfall24h: simulation.rain24h,
        benchmark: { averageWind: false, gust: false, rainfall: false, anyMet: false },
        factors: [],
        source: "simulation" as const,
      };
      const prediction = predictionFromCwaPoint(point);
      return {
        countyId: simulation.id,
        countyName: simulation.name,
        region: regionById.get(simulation.id) ?? simulation.region,
        officialStatus: "pending" as const,
        probability: prediction.probability,
        gust: point.gust ?? 0,
        averageWind: point.averageWind ?? 0,
        rainfall24h: point.rainfall24hMm ?? 0,
        benchmark: prediction.benchmark,
        factors: prediction.factors,
        source: "cwa" as const,
      };
    });

    return {
      mode: "real",
      source: "cwa",
      dataset: CWA_DATASETS.threeDayTownship,
      fetchedAt: response.fetchedAt,
      fromCache: response.fromCache,
      items,
      warning: items.every((item) => item.source === "simulation") ? "CWA 回應未包含可對應的 22 縣市資料，已保留模擬值。" : undefined,
    };
  } catch (error) {
    const fallback = simulationSnapshot();
    return { ...fallback, mode: "real", warning: error instanceof Error ? `CWA 暫時不可用，已回退模擬資料：${error.message}` : "CWA 暫時不可用，已回退模擬資料。" };
  }
}
