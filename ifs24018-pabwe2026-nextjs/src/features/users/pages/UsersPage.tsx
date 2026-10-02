"use client";

import { useEffect } from "react";
import Avatar from "../../../components/Avatar";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { asyncGetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const [keyword, onKeyword] = useInput();

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold tracking-tight">Daftar Pengguna</h2>
      <input value={keyword} onChange={onKeyword} placeholder="Cari nama pengguna..."
        className="input sm:max-w-sm" />
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Tidak ada pengguna ditemukan.</div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <li key={u.id} className="card flex items-center gap-3 p-4 transition hover:shadow-md">
              <Avatar name={u.name} photo={u.photo} className="h-12 w-12" />
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
