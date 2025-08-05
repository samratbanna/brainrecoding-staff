import { create } from "zustand";
import { STATUS } from "@/constant/index";
import { apis } from "../../services/apis/api";

export const useLectureStore = create((set, get) => ({
  getLectureAction: async (payload) => {
    set({ getLectureStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getLectureApi(payload);
    if (ok) {
      set({
        lectures: data,
        getLectureStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getLectureStatus: STATUS.FAILED });
    }
  },
}));
