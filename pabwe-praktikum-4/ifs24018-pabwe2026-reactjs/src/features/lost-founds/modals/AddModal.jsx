import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncAddLostFound } from "../states/action";

export default function AddModal({ onClose }) {
  const dispatch = useDispatch();
  const isAdding = useSelector((state) => state.isLostFoundAdd);
  const [title, onTitle] = useInput();
  const [description, onDescription] = useInput();
  const [status, onStatus] = useInput("lost");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!title || !description) {
      showWarningDialog("Judul dan deskripsi wajib diisi");
      return;
    }
    dispatch(asyncAddLostFound({ title, description, status }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Tambah Laporan</h3>
        <label htmlFor="add-title" className="text-sm">Judul</label>
        <input id="add-title" value={title} onChange={onTitle}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <label htmlFor="add-desc" className="text-sm">Deskripsi</label>
        <textarea id="add-desc" value={description} onChange={onDescription} rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <label htmlFor="add-status" className="text-sm">Jenis Laporan</label>
        <select id="add-status" value={status} onChange={onStatus}
          className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2">Batal</button>
          <button type="submit" disabled={isAdding}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
