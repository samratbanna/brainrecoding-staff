export const STATUS = {
  NOT_STARTED: "NOT_STARTED",
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  INVALID: "INVALID",
};

export const LOCAL_STORAGE_KEYS = {
  loginToken: "token",
  loginUserId: "userId",
};

export const LOCAL_STORAGE_SIDEBAR_KEYS = {
  showSidebarOpen: "showSidebarOpen",
  loginToken: "token",
};

export const PAGELIMIT = [
  { title: "10 data per page", total: "10" },
  { title: "20 data per page", total: "20" },
  { title: "30 data per page", total: "30" },
  { title: "50 data per page", total: "50" },
];

export const LEADSTATUS = [
  { title: 'Pending', id: 'PENDING' },
  { title: 'Ringing', id: 'RINGING' },
  { title: 'Wrong Number', id: 'WRONG_NO' },
  { title: 'Duplicate', id: 'DUPLICATE' },
  { title: 'Not Interested', id: 'NOT_INTERESTED' },
  { title: 'Low Follow-Up', id: 'LOW_FOLLOWUP' },
  { title: 'Med Follow-Up', id: 'MED_FOLLOWUP' },
  { title: 'High Follow-Up', id: 'HIGH_FOLLOWUP' },
  { title: 'Meeting Scheduled', id: 'MEETING_SCHEDULED' },
  { title: 'Demo Scheduled', id: 'DEMO_SCHEDULED' },
  { title: 'In Process', id: 'IN_PROCESS' },
  // { title: 'Registration Done', id:'DONE'},
  // { title: 'Demo Finished', id:'FINISHED'},
  { title: 'Rejected', id: 'REJECTED' },
  // { title: 'Converted', id:'CONVERTED'},
]

export const TASK_STATUS = [
  { title: "Pending", id: "PENDING" },
  { title: "In Progress", id: "IN_PROGRESS" },
  { title: "Hold", id: "HOLD" },
  { title: "Complete", id: "COMPLETED" },
  { title: "Cancel", id: "CANCELLED" },
];

export const LEAD_ADDED_BY_TYPE = [
  { title: 'Student', id: 'STUDENT' },
  { title: 'Teacher or Trainer', id: 'TEACHER_OR_TRAINER' },
  { title: 'School Owner', id: 'SCHOOL_OWNER' },
  { title: 'School Principal', id: 'SCHOOL_PRINCIPLE' },
  { title: 'Coaching', id: 'COACHING' },
  { title: 'Working Professional', id: 'WORKING_PROFESSIONAL' },
  { title: 'Others', id: 'OTHER' }
]

export const ONLY_MY_LEADS = [
  { title: 'All Leads', id: 'ALL' },
  { title: 'My Leads', id: 'ONLY_MY_LEADS' },
]