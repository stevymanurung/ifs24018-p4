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
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Postingan Baru</h3>
        <label htmlFor="add-desc" className="label">Deskripsi</label>
        <textarea id="add-desc" value={description} onChange={onDescription} rows={5}
          className="input" />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={isAdding}
            className="btn btn-primary">
            Publikasikan
          </button>
        </div>
      </form>
    </div>
  );
}
