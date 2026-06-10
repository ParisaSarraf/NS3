export {};

declare global {
  interface Window {
    _env_: {
      API_URL: string;
      APP_NAME: string;
      APP_TITLE: string;
      APP_RADAR_RANGE: number;
      APP_RADAR_RANGE_MAXIMUM: number;
      APP_RADAR_RANGE_MINIMUM: number;
      APP_COMMUNICATION_RANGE: number;
      APP_COMMUNICATION_RANGE_MAXIMUM: number;
      APP_COMMUNICATION_RANGE_MINIMUM: number;
    };
  }
}