import { describe, expect, it } from "vitest";
import { predictHolidayProbability } from "./prediction";

describe("holiday probability model", () => {
  it("marks wind and gust legal benchmarks when thresholds are met", () => {
    const result = predictHolidayProbability({ averageWind: 7.2, gust: 10.4, rainfall24hMm: 180 });
    expect(result.benchmark).toMatchObject({ averageWind: true, gust: true, rainfall: false, anyMet: true });
    expect(result.probability).toBeGreaterThanOrEqual(75);
    expect(result.label).toBe("高機率");
  });

  it("uses precipitation probability when rainfall millimetres are unavailable", () => {
    const result = predictHolidayProbability({ precipitationProbability: 80, averageWind: 4, gust: 5 });
    expect(result.factors.find((factor) => factor.key === "rain")?.detail).toContain("降雨機率 80%");
    expect(result.probability).toBeGreaterThan(0);
    expect(result.benchmark.rainfall).toBe(false);
  });

  it("clamps malformed or extreme values to a safe public score", () => {
    const result = predictHolidayProbability({ averageWind: 100, gust: 100, rainfall24hMm: 9999, precipitationProbability: 500 });
    expect(result.probability).toBe(100);
  });
});
