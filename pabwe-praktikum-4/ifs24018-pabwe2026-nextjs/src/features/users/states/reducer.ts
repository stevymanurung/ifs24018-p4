import type { AppAction, Payload, UnknownAction } from "../../../types/action";
import type { User } from "../../../types";
import { ActionType } from "./action";

const make =
  <T>(type: string, initial: T, pick: (p: Payload) => T) =>
  (state: T = initial, action: UnknownAction): T =>
    action.type === type ? pick((action as AppAction).payload) : state;

const flag = (type: string) => make<boolean>(type, false, (p) => p.status);

export const users = make<User[]>(ActionType.SET_USERS, [], (p) => p.users);
export const user = make<User | null>(ActionType.SET_USER, null, (p) => p.user);
export const profile = make<User | null>(ActionType.SET_PROFILE, null, (p) => p.profile);
export const isProfile = flag(ActionType.SET_IS_PROFILE);
export const isChangeProfile = flag(ActionType.SET_IS_CHANGE_PROFILE);
export const isChangeProfilePhoto = flag(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const isChangeProfilePassword = flag(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);
