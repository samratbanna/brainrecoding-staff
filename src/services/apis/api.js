import { URIS, apiClient } from ".";

export const apis = {
  /* Seller */
  addSellerApi: (payload) => apiClient.post(URIS.SELLER, payload),
  getSellerApi: (payload) => apiClient.get(URIS.GET_SELLER, payload),
  updateSellerApi: (payload) => apiClient.patch(URIS.SELLER, payload),
  deleteSellerApi: (payload) => apiClient.delete(URIS.SELLER, payload),

  /* Meeting */
  addMeetingApi: (payload) => apiClient.post(URIS.MEETING, payload),
  getMeetingApi: (payload) => apiClient.get(URIS.GET_MEETING, payload),
  updateMeetingApi: (payload) => apiClient.patch(URIS.MEETING, payload),
  deleteMeetingApi: (payload) => apiClient.delete(URIS.MEETING, payload),

  /* LECTURES */
  addLectureApi: (payload) => apiClient.post(URIS.LECTURE, payload),
  getLectureApi: (payload) => apiClient.get(URIS.GET_LECTURE, payload),
  updateLectureApi: (payload) => apiClient.patch(URIS.LECTURE, payload),
  deleteLectureApi: (payload) => apiClient.delete(URIS.LECTURE, payload),

  /* Leads */
  getLeadsApi: (payload) => apiClient.get(URIS.GET_LEADS, payload),
  createLeadApi: (payload) => apiClient.post(URIS.CREATE_LEAD, payload),
  updateLeadsApi: (payload) => apiClient.patch(URIS.CREATE_LEAD, payload),
  leadConvertApi: (payload) => apiClient.patch(URIS.LEAD_CONVERT, payload),

  /* States*/
  getStatesApi: (payload) => apiClient.get(URIS.GET_STATES, payload),

  /* Login */
  userLoginApi: (payload) => apiClient.post(URIS.LOGIN_USER, payload),

  /* Dashboard */
  getDashboardApi: (payload) => apiClient.get(URIS.GET_DASHBOARD, payload),

  /* Lead Followup */
  getLeadFollowUpApi: (payload) => apiClient.get(URIS.GET_LEAD_FOLLOWUP, payload),
  addLeadFollowUpApi: (payload) => apiClient.post(URIS.GET_MEETING_LEAD, payload),
  getFollowUpLeadApi: (payload) => apiClient.get(URIS.GET_FOLLOWUP_LEAD, payload),
  getMeetingLeadApi: (payload) => apiClient.get(URIS.GET_FOLLOWUP_LEAD, { ...payload, isMeeting: true }),

  // ADD MEETING
  addLeadMeetingApi: (payload) => apiClient.post(URIS.ADD_MEETING, payload),

  // team
  getTeamList: (payload) => apiClient.get(URIS.GET_TEAM, payload),
  getTeamReport: (payload) => apiClient.get(URIS.TEAM_DASHBOARD, payload)
};
