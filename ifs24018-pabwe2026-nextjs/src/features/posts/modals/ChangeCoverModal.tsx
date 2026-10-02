"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { asyncChangePostCover, setIsPostChangedCoverActionCreator } from "../states/action";

interface Props {
  postId: string | number;
  onClose: () => void;
  onSaved: () => void;
}

export default function ChangeCoverModal({ postId, onClose, onSaved }: Props) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isPostChangeCover);
  const isChanged = useAppSelector((state) => state.isPostChangedCover);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (isChanged) {
      dispatch(setIsPostChangedCoverActionCreator(false));
      onSaved();
    }
  }, [isChanged, dispatch, onSaved]);

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files![0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : "");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(asyncChangePostCover(postId, file as File));
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={onSubmit} className="modal-panel">
        <h3 className="text-xl font-extrabold">Ganti Cover</h3>
        <input aria-label="Berkas cover" type="file" accept="image/*" onChange={onFile} />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pratinjau cover" className="max-h-64 w-full rounded-lg object-contain" />
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
          <button type="submit" disabled={!file || isChanging}
            className="btn btn-primary">
            Unggah
          </button>
        </div>
      </form>
    </div>
  );
}
