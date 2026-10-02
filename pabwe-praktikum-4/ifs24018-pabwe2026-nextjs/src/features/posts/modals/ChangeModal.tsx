"use client";

import { useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import type { Post } from "../../../types";
import { asyncChangePost, setIsPostChangedActionCreator } from "../states/action";

interface Props {
  post: Post;
  onClose: () => void;
  onSaved: () => void;
}

export default function ChangeModal({ post, onClose, onSaved }: Props) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isPostChange);
  const isChanged = useAppSelector((state) => state.isPostChanged);
  const [description, onDescription] = useInput(post.description);

  useEffect(() => {
    if (isChanged) {
      dispatch(setIsPostChangedActionCreator(false));
      onSaved();
    }
  }, [isChanged, dispatch, onSaved]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      showWarningDialog("Deskripsi postingan wajib diisi");
      return;
    }
    dispatch(asyncChangePost(post.id, { description }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Ubah Postingan</h3>
        <label htmlFor="ch-desc" className="text-sm">Deskripsi</label>
        <textarea id="ch-desc" value={description} onChange={onDescription} rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2" />
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
