import { useMutation, useQuery } from "@tanstack/react-query";
import { URIS, apiClient } from "./apis";

export function useTaskList(payload) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["allTasks", "all", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.ALL_TASK, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useAddTask(config) {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(URIS.TASK, payload);
      if (response.ok) {
        return response.data;
      }
      throw response.data;
    },
    ...config,
  });
}

export function useUpdateTask(config) {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.patch(URIS.TASK, payload);
      if (response.ok) {
        return response.data;
      }
      throw response.data;
    },
    ...config,
  });
}

