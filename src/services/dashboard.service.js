import { useMutation, useQuery } from "@tanstack/react-query";
import { URIS, apiClient } from "./apis";

// ─── Employee Dashboard Queries ───
export function useGetEmployeePerformance(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeePerformance", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_PERFORMANCE, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useGetEmployeePerformanceMix(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeePerformanceMix", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_PERFORMANCE_MIX, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useGetEmployeeActivityTimeline(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeeActivityTimeline", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_ACTIVITY_TIMELINE, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role && !!payload?.startDate && !!payload?.endDate,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useGetEmployeeLeadStatusSnapshot(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeeLeadStatusSnapshot", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_LEAD_STATUS_SNAPSHOT, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useGetEmployeeScorecard(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeeScorecard", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_SCORECARD, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

export function useGetEmployeeRecentLeadTimeline(payload, enabled = true) {
  const { isFetched, fetchStatus, ...rest } = useQuery({
    queryKey: ["employeeRecentLeadTimeline", payload],
    queryFn: async () => {
      const res = await apiClient.get(URIS.EMPLOYEE_RECENT_LEAD_TIMELINE, payload);
      if (res.ok) {
        return res.data;
      } else {
        throw res.data;
      }
    },
    enabled: enabled && !!payload?.userId && !!payload?.role,
    retry: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  return { ...rest, isFetched, fetchStatus };
}

