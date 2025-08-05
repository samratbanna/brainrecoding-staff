import { create } from "zustand";
import { STATUS } from "@/constant/index";
import { apis } from "../../services/apis/api";

export const useStateStore = create((set, get) => ({
  getStateAction: async (payload) => {
    if (get().states) return;
    set({ getStateStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getStatesApi(payload);
    if (ok) {
      set({
        states: data,
        getStateStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStateStatus: STATUS.FAILED });
    }
  },
}));
