import { IconSearch } from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../../helpers/apiHelper";

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-center bg-linear-to-br from-indigo-600 to-violet-700 p-12 text-white lg:flex">
        <IconSearch size={56} />
        <h1 className="mt-6 text-4xl font-extrabold">Lost &amp; Founds</h1>
        <p className="mt-3 max-w-md text-indigo-100">
          Laporkan barang hilang, temukan pemiliknya, dan bantu sesama sivitas kampus.
        </p>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
