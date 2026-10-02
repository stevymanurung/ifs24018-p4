import { describe, expect, it } from "vitest";
import * as a from "./action";
import * as r from "./reducer";

const flags = [
  [r.isPost, a.setIsPostActionCreator],
  [r.isPostAdd, a.setIsPostAddActionCreator],
  [r.isPostAdded, a.setIsPostAddedActionCreator],
  [r.isPostChange, a.setIsPostChangeActionCreator],
  [r.isPostChanged, a.setIsPostChangedActionCreator],
  [r.isPostChangeCover, a.setIsPostChangeCoverActionCreator],
  [r.isPostChangedCover, a.setIsPostChangedCoverActionCreator],
  [r.isPostDelete, a.setIsPostDeleteActionCreator],
  [r.isPostDeleted, a.setIsPostDeletedActionCreator],
  [r.isPostLike, a.setIsPostLikeActionCreator],
  [r.isPostLiked, a.setIsPostLikedActionCreator],
  [r.isPostAddComment, a.setIsPostAddCommentActionCreator],
  [r.isPostAddedComment, a.setIsPostAddedCommentActionCreator],
  [r.isPostDeleteComment, a.setIsPostDeleteCommentActionCreator],
  [r.isPostDeletedComment, a.setIsPostDeletedCommentActionCreator],
  [r.isPostDeleteAll, a.setIsPostDeleteAllActionCreator],
  [r.isPostDeletedAll, a.setIsPostDeletedAllActionCreator],
].map(([reducer, creator]) => [reducer, creator, false, true]);

describe("posts reducer", () => {
  it.each([
    [r.posts, a.setPostsActionCreator, [], [{ id: 1 }]],
    [r.post, a.setPostActionCreator, null, { id: 1 }],
    ...flags,
  ])("state awal, action miliknya, dan action tak dikenal (%#)", (reducer, creator, initial, value) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const red = reducer as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cr = creator as any;
    expect(red(undefined, { type: "UNKNOWN", payload: {} })).toEqual(initial);
    expect(red(initial, cr(value))).toEqual(value);
    expect(red("keep", { type: "UNKNOWN", payload: {} })).toBe("keep");
  });
});
