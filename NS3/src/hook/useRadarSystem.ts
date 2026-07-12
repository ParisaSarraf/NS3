import { useState, useEffect } from "react";
import type{ EnvironmentContact, EnvironmentGroup } from "../utils/types";
import { scenarioApi } from "../api/scenarioApi";

export function useRadarSystem(started: boolean, godView: boolean, environmentContacts: EnvironmentContact[], radius: number, commRadius: number, groupType: string) {
  const [radarContacts, setRadarContacts] = useState<Record<string, EnvironmentContact[]>>({});
  const [commGroups, setCommGroups] = useState<EnvironmentGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Radar Polling
  useEffect(() => {
    if (!started || godView) return setRadarContacts({});
    
    let cancelled = false;
    const fetchRadar = async () => {
      const ids = [...new Set(environmentContacts.map(c => String(c.object_id).trim()).filter(id => id.length > 0))];
      if (ids.length === 0) return setRadarContacts({});

      try {
        const entries = await Promise.all(ids.map(async (id) => {
          const res = await scenarioApi.radarRange(id, radius);
          return [id, Array.isArray(res?.data?.objects) ? res.data.objects : []] as const;
        }));
        if (!cancelled) {
          setRadarContacts(Object.fromEntries(entries));
        }
      } catch (e) { console.error(e); }
    };

    fetchRadar();
    const interval = setInterval(fetchRadar, 100000);
    return () => { clearInterval(interval); cancelled = true; };
  }, [started, godView, environmentContacts, radius]);

  // Groups Polling
  useEffect(() => {
    if (!started || godView || !groupType) return setCommGroups([]);

    let cancelled = false;
    const fetchGroups = async () => {
      try {
        const groups = await scenarioApi.groups({ type: groupType, radius: commRadius });
        if (!cancelled) {
          const normalized = Array.isArray(groups) ? groups : [];
          setCommGroups(normalized);
          setSelectedGroupId(prev => normalized.some(g => g.group === prev) ? prev : null);
        }
      } catch (e) { console.error(e); }
    };

    fetchGroups();
    const interval = setInterval(fetchGroups, 2000);
    return () => { clearInterval(interval); cancelled = true; };
  }, [started, godView, groupType, commRadius]);

  return { radarContacts, commGroups, selectedGroupId, setSelectedGroupId };
}