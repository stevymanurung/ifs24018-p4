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
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Ubah Postingan</h3>
        <label htmlFor="ch-desc" className="label">Deskripsi</label>
        <textarea id="ch-desc" value={description} onChange={onDescription} rows={5}
          className="input" />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={isChanging}
            className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
