"use client";

import { IconHome, IconMessages, IconUser, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", path: "/", label: "Semua Postingan", Icon: IconHome },
  { href: "/?tab=me", path: "/?tab=me", label: "Postingan Saya", Icon: IconMessages },
  { href: "/users", path: "/users", label: "Daftar Pengguna", Icon: IconUsers },
  { href: "/profile", path: "/profile", label: "Profil Saya", Icon: IconUser },
];

export default function SidebarComponent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div data-testid="sidebar-overlay" onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 pt-20 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
        <nav className="space-y-1">
          {items.map(({ href, path, label, Icon }) => (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 ${
                pathname === path ? "bg-indigo-50 text-indigo-700" : ""
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
