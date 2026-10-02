import { IconChartBar, IconHome, IconUser, IconUsers } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { path: "/", hash: "", label: "Dashboard / Laporan", Icon: IconHome },
  { path: "/", hash: "#statistik", label: "Statistik", Icon: IconChartBar },
  { path: "/users", hash: "", label: "Pengguna", Icon: IconUsers },
  { path: "/profile", hash: "", label: "Profil Saya", Icon: IconUser },
];

export default function SidebarComponent({ open, onClose }) {
  const { pathname, hash } = useLocation();

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
          {items.map(({ path, hash: itemHash, label, Icon }) => (
            <Link key={label} to={`${path}${itemHash}`} onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 ${
                pathname === path && hash === itemHash ? "bg-indigo-50 text-indigo-700" : ""
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
