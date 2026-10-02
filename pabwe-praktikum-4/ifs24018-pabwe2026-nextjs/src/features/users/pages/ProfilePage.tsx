"use client";

import { useState, type FormEvent } from "react";
import Avatar from "../../../components/Avatar";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import type { User } from "../../../types";
import {
  asyncChangeProfile,
  asyncChangeProfilePassword,
  asyncChangeProfilePhoto,
} from "../states/action";

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2";
const btnClass = "rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50";

function ProfileForms({ profile }: { profile: User }) {
  const dispatch = useAppDispatch();
  const isChangeProfile = useAppSelector((s) => s.isChangeProfile);
  const isChangePhoto = useAppSelector((s) => s.isChangeProfilePhoto);
  const isChangePassword = useAppSelector((s) => s.isChangeProfilePassword);
  const [name, onName] = useInput(profile.name);
  const [email, onEmail] = useInput(profile.email);
  const [password, onPassword] = useInput();
  const [newPassword, onNewPassword] = useInput();
  const [file, setFile] = useState<File | null>(null);

  const submitProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showWarningDialog("Nama dan email wajib diisi");
      return;
    }
    dispatch(asyncChangeProfile({ name, email }));
  };

  const submitPhoto = (e: FormEvent) => {
    e.preventDefault();
    dispatch(asyncChangeProfilePhoto(file as File));
  };

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!password || !newPassword) {
      showWarningDialog("Kata sandi lama dan baru wajib diisi");
      return;
    }
    dispatch(asyncChangeProfilePassword({ password, newPassword }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submitPhoto} className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Foto Profil</h3>
        <Avatar name={profile.name} photo={profile.photo} className="h-24 w-24" />
        <input aria-label="Berkas foto" type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files![0] ?? null)} />
        <button type="submit" disabled={!file || isChangePhoto} className={btnClass}>Unggah Foto</button>
      </form>

      <form onSubmit={submitProfile} className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Data Akun</h3>
        <label htmlFor="p-name" className="text-sm">Nama</label>
        <input id="p-name" value={name} onChange={onName} className={inputClass} />
        <label htmlFor="p-email" className="text-sm">Email</label>
        <input id="p-email" type="email" value={email} onChange={onEmail} className={inputClass} />
        <button type="submit" disabled={isChangeProfile} className={btnClass}>Simpan Profil</button>
      </form>

      <form onSubmit={submitPassword} className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Ubah Kata Sandi</h3>
        <label htmlFor="p-old" className="text-sm">Kata Sandi Lama</label>
        <input id="p-old" type="password" value={password} onChange={onPassword} className={inputClass} />
        <label htmlFor="p-new" className="text-sm">Kata Sandi Baru</label>
        <input id="p-new" type="password" value={newPassword} onChange={onNewPassword} className={inputClass} />
        <button type="submit" disabled={isChangePassword} className={btnClass}>Ubah Kata Sandi</button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const profile = useAppSelector((state) => state.profile);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Profil Saya</h2>
      {profile ? <ProfileForms profile={profile} /> : <p>Memuat profil...</p>}
    </section>
  );
}
