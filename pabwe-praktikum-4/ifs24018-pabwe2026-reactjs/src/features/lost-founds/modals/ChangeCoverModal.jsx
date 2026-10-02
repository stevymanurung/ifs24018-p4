import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncChangeLostFoundCover } from "../states/action";

export default function ChangeCoverModal({ lostFoundId, onClose }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChangeCover);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const onFile = (event) => {
    const selected = event.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(asyncChangeLostFoundCover(lostFoundId, file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Ganti Cover</h3>
        <input aria-label="Berkas cover" type="file" accept="image/*" onChange={onFile} />
        {preview && <img src={preview} alt="Pratinjau cover" className="max-h-64 w-full rounded-lg object-contain" />}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2">Batal</button>
          <button type="submit" disabled={!file || isChanging}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            Unggah
          </button>
        </div>
      </form>
    </div>
  );
}
