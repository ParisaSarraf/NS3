import { useQuery } from "@tanstack/react-query";
import { scenarioApi } from "./scenarioApi";


// export const BASEURL = window._env_.API_URL;
export const BASEURL = import.meta.env.VITE_API_URL;

export const useGetAllObjectTypes = () => {
  return useQuery({
    queryKey: ["objectTypes"],
    queryFn: async () => {
      const res = await fetch(BASEURL + "/api/object-types");
      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      return json.types || [];
    },
  });
};


export const useGetGroups = (type: string, radius: number) => {
  return useQuery({
    queryKey: ["groups", type, radius],
    queryFn: async () => {
      const url = `${BASEURL}/groups?type=${type}&radius=${radius}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      return json.groups || [];
    },
    enabled: !!type,
  });
};


export const useMissiles = (started: boolean) => {
  return useQuery({
    queryKey: ["missiles"],
    queryFn: scenarioApi.getMissiles,
    enabled: started,
    refetchInterval: 2000, // به‌روزرسانی هر ۲ ثانیه
  });
};