import { create } from "zustand";
import { setAuthorizationHeader } from "../../services/apis";
import { ErrorAlert, SuccessAlert } from "../../utils/Helper";
import { apis } from "../../services/apis/api";
import { LOCAL_STORAGE_KEYS, STATUS } from "@/constant";
export const useLoginStore = create((set, get) => ({
  userData: null,
  loginUserAction: async (payload) => {
    set({ loginStatus: STATUS.FETCHING });
    const { data, ok, originalError } = await apis.userLoginApi(payload);
    if (ok) {
      set({ loginStatus: STATUS.SUCCESS, otpToken: data.token, userData: data.staff });
      setAuthorizationHeader(data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.loginToken, data.token);
      SuccessAlert(data.msg || 'Login Successfully!')
    } else {
      set({ loginStatus: STATUS.NOT_STARTED });
      ErrorAlert(data?.message || originalError.message)
      setAuthorizationHeader(null);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.loginToken);
      set({ userData: null, loginStatus: STATUS.FAILED });
    }
  },
  resetOtpToken: () => {
    set({ loginStatus: STATUS.NOT_STARTED });
  },
  logoutUser: async (payload) => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.loginToken)
    location.reload()
  },
}));
