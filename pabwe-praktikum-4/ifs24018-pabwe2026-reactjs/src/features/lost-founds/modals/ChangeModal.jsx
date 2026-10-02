import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncChangeLostFound } from "../states/action";

export default function ChangeModal({ lostFound, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChange);
  const [title, onTitle] = useInput(lostFound.title);
  const [description, onDescription] = useInput(lostFound.description);
  const [status, onStatus] = useInput(lostFound.status);
  const [completed, setCompleted] = useState(Boolean(lostFound.is_completed));

  const onSubmit = (event) => {
    event.preventDefault();
    if (!title || !description) {
      showWarningDialog("Judul dan deskripsi wajib diisi");
      return;
    }
    dispatch(
      asyncChangeLostFound(lostFound.id, {
        title,
        description,
        status,
        is_completed: completed ? 1 : 0,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Ubah Laporan</h3>
        <label htmlFor="ch-title" className="text-sm">Judul</label>
        <input id="ch-title" value={title} onChange={onTitle}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <label htmlFor="ch-desc" className="text-sm">Deskripsi</label>
        <textarea id="ch-desc" value={description} onChange={onDescription} rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <label htmlFor="ch-status" className="text-sm">Jenis Laporan</label>
        <select id="ch-status" value={status} onChange={onStatus}
          className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <label htmlFor="ch-done" className="flex items-center gap-2 text-sm">
          <input id="ch-done" type="checkbox" checked={completed}
            onChange={(e) => setCompleted(e.target.checked)} />
          Tandai selesai
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2">Batal</button>
          <button type="submit" disabled={isChanging}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
