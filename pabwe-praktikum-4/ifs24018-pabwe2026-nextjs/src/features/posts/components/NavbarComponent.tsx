"use client";

import { IconLogout, IconMenu2, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import Avatar from "../../../components/Avatar";
import type { User } from "../../../types";

interface NavbarProps {
  profile: User | null;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export default function NavbarComponent({ profile, onToggleSidebar, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const name = profile?.name ?? "Memuat...";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button aria-label="Buka menu" onClick={onToggleSidebar} className="lg:hidden">
          <IconMenu2 />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <h1 className="text-lg font-extrabold text-indigo-700">Delcom Posts</h1>
      </div>

      <div className="relative">
        <button aria-label="Menu profil" onClick={() => setOpen(!open)} className="flex items-center gap-2">
          <Avatar name={name} photo={profile?.photo} />
          <span className="hidden text-sm font-medium sm:block">{name}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-slate-100">
              <IconUser size={16} /> Profil Saya
            </Link>
            <button onClick={onLogout}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-600 hover:bg-slate-100">
              <IconLogout size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
