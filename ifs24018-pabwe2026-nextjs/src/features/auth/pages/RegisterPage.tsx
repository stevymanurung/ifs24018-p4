"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthRegister, setIsAuthRegisterActionCreator } from "../states/action";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthRegister = useAppSelector((state) => state.isAuthRegister);
  const [name, onName] = useInput();
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(setIsAuthRegisterActionCreator(false));
      router.push("/auth/login");
    }
  }, [isAuthRegister, dispatch, router]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name || !email || !password) {
      showWarningDialog("Nama, email, dan kata sandi wajib diisi");
      return;
    }
    dispatch(asyncSetIsAuthRegister({ name, email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <h2 className="text-2xl font-extrabold tracking-tight">Daftar Akun</h2>
      <div>
        <label htmlFor="name" className="label">Nama</label>
        <input id="name" value={name} onChange={onName}
          className="input" />
      </div>
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
        Daftar
      </button>
      <p className="text-center text-sm">
        Sudah punya akun? <Link href="/auth/login" className="font-semibold text-indigo-600">Masuk</Link>
      </p>
    </form>
  );
}
