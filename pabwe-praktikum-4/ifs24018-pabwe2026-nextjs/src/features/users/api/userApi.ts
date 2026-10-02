import { apiFetch } from "../../../helpers/apiHelper";
import type { User } from "../../../types";

export async function getUsers(): Promise<User[]> {
  const json = await apiFetch("/users");
  return json.data.users;
}

export async function getProfile(): Promise<User> {
  const json = await apiFetch("/users/me");
  return json.data.user;
}

export async function putProfile({ name, email }: { name: string; email: string }) {
  const json = await apiFetch("/users/me", { method: "PUT", body: { name, email } });
  return json.message as string;
}

export async function postProfilePhoto(file: File) {
  const body = new FormData();
  body.append("photo", file);
  const json = await apiFetch("/users/me/photo", { method: "POST", body });
  return json.message as string;
}

export async function putProfilePassword({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}) {
  const json = await apiFetch("/users/me/password", {
    method: "PUT",
    body: { password, new_password: newPassword },
  });
  return json.message as string;
}
