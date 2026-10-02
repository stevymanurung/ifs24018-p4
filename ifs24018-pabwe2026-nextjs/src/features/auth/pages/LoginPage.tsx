"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogin, setIsAuthLoginActionCreator } from "../states/action";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthLogin = useAppSelector((state) => state.isAuthLogin);
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthLogin) {
      dispatch(setIsAuthLoginActionCreator(false));
      router.push("/");
    }
  }, [isAuthLogin, dispatch, router]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      showWarningDialog("Email dan kata sandi wajib diisi");
      return;
    }
    dispatch(asyncSetIsAuthLogin({ email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <h2 className="text-2xl font-extrabold tracking-tight">Masuk</h2>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" value={email} onChange={onEmail}
          className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Kata Sandi</label>
        <input id="password" type="password" value={password} onChange={onPassword}
          className="input" />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Masuk
      </button>
      <p className="text-center text-sm">
        Belum punya akun? <Link href="/auth/register" className="font-semibold text-indigo-600">Daftar</Link>
      </p>
    </form>
  );
}
