import * as authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import type { AppThunk } from "../../../types/action";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "auth/setIsAuthLogin",
  SET_IS_AUTH_REGISTER: "auth/setIsAuthRegister",
  SET_IS_AUTH_LOGOUT: "auth/setIsAuthLogout",
};

export const setIsAuthLoginActionCreator = (status: boolean) => ({
  type: ActionType.SET_IS_AUTH_LOGIN,
  payload: { status },
});

export const setIsAuthRegisterActionCreator = (status: boolean) => ({
  type: ActionType.SET_IS_AUTH_REGISTER,
  payload: { status },
});

export const setIsAuthLogoutActionCreator = (status: boolean) => ({
  type: ActionType.SET_IS_AUTH_LOGOUT,
  payload: { status },
});

export const asyncSetIsAuthLogin =
  ({ email, password }: { email: string; password: string }): AppThunk =>
  async (dispatch) => {
    try {
      const token = await authApi.postLogin({ email, password });
      putAccessToken(token);
      dispatch(setIsAuthLoginActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

export const asyncSetIsAuthRegister =
  ({ name, email, password }: { name: string; email: string; password: string }): AppThunk =>
  async (dispatch) => {
    try {
      const message = await authApi.postRegister({ name, email, password });
      showSuccessDialog(message);
      dispatch(setIsAuthRegisterActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

export const asyncSetIsAuthLogout = (): AppThunk => (dispatch) => {
  removeAccessToken();
  dispatch(setIsAuthLogoutActionCreator(true));
};
