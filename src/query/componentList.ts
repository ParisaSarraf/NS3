import { useQuery } from "@tanstack/react-query";
import { getComponents } from "../query/index";

<<<<<<< HEAD
export const useComponents = () =>
     {
  return useQuery({
    queryKey:["components"],
    queryFn:getComponents,
    enabled:!!localStorage.getItem("access_token"),
    staleTime:30*1000,
    refetchInterval:30*1000,
    retry: 3, 
    retryDelay:(attemptIndex) => Math.min(1000 * 2 ** attemptIndex,10000),
=======
export const useComponents = () => {
  return useQuery({
    queryKey: ["components"],
    queryFn: getComponents,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  });
};
