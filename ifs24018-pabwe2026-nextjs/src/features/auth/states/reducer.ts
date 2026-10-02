import type { AppAction, UnknownAction } from "../../../types/action";
import { ActionType } from "./action";

const flag = (type: string) => (state = false, action: UnknownAction): boolean =>
  action.type === type ? (action as AppAction).payload.status : state;

export const isAuthLogin = flag(ActionType.SET_IS_AUTH_LOGIN);
export const isAuthRegister = flag(ActionType.SET_IS_AUTH_REGISTER);
export const isAuthLogout = flag(ActionType.SET_IS_AUTH_LOGOUT);
