import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../helpers/apiHelper";
import * as api from "./postApi";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));
const mock = apiFetch as unknown as ReturnType<typeof vi.fn>;

describe("postApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getPosts dengan & tanpa filter", async () => {
    mock.mockResolvedValue({ data: { posts: [{ id: 1 }] } });
    expect(await api.getPosts({ is_me: 1 })).toEqual([{ id: 1 }]);
    expect(mock).toHaveBeenCalledWith("/posts", { params: { is_me: 1 } });
    await api.getPosts();
    expect(mock).toHaveBeenLastCalledWith("/posts", { params: {} });
  });

  it("getPost mengembalikan detail", async () => {
    mock.mockResolvedValue({ data: { post: { id: 3 } } });
    expect(await api.getPost(3)).toEqual({ id: 3 });
    expect(mock).toHaveBeenCalledWith("/posts/3");
  });

  it("postPost dan putPost", async () => {
    mock.mockResolvedValue({ message: "ok" });
    expect(await api.postPost({ description: "d" })).toBe("ok");
    expect(mock).toHaveBeenCalledWith("/posts", { method: "POST", body: { description: "d" } });
    expect(await api.putPost(2, { description: "e" })).toBe("ok");
    expect(mock).toHaveBeenCalledWith("/posts/2", { method: "PUT", body: { description: "e" } });
  });

  it("postPostCover mengunggah file cover", async () => {
    mock.mockResolvedValue({ message: "cover" });
    const file = new File(["x"], "c.png", { type: "image/png" });
    expect(await api.postPostCover(4, file)).toBe("cover");
    const [path, opts] = mock.mock.calls[0];
    expect(path).toBe("/posts/4/cover");
    expect(opts.body.get("cover")).toBe(file);
  });

  it("deletePost dan deleteAllPosts", async () => {
    mock.mockResolvedValue({ message: "hapus" });
    expect(await api.deletePost(5)).toBe("hapus");
    expect(mock).toHaveBeenCalledWith("/posts/5", { method: "DELETE" });
    expect(await api.deleteAllPosts()).toBe("hapus");
    expect(mock).toHaveBeenCalledWith("/posts", { method: "DELETE" });
  });

  it("like, komentar, dan hapus komentar", async () => {
    mock.mockResolvedValue({ message: "ok" });
    await api.postPostLike(1, "like");
    expect(mock).toHaveBeenCalledWith("/posts/1/likes", { method: "POST", body: { type: "like" } });
    await api.postPostComment(1, "halo");
    expect(mock).toHaveBeenCalledWith("/posts/1/comments", { method: "POST", body: { comment: "halo" } });
    await api.deletePostComment(1, 9);
    expect(mock).toHaveBeenCalledWith("/posts/1/comments", { method: "DELETE", body: { comment_id: 9 } });
  });
});
