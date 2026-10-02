import type { AppAction, Payload, UnknownAction } from "../../../types/action";
import type { Post } from "../../../types";
import { ActionType } from "./action";

const make =
  <T>(type: string, initial: T, pick: (p: Payload) => T) =>
  (state: T = initial, action: UnknownAction): T =>
    action.type === type ? pick((action as AppAction).payload) : state;

const flag = (type: string) => make<boolean>(type, false, (p) => p.status);

export const posts = make<Post[]>(ActionType.SET_POSTS, [], (p) => p.posts);
export const post = make<Post | null>(ActionType.SET_POST, null, (p) => p.post);
export const isPost = flag(ActionType.SET_IS_POST);
export const isPostAdd = flag(ActionType.SET_IS_POST_ADD);
export const isPostAdded = flag(ActionType.SET_IS_POST_ADDED);
export const isPostChange = flag(ActionType.SET_IS_POST_CHANGE);
export const isPostChanged = flag(ActionType.SET_IS_POST_CHANGED);
export const isPostChangeCover = flag(ActionType.SET_IS_POST_CHANGE_COVER);
export const isPostChangedCover = flag(ActionType.SET_IS_POST_CHANGED_COVER);
export const isPostDelete = flag(ActionType.SET_IS_POST_DELETE);
export const isPostDeleted = flag(ActionType.SET_IS_POST_DELETED);
export const isPostLike = flag(ActionType.SET_IS_POST_LIKE);
export const isPostLiked = flag(ActionType.SET_IS_POST_LIKED);
export const isPostAddComment = flag(ActionType.SET_IS_POST_ADD_COMMENT);
export const isPostAddedComment = flag(ActionType.SET_IS_POST_ADDED_COMMENT);
export const isPostDeleteComment = flag(ActionType.SET_IS_POST_DELETE_COMMENT);
export const isPostDeletedComment = flag(ActionType.SET_IS_POST_DELETED_COMMENT);
export const isPostDeleteAll = flag(ActionType.SET_IS_POST_DELETE_ALL);
export const isPostDeletedAll = flag(ActionType.SET_IS_POST_DELETED_ALL);
