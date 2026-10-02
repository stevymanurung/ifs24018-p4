import * as api from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import type { AppThunk, UnknownAction } from "../../../types/action";
import type { Post } from "../../../types";

type Id = string | number;

export const ActionType = {
  SET_POSTS: "posts/setPosts",
  SET_POST: "posts/setPost",
  SET_IS_POST: "posts/setIsPost",
  SET_IS_POST_ADD: "posts/setIsPostAdd",
  SET_IS_POST_ADDED: "posts/setIsPostAdded",
  SET_IS_POST_CHANGE: "posts/setIsPostChange",
  SET_IS_POST_CHANGED: "posts/setIsPostChanged",
  SET_IS_POST_CHANGE_COVER: "posts/setIsPostChangeCover",
  SET_IS_POST_CHANGED_COVER: "posts/setIsPostChangedCover",
  SET_IS_POST_DELETE: "posts/setIsPostDelete",
  SET_IS_POST_DELETED: "posts/setIsPostDeleted",
  SET_IS_POST_LIKE: "posts/setIsPostLike",
  SET_IS_POST_LIKED: "posts/setIsPostLiked",
  SET_IS_POST_ADD_COMMENT: "posts/setIsPostAddComment",
  SET_IS_POST_ADDED_COMMENT: "posts/setIsPostAddedComment",
  SET_IS_POST_DELETE_COMMENT: "posts/setIsPostDeleteComment",
  SET_IS_POST_DELETED_COMMENT: "posts/setIsPostDeletedComment",
  SET_IS_POST_DELETE_ALL: "posts/setIsPostDeleteAll",
  SET_IS_POST_DELETED_ALL: "posts/setIsPostDeletedAll",
};

const creator =
  <T>(type: string, key: string) =>
  (value: T) => ({ type, payload: { [key]: value } });

const flag = (type: string) => creator<boolean>(type, "status");

export const setPostsActionCreator = creator<Post[]>(ActionType.SET_POSTS, "posts");
export const setPostActionCreator = creator<Post | null>(ActionType.SET_POST, "post");
export const setIsPostActionCreator = flag(ActionType.SET_IS_POST);
export const setIsPostAddActionCreator = flag(ActionType.SET_IS_POST_ADD);
export const setIsPostAddedActionCreator = flag(ActionType.SET_IS_POST_ADDED);
export const setIsPostChangeActionCreator = flag(ActionType.SET_IS_POST_CHANGE);
export const setIsPostChangedActionCreator = flag(ActionType.SET_IS_POST_CHANGED);
export const setIsPostChangeCoverActionCreator = flag(ActionType.SET_IS_POST_CHANGE_COVER);
export const setIsPostChangedCoverActionCreator = flag(ActionType.SET_IS_POST_CHANGED_COVER);
export const setIsPostDeleteActionCreator = flag(ActionType.SET_IS_POST_DELETE);
export const setIsPostDeletedActionCreator = flag(ActionType.SET_IS_POST_DELETED);
export const setIsPostLikeActionCreator = flag(ActionType.SET_IS_POST_LIKE);
export const setIsPostLikedActionCreator = flag(ActionType.SET_IS_POST_LIKED);
export const setIsPostAddCommentActionCreator = flag(ActionType.SET_IS_POST_ADD_COMMENT);
export const setIsPostAddedCommentActionCreator = flag(ActionType.SET_IS_POST_ADDED_COMMENT);
export const setIsPostDeleteCommentActionCreator = flag(ActionType.SET_IS_POST_DELETE_COMMENT);
export const setIsPostDeletedCommentActionCreator = flag(ActionType.SET_IS_POST_DELETED_COMMENT);
export const setIsPostDeleteAllActionCreator = flag(ActionType.SET_IS_POST_DELETE_ALL);
export const setIsPostDeletedAllActionCreator = flag(ActionType.SET_IS_POST_DELETED_ALL);

type FlagCreator = ReturnType<typeof flag>;

// Pengambilan data: menyalakan flag loading isPost
const load =
  <T>(request: () => Promise<T>, onSuccess: (data: T) => UnknownAction): AppThunk =>
  async (dispatch) => {
    dispatch(setIsPostActionCreator(true));
    try {
      dispatch(onSuccess(await request()));
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsPostActionCreator(false));
    }
  };

// Aksi mutasi: flag proses (start) + flag selesai (done); notify=false untuk aksi senyap (like)
const mutate =
  (start: FlagCreator, done: FlagCreator, request: () => Promise<string>, notify = true): AppThunk =>
  async (dispatch) => {
    dispatch(start(true));
    try {
      const message = await request();
      if (notify) {
        showSuccessDialog(message);
      }
      dispatch(done(true));
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(start(false));
    }
  };

export const asyncGetPosts = (filters?: { is_me?: number }): AppThunk =>
  load(() => api.getPosts(filters), setPostsActionCreator);

export const asyncGetPost = (id: Id): AppThunk => load(() => api.getPost(id), setPostActionCreator);

export const asyncAddPost = (data: { description: string }): AppThunk =>
  mutate(setIsPostAddActionCreator, setIsPostAddedActionCreator, () => api.postPost(data));

export const asyncChangePost = (id: Id, data: { description: string }): AppThunk =>
  mutate(setIsPostChangeActionCreator, setIsPostChangedActionCreator, () => api.putPost(id, data));

export const asyncChangePostCover = (id: Id, file: File): AppThunk =>
  mutate(setIsPostChangeCoverActionCreator, setIsPostChangedCoverActionCreator, () =>
    api.postPostCover(id, file)
  );

export const asyncDeletePost = (id: Id): AppThunk =>
  mutate(setIsPostDeleteActionCreator, setIsPostDeletedActionCreator, () => api.deletePost(id));

export const asyncLikePost = (id: Id, type: "like" | "unlike"): AppThunk =>
  mutate(
    setIsPostLikeActionCreator,
    setIsPostLikedActionCreator,
    () => api.postPostLike(id, type),
    false
  );

export const asyncAddComment = (id: Id, comment: string): AppThunk =>
  mutate(setIsPostAddCommentActionCreator, setIsPostAddedCommentActionCreator, () =>
    api.postPostComment(id, comment)
  );

export const asyncDeleteComment = (id: Id, commentId: Id): AppThunk =>
  mutate(setIsPostDeleteCommentActionCreator, setIsPostDeletedCommentActionCreator, () =>
    api.deletePostComment(id, commentId)
  );

export const asyncDeleteAllPosts = (): AppThunk =>
  mutate(setIsPostDeleteAllActionCreator, setIsPostDeletedAllActionCreator, () =>
    api.deleteAllPosts()
  );
