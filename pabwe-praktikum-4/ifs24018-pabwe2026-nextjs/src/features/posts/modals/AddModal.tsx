"use client";

import { useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncAddPost, setIsPostAddedActionCreator } from "../states/action";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function AddModal({ onClose, onSaved }: Props) {
  const dispatch = useAppDispatch();
  const isAdding = useAppSelector((state) => state.isPostAdd);
  const isAdded = useAppSelector((state) => state.isPostAdded);
  const [description, onDescription] = useInput();

  useEffect(() => {
    if (isAdded) {
      dispatch(setIsPostAddedActionCreator(false));
      onSaved();
    }
  }, [isAdded, dispatch, onSaved]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      showWarningDialog("Deskripsi postingan wajib diisi");
      return;
    }
    dispatch(asyncAddPost({ description }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Postingan Baru</h3>
        <label htmlFor="add-desc" className="text-sm">Deskripsi</label>
        <textarea id="add-desc" value={description} onChange={onDescription} rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2">Batal</button>
          <button type="submit" disabled={isAdding}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            Publikasikan
          </button>
        </div>
      </form>
    </div>
  );
}
