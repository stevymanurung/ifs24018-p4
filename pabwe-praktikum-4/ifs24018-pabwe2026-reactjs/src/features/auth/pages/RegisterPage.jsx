import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthRegister, setIsAuthRegisterActionCreator } from "../states/action";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthRegister = useSelector((state) => state.isAuthRegister);
  const [name, onName] = useInput();
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(setIsAuthRegisterActionCreator(false));
      navigate("/auth/login");
    }
  }, [isAuthRegister, dispatch, navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      showWarningDialog("Nama, email, dan kata sandi wajib diisi");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showWarningDialog("Format email tidak valid");
      return;
    }
    if (password.length < 6) {
      showWarningDialog("Kata sandi minimal 6 karakter");
      return;
    }
    dispatch(asyncSetIsAuthRegister({ name, email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <h2 className="text-2xl font-bold">Daftar Akun</h2>
      <div>
        <label htmlFor="name" className="text-sm font-medium">Nama</label>
        <input id="name" value={name} onChange={onName}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" type="email" value={email} onChange={onEmail}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">Kata Sandi</label>
        <input id="password" type="password" value={password} onChange={onPassword}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700">
        Daftar
      </button>
      <p className="text-center text-sm">
        Sudah punya akun? <Link to="/auth/login" className="font-semibold text-indigo-600">Masuk</Link>
      </p>
    </form>
  );
}
