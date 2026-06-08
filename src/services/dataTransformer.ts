
export const dataTransformer = {
  formatTimestamp(seconds: number): string {
    const date = new Date(seconds * 1000);
    return date.toTimeString().split(" ")[0];
  },

  computeMbps(bytes: number, latencyMs: number): number {
    if (latencyMs === 0) return 0;
    const bits = bytes * 8;
    const seconds = latencyMs / 1000;
    const mbps = (bits / seconds) / 1000000;
    return parseFloat(mbps.toFixed(1));
  }
};