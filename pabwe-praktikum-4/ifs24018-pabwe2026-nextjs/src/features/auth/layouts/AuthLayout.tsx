"use client";

import { IconMessages } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAccessToken from "../../../hooks/useAccessToken";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAccessToken();

  // Sudah login -> alihkan ke beranda
  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-center bg-linear-to-br from-indigo-600 to-violet-700 p-12 text-white lg:flex">
        <IconMessages size={56} />
        <h1 className="mt-6 text-4xl font-extrabold">Delcom Posts</h1>
        <p className="mt-3 max-w-md text-indigo-100">
          Bagikan cerita, sukai, dan berdiskusi lewat komentar bersama teman-temanmu.
        </p>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">{children}</div>
      </main>
    </div>
  );
}
