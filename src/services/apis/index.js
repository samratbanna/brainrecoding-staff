import { create } from "apisauce";
import { apiMonitor } from "./monitor";

// const BASE_URL = "https://testapi.brainrecoding.in/api/r1";
const BASE_URL = "http://localhost:4000/api/r1";

export const URIS = {
  LOGIN_USER: "/auth/login",
  LOGOUT_USER: "/logout",
  SELLER: "/seller",
  GET_SELLER: "/seller/all",
  MEETING: "/meeting",
  GET_MEETING: "/liveMeeting/all",
  LECTURE: "/lecture",
  GET_LECTURE: "/uploadTemp/all",
  GET_LEADS: "/lead/seller/all",
  GET_STATES: "/app/states",
  CREATE_LEAD: "/lead",
  LEAD_FOLLOWUP: "/LeadFollowUp",
  GET_LEAD_FOLLOWUP: "/LeadFollowUp/all",
  GET_DASHBOARD: "lead/dashboard",
  GET_MEETING_LEAD: "/LeadFollowUp",
  GET_FOLLOWUP_LEAD: "/lead/followup-meeting",
  LEAD_CONVERT: "/lead/leadConvert",
  ADD_MEETING: "/liveMeeting",
  GET_TEAM: "staff/team",
  TEAM_DASHBOARD: "lead/team-dashboard",
  BULK_LEAD_ASSIGN: "/lead-assignments/bulk-assign",
  LEAD_ASSIGNMENT: "/lead-assignments",
  //
  STAFF_TOP_HEIRARCHY: "staff/top-hierarchy",
  STAFF_BOTTOM_HEIRARCHY: "staff/bottom-hierarchy",
  // task
  TASK: "/tasks",
  ALL_TASK: "/tasks/all",
};

let api = create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});
api.addMonitor(apiMonitor);

api.axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    let isunauth = error.response && error.response.status === 401;
    if (isunauth && !originalRequest._retry && !originalRequest.headers._retry) {
      originalRequest._retry = true;
    } else {
      return Promise.resolve(error);
    }
  }
);

export const setAuthorizationHeader = (access_token) => {
  if (!access_token) delete api.headers["Authorization"];
  else api.setHeader("Authorization", "Bearer " + access_token);
};

export const removeAuthorizationHeader = () => {
  delete api.headers["Authorization"];
};

export const setUserAgent = (info) => api.setHeader("device", info);

export { api as apiClient };
