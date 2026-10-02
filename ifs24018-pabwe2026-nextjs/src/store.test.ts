import { describe, expect, it } from "vitest";
import { store } from "./store";
import { setIsAuthLoginActionCreator } from "./features/auth/states/action";
import { setUsersActionCreator } from "./features/users/states/action";
import { setPostsActionCreator } from "./features/posts/states/action";

describe("store", () => {
  it("menggabungkan reducer auth, users, dan posts", () => {
    expect(Object.keys(store.getState())).toEqual(
      expect.arrayContaining(["isAuthLogin", "profile", "users", "posts", "post"])
    );
  });

  it("memproses action dari tiap fitur", () => {
    store.dispatch(setIsAuthLoginActionCreator(true));
    store.dispatch(setUsersActionCreator([]));
    store.dispatch(setPostsActionCreator([]));
    expect(store.getState().isAuthLogin).toBe(true);
    expect(store.getState().posts).toEqual([]);
  });
});
