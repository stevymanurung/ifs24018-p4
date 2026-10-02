import * as userApi from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import type { AppThunk, UnknownAction } from "../../../types/action";
import type { User } from "../../../types";

export const ActionType = {
  SET_USERS: "users/setUsers",
  SET_USER: "users/setUser",
  SET_PROFILE: "users/setProfile",
  SET_IS_PROFILE: "users/setIsProfile",
  SET_IS_CHANGE_PROFILE: "users/setIsChangeProfile",
  SET_IS_CHANGE_PROFILE_PHOTO: "users/setIsChangeProfilePhoto",
  SET_IS_CHANGE_PROFILE_PASSWORD: "users/setIsChangeProfilePassword",
};

const creator =
  <T>(type: string, key: string) =>
  (value: T) => ({ type, payload: { [key]: value } });

export const setUsersActionCreator = creator<User[]>(ActionType.SET_USERS, "users");
export const setUserActionCreator = creator<User | null>(ActionType.SET_USER, "user");
export const setProfileActionCreator = creator<User | null>(ActionType.SET_PROFILE, "profile");
export const setIsProfileActionCreator = creator<boolean>(ActionType.SET_IS_PROFILE, "status");
export const setIsChangeProfileActionCreator = creator<boolean>(
  ActionType.SET_IS_CHANGE_PROFILE,
  "status"
);
export const setIsChangeProfilePhotoActionCreator = creator<boolean>(
  ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
  "status"
);
export const setIsChangeProfilePasswordActionCreator = creator<boolean>(
  ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
  "status"
);

export const asyncGetUsers = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setUsersActionCreator(await userApi.getUsers()));
  } catch (error) {
    showErrorDialog(error.message);
  }
};

// Gagal memuat profil = token tidak valid/kedaluwarsa -> paksa logout
export const asyncGetProfile = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setProfileActionCreator(await userApi.getProfile()));
    dispatch(setIsProfileActionCreator(true));
  } catch (error) {
    showErrorDialog(error.message);
    dispatch(asyncSetIsAuthLogout());
  }
};

const mutateProfile =
  (start: (v: boolean) => UnknownAction, request: () => Promise<string>): AppThunk =>
  async (dispatch) => {
    dispatch(start(true));
    try {
      showSuccessDialog(await request());
      await dispatch(asyncGetProfile());
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(start(false));
    }
  };

export const asyncChangeProfile = (data: { name: string; email: string }): AppThunk =>
  mutateProfile(setIsChangeProfileActionCreator, () => userApi.putProfile(data));

export const asyncChangeProfilePhoto = (file: File): AppThunk =>
  mutateProfile(setIsChangeProfilePhotoActionCreator, () => userApi.postProfilePhoto(file));

export const asyncChangeProfilePassword = (data: {
  password: string;
  newPassword: string;
}): AppThunk =>
  mutateProfile(setIsChangeProfilePasswordActionCreator, () => userApi.putProfilePassword(data));
