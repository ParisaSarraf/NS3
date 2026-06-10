import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CanonicalObject, CanonicalTarget, EnvironmentContact } from "../utils/types";
import { parseLocation } from "../utils/coords";
import { myAxios } from "../api/api";
import { scenarioApi } from "../api/scenarioApi";

export const useMapObjects = (started: boolean) => {
  const shouldFetchEnvironment = started;
  const [missiles, setMissiles] = useState<any[]>([]);

  const objectsQuery = useQuery({
    queryKey: ["mapObjects"],
    queryFn: async () => {
      const res = await myAxios.get("/environment");
      const raw = res.data?.objects ?? res.data;
      return canonicalizeObjectsPayload(raw);
    },
    enabled: shouldFetchEnvironment,
    refetchInterval: 500000, // 5 min
  });

  const [environmentContacts, setEnvironmentContacts] = useState<
    EnvironmentContact[]
  >([]);

  useEffect(() => {
    if (!shouldFetchEnvironment) {
      setEnvironmentContacts([]);
      return;
    }

    let cancelled = false;

    const fetchEnvironment = async () => {
      try {
        const res = await myAxios.get("/environment");

        if (cancelled) return;

        const rawContacts = Array.isArray(res.data?.objects)
          ? res.data.objects
          : [];

        setEnvironmentContacts(rawContacts);
      } catch {
        if (!cancelled) {
          setEnvironmentContacts([]);
        }
      }
    };

    // initial fetch
    fetchEnvironment();

    // fetch every 2 sec
    const interval = setInterval(fetchEnvironment, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [shouldFetchEnvironment]);

  useEffect(() => {
    if (!started) return;
    const fetchMissiles = async () => {
      try {
        const data = await scenarioApi.getMissiles();
        setMissiles(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMissiles();
    const interval = setInterval(fetchMissiles, 2000);
    return () => clearInterval(interval);
  }, [started]);

  return {
    objects: objectsQuery.data || [],
    environmentContacts,
    missiles,
    isLoading: objectsQuery.isLoading,
    isError: objectsQuery.isError,
  };
};

function canonicalizeObjectsPayload(payload: unknown): CanonicalObject[] {
  if (Array.isArray(payload)) {
    if (
      payload.length > 0 &&
      payload.every(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          "object_id" in (entry as Record<string, unknown>),
      )
    ) {
      return payload.map((entry) => {
        const contact = entry as Record<string, any>;
        const pixiPos = contact.location?.pixi ?? {};

        return {
          id: String(contact.object_id),
          type: typeof contact.type === "string" ? contact.type : "Unknown",
          party: typeof contact.party === "string" ? contact.party : "Neutral",
          x: typeof pixiPos.x === "number" ? pixiPos.x : Number(pixiPos.x ?? 0),
          y: typeof pixiPos.y === "number" ? pixiPos.y : Number(pixiPos.y ?? 0),
          z: typeof pixiPos.z === "number" ? pixiPos.z : Number(pixiPos.z ?? 0),
          phase: null,
          target: null,
          targets: [],
          geo: null,
        } satisfies CanonicalObject;
      });
    }

    return payload as CanonicalObject[];
  }

  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;

  if (Array.isArray((data as any).objects)) {
    return (data as any).objects as CanonicalObject[];
  }

  const friendlyName =
    typeof data.My_Name === "string" ? data.My_Name : "friendly";

  const friendlyType = typeof data.My_Type === "string" ? data.My_Type : "Ship";

  const friendlyParty = typeof data.party === "string" ? data.party : "friend";

  const friendlyLocation = parseLocation(data.My_Location) ?? {
    x: 0,
    y: 0,
    z: 0,
  };

  const phase = typeof data.Phase === "string" ? data.Phase : null;

  const enemyList = (data.Enemy_List ?? data.enemy_list) as
    | Record<string, unknown>
    | undefined;

  const visibleEnemies =
    enemyList && Array.isArray((enemyList as any).visibleObjects)
      ? (enemyList as any).visibleObjects
      : Array.isArray(enemyList)
        ? (enemyList as any)
        : [];

  const targets: CanonicalTarget[] = visibleEnemies
    .map((enemy: any, idx: number) => {
      if (!enemy || typeof enemy !== "object") return null;

      const location = parseLocation(enemy.location);

      const id =
        typeof enemy.name === "string"
          ? enemy.name
          : typeof enemy.id === "string"
            ? enemy.id
            : `target-${idx}`;

      return {
        id,
        x: location?.x ?? null,
        y: location?.y ?? null,
        z: location?.z ?? null,
        type: typeof enemy.type === "string" ? enemy.type : null,
        side: typeof enemy.side === "string" ? enemy.side : null,
      };
    })
    .filter(Boolean) as CanonicalTarget[];

  return [
    {
      id: friendlyName,
      type: friendlyType,
      party: friendlyParty,
      x: friendlyLocation.x,
      y: friendlyLocation.y,
      z: friendlyLocation.z,
      geo: null,
      phase,
      target: targets[0] ?? null,
      targets,
    },
  ];
}
