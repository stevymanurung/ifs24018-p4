import { apiFetch } from "../../../helpers/apiHelper";

export async function postLogin({ email, password }: { email: string; password: string }) {
  const json = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
  return json.data.token as string;
}

export async function postRegister({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const json = await apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  return json.message as string;
}
