import { useQuery } from "@tanstack/react-query";
import { URIS, apiClient } from "./apis";

export function useGetTopHeirarchy(payload, enabled) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["topHeirarchy", "all", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.STAFF_TOP_HEIRARCHY, payload);
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

export function useStaffList(payload, enabled) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["allStaffList", "all", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.GET_SELLER, payload);
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

export function useGetBottomHeirarchy(payload, enabled) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["bottomHeirarchy", "all", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.STAFF_BOTTOM_HEIRARCHY, payload);
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

// export function useDeleteState(config) {
//   return useMutation({
//     mutationFn: async (payload) => {
//       const response = await apiClient.delete(URIS.STATE, payload);
//       if (response.ok) {
//         return response.data;
//       }
//       throw response.data;
//     },
//     ...config,
//   });
// }

