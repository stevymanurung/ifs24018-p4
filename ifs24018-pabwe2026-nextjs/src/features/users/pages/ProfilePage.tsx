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

const btnClass = "btn btn-primary w-full";

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
      <form onSubmit={submitPhoto} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Foto Profil</h3>
        <Avatar name={profile.name} photo={profile.photo} className="h-24 w-24" />
        <input aria-label="Berkas foto" type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files![0] ?? null)} />
        <button type="submit" disabled={!file || isChangePhoto} className={btnClass}>Unggah Foto</button>
      </form>

      <form onSubmit={submitProfile} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Data Akun</h3>
        <label htmlFor="p-name" className="label">Nama</label>
        <input id="p-name" value={name} onChange={onName} className="input" />
        <label htmlFor="p-email" className="label">Email</label>
        <input id="p-email" type="email" value={email} onChange={onEmail} className="input" />
        <button type="submit" disabled={isChangeProfile} className={btnClass}>Simpan Profil</button>
      </form>

      <form onSubmit={submitPassword} className="card space-y-4 p-6">
        <h3 className="text-lg font-extrabold">Ubah Kata Sandi</h3>
        <label htmlFor="p-old" className="label">Kata Sandi Lama</label>
        <input id="p-old" type="password" value={password} onChange={onPassword} className="input" />
        <label htmlFor="p-new" className="label">Kata Sandi Baru</label>
        <input id="p-new" type="password" value={newPassword} onChange={onNewPassword} className="input" />
        <button type="submit" disabled={isChangePassword} className={btnClass}>Ubah Kata Sandi</button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const profile = useAppSelector((state) => state.profile);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold tracking-tight">Profil Saya</h2>
      {profile ? <ProfileForms profile={profile} /> : <div className="card p-10 text-center text-slate-500">Memuat profil...</div>}
    </section>
  );
}
