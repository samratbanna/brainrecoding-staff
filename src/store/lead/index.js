import { create } from "zustand";
import { STATUS } from "../../constant";
import { apis } from "../../services/apis/api";
import { ErrorAlert, SuccessAlert } from "../../utils/Helper";
import { map } from "lodash";

function removeEmptyKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}

export const useLeadStore = create((set, get) => ({
  resetStatus: () => {
    set({
      createLeadStatus: STATUS.NOT_STARTED,
      addLeadFollowUpStatus: STATUS.NOT_STARTED,
      getLeadFollowUpStatus: STATUS.NOT_STARTED,
      getLeadsStatus: STATUS.NOT_STARTED,
      leadConvertStatus: STATUS.NOT_STARTED,
      updateLeadsStatus: STATUS.NOT_STARTED
    });
  },
  createLeadAction: async (payload) => {
    set({ createLeadStatus: STATUS.FETCHING });
    const { ok, data } = await apis.createLeadApi(removeEmptyKeys(payload));
    if (ok) {
      set({
        createLeadStatus: STATUS.SUCCESS, particularLead: data
      });
      SuccessAlert("Lead Created Successfully");
    } else {
      set({ createLeadStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Something Went Wrong");
    }
  },
  getLeadsAction: async (payload) => {
    set({ getLeadsStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getLeadsApi(payload);
    if (ok) {
      set({
        leadsDetails: data,
        getLeadsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getLeadsStatus: STATUS.FAILED });
    }
  },

  getMeetingLeadAction: async (payload) => {
    set({ getMeetingLeadStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getMeetingLeadApi(payload);
    if (ok) {
      set({
        leadsDetails: data,
        getMeetingLeadStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMeetingLeadStatus: STATUS.FAILED });
    }
  },

  getfollowUpLeadAction: async (payload) => {
    set({ getfollowUpLeadStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getFollowUpLeadApi(payload);
    if (ok) {
      set({
        leadsDetails: data,
        getfollowUpLeadStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getfollowUpLeadStatus: STATUS.FAILED });
    }
  },

  getLeadFollowUpAction: async (payload) => {
    set({ getLeadFollowUpStatus: STATUS.FETCHING });
    const { data, ok } = await apis.getLeadFollowUpApi(payload);
    if (ok) {
      set({
        leadFollowUpDetails: data,
        getLeadFollowUpStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getLeadFollowUpStatus: STATUS.FAILED });
    }
  },

  updateLeadsAction: async (payload) => {
    set({ updateLeadsStatus: STATUS.FETCHING });
    const { data, ok } = await apis.updateLeadsApi(payload);
    let previousData = get().leadsDetails;
    if (ok) {
      const updatedData = map(previousData.docs, (d) => (data?._id === d?._id ? data : d));
      set({
        updateLeadsStatus: STATUS.SUCCESS,
        leadsDetails: { ...previousData, docs: updatedData },
      });
      SuccessAlert(data.msg || "Leads Updated Successfully");
    } else {
      set({ updateLeadsStatus: STATUS.FAILED });
      ErrorAlert(data?.errors?.msg || "Something went Wrong");
    }
  },

  addLeadFollowUpAction: async (payload) => {
    set({ addLeadFollowUpStatus: STATUS.FETCHING });
    const { data, ok } = await apis.addLeadFollowUpApi(payload);
    let previousData = get().leadFollowUpDetails || [];
    if (ok) {
      set({ leadFollowUpDetails: [...previousData, data], addLeadFollowUpStatus: STATUS.SUCCESS });
      SuccessAlert("Lead FollowUp Added Successfully");
    } else {
      set({ addLeadFollowUpStatus: STATUS.FAILED });
      ErrorAlert("Something Went Wrong");
    }
  },

  getDashboardAction: async (payload) => {
    set({ getDashboardStatus: STATUS.NOT_STARTED });
    const { data, ok } = await apis.getDashboardApi(payload);
    if (ok) {
      set({ getDashboardStatus: STATUS.SUCCESS, dashboardData: data });
    } else {
      set({ getDashboardStatus: STATUS.FAILED });
    }
  },
  leadConvertAction: async (payload) => {
    set({ leadConvertStatus: STATUS.NOT_STARTED });
    const { ok, data } = await apis.leadConvertApi(payload);
    // let previousData = get().leadsDetails;
    if (ok) {
      // const updatedData = map(previousData.docs, (d) => (data?._id === d?._id ? data : d));
      set({
        leadConvertStatus: STATUS.SUCCESS,
        // leadsDetails: { ...previousData, docs: updatedData },
      });
      SuccessAlert("Paid SuccessFully");
    } else {
      set({ leadConvertStatus: STATUS.FAILED });
      ErrorAlert("Something Went Wrong");
    }
  },
  getTeam: async (payload) => {
    set({ teamStatus: STATUS.FETCHING });
    const { ok, data } = await apis.getTeamList(payload);
    if (ok) {
      set({ teamStatus: STATUS.SUCCESS, teamList: data });
    } else {
      ErrorAlert(data?.error || "Something Went Wrong");
      set({ teamStatus: STATUS.FAILED });
    }
  },
  getTeamDashboard: async (payload) => {
    set({ teamReportStatus: STATUS.FETCHING });
    const { ok, data } = await apis.getTeamReport(payload);
    if (ok) {
      set({ teamReportStatus: STATUS.SUCCESS, teamDashboard: data });
    } else {
      ErrorAlert(data?.error || "Something Went Wrong");
      set({ teamReportStatus: STATUS.FAILED });
    }
  },
}));
