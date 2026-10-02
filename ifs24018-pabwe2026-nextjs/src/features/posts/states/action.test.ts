import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import * as a from "./action";

vi.mock("../api/postApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const A = a as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API = api as any;

describe("posts action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators membawa payload yang benar", () => {
    expect(a.setPostsActionCreator([])).toEqual({ type: a.ActionType.SET_POSTS, payload: { posts: [] } });
    expect(a.setPostActionCreator(null).payload.post).toBeNull();
    expect(a.setIsPostActionCreator(true).payload.status).toBe(true);
  });

  it.each([
    ["asyncGetPosts", "getPosts", a.setPostsActionCreator, [{ id: 1 }], [{ is_me: 1 }]],
    ["asyncGetPost", "getPost", a.setPostActionCreator, { id: 1 }, [7]],
  ])("%s: sukses menyimpan data & loading, gagal menampilkan error", async (name, apiName, creator, data, args) => {
    const dispatch = vi.fn();
    API[apiName].mockResolvedValueOnce(data);
    await A[name](...args)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, a.setIsPostActionCreator(true));
    expect(dispatch).toHaveBeenCalledWith((creator as (v: unknown) => object)(data));
    expect(dispatch).toHaveBeenLastCalledWith(a.setIsPostActionCreator(false));

    API[apiName].mockRejectedValueOnce(new Error("gagal"));
    await A[name](...args)(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  const mutations = [
    ["asyncAddPost", "postPost", a.setIsPostAddActionCreator, a.setIsPostAddedActionCreator, [{ description: "d" }]],
    ["asyncChangePost", "putPost", a.setIsPostChangeActionCreator, a.setIsPostChangedActionCreator, [1, { description: "d" }]],
    ["asyncChangePostCover", "postPostCover", a.setIsPostChangeCoverActionCreator, a.setIsPostChangedCoverActionCreator, [1, "file"]],
    ["asyncDeletePost", "deletePost", a.setIsPostDeleteActionCreator, a.setIsPostDeletedActionCreator, [1]],
    ["asyncAddComment", "postPostComment", a.setIsPostAddCommentActionCreator, a.setIsPostAddedCommentActionCreator, [1, "hai"]],
    ["asyncDeleteComment", "deletePostComment", a.setIsPostDeleteCommentActionCreator, a.setIsPostDeletedCommentActionCreator, [1, 2]],
    ["asyncDeleteAllPosts", "deleteAllPosts", a.setIsPostDeleteAllActionCreator, a.setIsPostDeletedAllActionCreator, []],
  ] as const;

  it.each(mutations)("%s: sukses (dengan dialog) & gagal", async (name, apiName, start, done, args) => {
    const dispatch = vi.fn();
    API[apiName].mockResolvedValueOnce("berhasil");
    await A[name](...args)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(1, start(true));
    expect(showSuccessDialog).toHaveBeenCalledWith("berhasil");
    expect(dispatch).toHaveBeenCalledWith(done(true));
    expect(dispatch).toHaveBeenLastCalledWith(start(false));

    dispatch.mockClear();
    API[apiName].mockRejectedValueOnce(new Error("gagal"));
    await A[name](...args)(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
    expect(dispatch).not.toHaveBeenCalledWith(done(true));
  });

  it("asyncLikePost berjalan senyap (tanpa dialog sukses)", async () => {
    const dispatch = vi.fn();
    vi.mocked(api.postPostLike).mockResolvedValueOnce("liked");
    await a.asyncLikePost(1, "like")(dispatch);
    expect(showSuccessDialog).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(a.setIsPostLikedActionCreator(true));
  });
});
