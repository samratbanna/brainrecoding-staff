import { useMutation } from "@tanstack/react-query";
import { URIS, apiClient } from "./apis";

export function useAssignMultipleCollaborator(config) {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(URIS.BULK_LEAD_ASSIGN, payload);
      if (response.ok) {
        return response.data;
      }
      throw response.data;
    },
    ...config,
  });
}

export function useGetLeadColloborator(config) {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.get(URIS.LEAD_ASSIGNMENT, payload);
      if (response.ok) {
        return response.data;
      }
      throw response.data;
    },
    ...config,
  });
}

