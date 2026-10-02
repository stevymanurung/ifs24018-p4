"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAccessToken from "../../../hooks/useAccessToken";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogout, setIsAuthLogoutActionCreator } from "../../auth/states/action";
import { asyncGetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile);
  const isAuthLogout = useAppSelector((state) => state.isAuthLogout);
  const token = useAccessToken();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route guarding: verifikasi token, lalu muat sesi profil
  useEffect(() => {
    if (token) {
      dispatch(asyncGetProfile());
    }
  }, [token, dispatch]);

  // null = sudah diperiksa di browser dan tidak ada token (undefined = belum diperiksa/SSR)
  useEffect(() => {
    if (token === null) {
      router.replace("/auth/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (isAuthLogout) {
      dispatch(setIsAuthLogoutActionCreator(false));
      router.replace("/auth/login");
    }
  }, [isAuthLogout, dispatch, router]);

  const onLogout = async () => {
    if (await showConfirmDialog("Yakin ingin keluar?", "Keluar")) {
      dispatch(asyncSetIsAuthLogout());
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent profile={profile} onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}
