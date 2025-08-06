import { create } from "zustand";
import { STATUS } from "@/constant/index";
import { apis } from "../../services/apis/api";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";

export const useMeetingStore = create((set, get) => ({
  getMeetingAction: async (payload) => {
    set({ getMeetingStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getMeetingApi(payload);
    if (ok) {
      set({
        meetings: data,
        getMeetingStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMeetingStatus: STATUS.FAILED });
    }
  },

  addMeetingAction: async (payload) => {
    set({ addMeetingStatus: STATUS.FETCHING });
    const { data, ok } = await apis.addLeadMeetingApi(payload);
    let previousData = get().meetingDetails || [];
    if (ok) {
      set({
        meetingDetails: [...previousData, data],
        addMeetingStatus: STATUS.SUCCESS,
      });
      SuccessAlert("Meeting Added Successfully");
    } else {
      set({ addMeetingStatus: STATUS.FAILED });
      ErrorAlert("Something Went Wrong");
    }
  },
}));
