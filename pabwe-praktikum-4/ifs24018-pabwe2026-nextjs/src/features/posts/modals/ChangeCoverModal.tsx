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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6">
        <h3 className="text-lg font-bold">Ganti Cover</h3>
        <input aria-label="Berkas cover" type="file" accept="image/*" onChange={onFile} />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pratinjau cover" className="max-h-64 w-full rounded-lg object-contain" />
        )}
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
