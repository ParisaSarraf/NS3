import { BASEURL } from "./objectTypes";
import { myAxios } from "./api";

export const scenarioApi = {
  start: () =>
    myAxios.post(`${BASEURL}/api/session/start`).then((res) => res.data),

  stop: () =>
    myAxios.post(`${BASEURL}/api/session/stop`).then((res) => res.data),

  attack: (source: string, enemy: string) =>
    myAxios.post(`${BASEURL}/api/attack`, {
      object_name: source,
      enemy_name: enemy,
    }),

  goto: async (
    objectId: string,
    unrealCoords: { x: number; y: number; z: number },
    timeout: number,
    finalPointMode: number,
  ) => {
    const response = await myAxios.post(`/goto/${objectId}`, {
      location: {
        lat: unrealCoords.x,
        lon: unrealCoords.y,
        alt: unrealCoords.z,
      },
      timeout: timeout,
      finalPointMode: finalPointMode,
    });
    return response.data;
  },

  move: async (
    objectId: string,
    params: {
      speed: number;
      direction: { alpha: number; beta: number; gamma: number };
      acceleration: number;
    },
  ) => {
    const response = await myAxios.post(`/move/${objectId}`, params);
    return response.data;
  },

  radarRange: (objectId: string, radius: number) =>
    myAxios.get(`${BASEURL}/environment/${objectId}/${radius}`),

  stopObject: (objectId: string) =>
    myAxios.post(`${BASEURL}/stop/${encodeURIComponent(objectId)}`),

  deploy: (data: {
    party: string;
    type: string;
    worldPos: { x: number; y: number; z: number };
    customId: string;
  }) => {
    const baseWithoutApi = BASEURL.replace(/\/api\/?$/, "");
    return myAxios.post(
      `${baseWithoutApi}/put/${encodeURIComponent(data.customId)}`,
      {
        type: data.type,
        party: data.party,
        location: {
          lat: data.worldPos.x,
          lon: data.worldPos.y,
          alt: 550,
        },
        velocity: {
          speed: 0,
          direction: { alpha: 0, beta: 0, gamma: 0 },
          acceleration: 0,
        },
      },
    );
  },

  groups: ({ type, radius }: { type: string; radius: number }) =>
    myAxios
      .get(`${BASEURL}/groups`, {
        params: {
          type: type,
          radius: radius,
        },
      })
      .then((res) => res.data.groups || []),

  load: async (file: File) => {
    const text = await file.text();
    const scenario = JSON.parse(text);
    return myAxios
      .post(`${BASEURL}/load_scenario/`, scenario)
      .then((res) => res.data);
  },

  getMissiles: () =>
    myAxios.get(`${BASEURL}/missle`).then((res) => res.data || []),

  sendWayPoints: async (
    objectId: string,
    waypoints: {
      id: string;
      x: number;
      y: number;
      z: number;
    }[],
  ) => {
    const payload = {
      waypoints: waypoints.map((point) => ({
        lat: point.x,
        lon: point.y,
        alt: point.z,
      })),
      timeout: 10,
      finalPointMode: 1,
    };

    const response = await myAxios.post(
      `${BASEURL}/waypoint/${objectId}`,
      payload,
    );

    return response.data;
  },
};
