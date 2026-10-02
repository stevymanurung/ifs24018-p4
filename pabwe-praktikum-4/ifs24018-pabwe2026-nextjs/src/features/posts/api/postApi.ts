import { apiFetch } from "../../../helpers/apiHelper";
import type { Post } from "../../../types";

// filter: { is_me: 1 } untuk hanya postingan milik sendiri
export async function getPosts(filters: { is_me?: number } = {}): Promise<Post[]> {
  const json = await apiFetch("/posts", { params: filters });
  return json.data.posts;
}

export async function getPost(id: string | number): Promise<Post> {
  const json = await apiFetch(`/posts/${id}`);
  return json.data.post;
}

export async function postPost({ description }: { description: string }) {
  const json = await apiFetch("/posts", { method: "POST", body: { description } });
  return json.message as string;
}

export async function putPost(id: string | number, { description }: { description: string }) {
  const json = await apiFetch(`/posts/${id}`, { method: "PUT", body: { description } });
  return json.message as string;
}

export async function postPostCover(id: string | number, file: File) {
  const body = new FormData();
  body.append("cover", file);
  const json = await apiFetch(`/posts/${id}/cover`, { method: "POST", body });
  return json.message as string;
}

export async function deletePost(id: string | number) {
  const json = await apiFetch(`/posts/${id}`, { method: "DELETE" });
  return json.message as string;
}

export async function postPostLike(id: string | number, type: "like" | "unlike") {
  const json = await apiFetch(`/posts/${id}/likes`, { method: "POST", body: { type } });
  return json.message as string;
}

export async function postPostComment(id: string | number, comment: string) {
  const json = await apiFetch(`/posts/${id}/comments`, { method: "POST", body: { comment } });
  return json.message as string;
}

export async function deletePostComment(id: string | number, commentId: string | number) {
  const json = await apiFetch(`/posts/${id}/comments`, {
    method: "DELETE",
    body: { comment_id: commentId },
  });
  return json.message as string;
}

export async function deleteAllPosts() {
  const json = await apiFetch("/posts", { method: "DELETE" });
  return json.message as string;
}
