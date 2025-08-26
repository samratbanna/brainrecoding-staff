import { useMutation, useQuery } from "@tanstack/react-query";
import { URIS, apiClient } from "./apis";

// Get all states
export function useGetStates(enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["states", "all"],
    queryFn: async () => {
      const res = await apiClient.get(URIS.GET_STATE_LIST);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

// Get districts by state ID
export function useGetDistricts(stateId, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["districts", "byState", stateId],
    queryFn: async () => {
      const res = await apiClient.get(URIS.GET_DISTRICT_LIST, { stateId });
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!stateId,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

// Get areas by state ID and district ID
export function useGetAreas(stateId, districtId, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["areas", "byDistrict", stateId, districtId],
    queryFn: async () => {
      const res = await apiClient.get(URIS.GET_AREA_LIST, { stateId, districtId });
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!stateId && !!districtId,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

