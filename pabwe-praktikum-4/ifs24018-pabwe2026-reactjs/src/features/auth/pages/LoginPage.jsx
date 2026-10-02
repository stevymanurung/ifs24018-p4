import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncSetIsAuthLogin, setIsAuthLoginActionCreator } from "../states/action";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const [email, onEmail] = useInput();
  const [password, onPassword] = useInput();

  useEffect(() => {
    if (isAuthLogin) {
      dispatch(setIsAuthLoginActionCreator(false));
      navigate("/");
    }
  }, [isAuthLogin, dispatch, navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      showWarningDialog("Email dan kata sandi wajib diisi");
      return;
    }
    dispatch(asyncSetIsAuthLogin({ email, password }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <h2 className="text-2xl font-bold">Masuk</h2>
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
        Masuk
      </button>
      <p className="text-center text-sm">
        Belum punya akun? <Link to="/auth/register" className="font-semibold text-indigo-600">Daftar</Link>
      </p>
    </form>
  );
}
