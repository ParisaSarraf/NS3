import type { Feature } from "../utils/types";

export const dataTransformer = {
  toTimeSeries(rawFeatures: Feature[]) {
    return rawFeatures.map((f) => {
      const geom = JSON.parse(f.geom);
      return {
        id: f.id,
        label: f.label,
        type: f.type,
        coordinates: geom.coordinates || [0, 0],
      };
    });
  },

  extractMetricMatrix(payload: any[], metricKey: string) {
    return payload.map((item) => ({
      time: item.timestamp || "00:00",
      value: item[metricKey] || 0,
    }));
  },
};
