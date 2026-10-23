import { ENV } from "../_core/env";

export const CWA_DATASETS = {
  threeDayTownship: "F-D0047-091",
  thirtySixHour: "F-C0032-001",
  typhoonTrack: "W-C0034-005",
  typhoonWarning: "W-C0034-001",
  heavyRainWarning: "W-C0033-003",
} as const;

export type CwaWeatherPoint = {
  locationName: string;
  countyName: string;
  startTime?: string;
  endTime?: string;
  weatherDescription?: string;
  precipitationProbability?: number;
  rainfall24hMm?: number;
  averageWind?: number;
  gust?: number;
  windDirection?: string;
  temperature?: number;
  raw: unknown;
};

export type CwaFetchResult = {
  dataset: string;
  fetchedAt: string;
  etag?: string;
  fromCache: boolean;
  points: CwaWeatherPoint[];
};

type CwaResponse = {
  success?: string | boolean;
  records?: {
    locations?: Array<{
      locationsName?: string;
      location?: Array<{
        locationName?: string;
        weatherElement?: Array<{
          elementName?: string;
          description?: string;
          time?: Array<{
            startTime?: string;
            endTime?: string;
            parameter?: { parameterName?: string; parameterUnit?: string };
          }>;
        }>;
      }>;
    }>;
  };
};

type CacheEntry = { result: CwaFetchResult; etag?: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;

function numberFrom(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeElementName(name = "") {
  return name.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function firstParameter(elements: Map<string, string>, names: string[]) {
  for (const name of names) {
    const value = elements.get(normalizeElementName(name));
    const parsed = numberFrom(value);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function parseCwaResponse(payload: CwaResponse): CwaWeatherPoint[] {
  const locations = payload.records?.locations ?? [];
  return locations.flatMap((group) => (group.location ?? []).map((location) => {
    const elements = new Map<string, string>();
    let firstTime: { startTime?: string; endTime?: string } | undefined;
    for (const element of location.weatherElement ?? []) {
      const time = element.time?.[0];
      if (!firstTime && time) firstTime = time;
      const parameter = time?.parameter?.parameterName;
      if (parameter !== undefined && element.elementName) {
        elements.set(normalizeElementName(element.elementName), parameter);
      }
    }

    const locationName = location.locationName ?? "未知地點";
    const countyName = group.locationsName ?? locationName;
    const probability = firstParameter(elements, ["PoP12h", "PoP6h", "PoP"]);
    const rainfall24hMm = firstParameter(elements, ["Rainfall24h", "Rainfall", "RRR"]);
    const averageWind = firstParameter(elements, ["WS", "WindSpeed", "AverageWind"]);
    const gust = firstParameter(elements, ["WG", "WindGust", "Gust"]);

    return {
      locationName,
      countyName,
      startTime: firstTime?.startTime,
      endTime: firstTime?.endTime,
      weatherDescription: elements.get("weatherdescription") ?? elements.get("wx"),
      precipitationProbability: probability,
      rainfall24hMm,
      averageWind,
      gust,
      windDirection: elements.get("wd"),
      temperature: firstParameter(elements, ["T", "Temperature"]),
      raw: location,
    };
  }));
}

export function clearCwaCache() {
  cache.clear();
}

export async function fetchCwaDataset(dataset: string, options: { locationName?: string; ttlMs?: number } = {}): Promise<CwaFetchResult> {
  const apiKey = ENV.cwaApiKey;
  if (!apiKey) throw new Error("CWA_API_KEY is not configured");

  const cacheKey = `${dataset}:${options.locationName ?? "all"}`;
  const previous = cache.get(cacheKey);
  const now = Date.now();
  if (previous && previous.expiresAt > now) return { ...previous.result, fromCache: true };

  const url = new URL(`${ENV.cwaApiBaseUrl}/v1/rest/datastore/${dataset}`);
  url.searchParams.set("format", "JSON");
  if (options.locationName) url.searchParams.set("LocationName", options.locationName);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Authorization: apiKey, Accept: "application/json" },
      signal: controller.signal,
    });
    if (response.status === 304 && previous) return { ...previous.result, fromCache: true };
    if (!response.ok) throw new Error(`CWA ${dataset} responded with HTTP ${response.status}`);
    const payload = (await response.json()) as CwaResponse;
    if (payload.success === "false" || payload.success === false) throw new Error(`CWA ${dataset} returned success=false`);

    const result: CwaFetchResult = {
      dataset,
      fetchedAt: new Date().toISOString(),
      etag: response.headers.get("etag") ?? undefined,
      fromCache: false,
      points: parseCwaResponse(payload),
    };
    cache.set(cacheKey, { result, etag: result.etag, expiresAt: now + (options.ttlMs ?? DEFAULT_TTL_MS) });
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchCwaWeatherPoints() {
  return fetchCwaDataset(CWA_DATASETS.threeDayTownship);
}

export async function fetchCwaTyphoonTrack() {
  return fetchCwaDataset(CWA_DATASETS.typhoonTrack, { ttlMs: 60_000 });
}
