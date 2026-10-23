import type { CwaWeatherPoint } from "./cwa";

export type PredictionInput = {
  averageWind?: number;
  gust?: number;
  rainfall24hMm?: number;
  precipitationProbability?: number;
  hasHeavyRainWarning?: boolean;
  hasStrongWindWarning?: boolean;
};

export type PredictionResult = {
  probability: number;
  confidence: "low" | "medium" | "high";
  label: "低機率" | "中機率" | "高機率";
  benchmark: {
    averageWind: boolean;
    gust: boolean;
    rainfall: boolean;
    anyMet: boolean;
  };
  factors: Array<{ key: string; label: string; score: number; detail: string }>;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const valueOrZero = (value?: number) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

/**
 * Transparent rule-based baseline model.
 * Thresholds align with the product's displayed legal benchmark checklist;
 * official decisions remain the responsibility of DGPA/local authorities.
 */
export function predictHolidayProbability(input: PredictionInput): PredictionResult {
  const averageWind = valueOrZero(input.averageWind);
  const gust = valueOrZero(input.gust);
  const rainfall24hMm = valueOrZero(input.rainfall24hMm);
  const precipitationProbability = clamp(valueOrZero(input.precipitationProbability));

  const windScore = clamp((averageWind / 7) * 34);
  const gustScore = clamp((gust / 10) * 34);
  const rainScore = rainfall24hMm > 0
    ? clamp((rainfall24hMm / 200) * 22)
    : clamp((precipitationProbability / 100) * 14);
  const warningScore = (input.hasHeavyRainWarning ? 6 : 0) + (input.hasStrongWindWarning ? 6 : 0);
  const rawScore = windScore + gustScore + rainScore + warningScore;
  const probability = Math.round(clamp(rawScore));

  const benchmark = {
    averageWind: averageWind >= 7,
    gust: gust >= 10,
    rainfall: rainfall24hMm >= 200,
    anyMet: averageWind >= 7 || gust >= 10 || rainfall24hMm >= 200,
  };
  const confidence: PredictionResult["confidence"] = probability >= 75 ? "high" : probability >= 50 ? "medium" : "low";
  const label: PredictionResult["label"] = confidence === "high" ? "高機率" : confidence === "medium" ? "中機率" : "低機率";

  return {
    probability,
    confidence,
    label,
    benchmark,
    factors: [
      { key: "averageWind", label: "平均風力", score: Math.round(windScore), detail: `${averageWind.toFixed(1)} 級 / 基準 7 級` },
      { key: "gust", label: "最大陣風", score: Math.round(gustScore), detail: `${gust.toFixed(1)} 級 / 基準 10 級` },
      { key: "rain", label: "降雨訊號", score: Math.round(rainScore), detail: rainfall24hMm > 0 ? `${Math.round(rainfall24hMm)} mm / 基準 200 mm` : `降雨機率 ${Math.round(precipitationProbability)}%` },
      { key: "warning", label: "氣象特報", score: warningScore, detail: warningScore > 0 ? "CWA 特報加權" : "目前無特報加權" },
    ],
  };
}

export function predictionFromCwaPoint(point: CwaWeatherPoint, warning: { heavyRain?: boolean; strongWind?: boolean } = {}) {
  return predictHolidayProbability({
    averageWind: point.averageWind,
    gust: point.gust,
    rainfall24hMm: point.rainfall24hMm,
    precipitationProbability: point.precipitationProbability,
    hasHeavyRainWarning: warning.heavyRain,
    hasStrongWindWarning: warning.strongWind,
  });
}
