import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  STATUS_LABEL,
  formatDate,
  getAuthorName,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncDeleteLostFound,
  asyncGetLostFound,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lostFound = useSelector((s) => s.lostFound);
  const isChanged = useSelector((s) => s.isLostFoundChanged);
  const isChangedCover = useSelector((s) => s.isLostFoundChangedCover);
  const isDeleted = useSelector((s) => s.isLostFoundDeleted);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    dispatch(asyncGetLostFound(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isChanged || isChangedCover) {
      dispatch(setIsLostFoundChangedActionCreator(false));
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
      setModal(null);
      dispatch(asyncGetLostFound(id));
    }
  }, [isChanged, isChangedCover, dispatch, id]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(setIsLostFoundDeletedActionCreator(false));
      navigate("/");
    }
  }, [isDeleted, dispatch, navigate]);

  const onDelete = async () => {
    if (await showConfirmDialog("Hapus laporan ini?", "Hapus")) {
      dispatch(asyncDeleteLostFound(id));
    }
  };

  if (!(lostFound && String(lostFound.id) === id)) {
    return <p className="text-slate-500">Memuat detail laporan...</p>;
  }

  const author = getAuthorName(lostFound);

  return (
    <article className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {lostFound.cover ? (
        <img src={assetUrl(lostFound.cover)} alt={lostFound.title}
          className="max-h-96 w-full rounded-xl bg-slate-100 object-contain" />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-400">Tanpa cover</div>
      )}
      <div className="flex gap-2 text-xs font-semibold">
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-700">{STATUS_LABEL[lostFound.status]}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">
          {lostFound.is_completed === 1 ? "Selesai" : "Belum selesai"}
        </span>
      </div>
      <h2 className="text-2xl font-bold">{lostFound.title}</h2>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Avatar name={author} photo={lostFound.author?.photo} className="h-7 w-7" />
        <span>{author} · {formatDate(lostFound.created_at)}</span>
      </div>
      <p className="whitespace-pre-line">{lostFound.description}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setModal("cover")} className="rounded-lg border px-4 py-2">Edit Cover</button>
        <button onClick={() => setModal("change")} className="rounded-lg border px-4 py-2">Edit Data</button>
        <button onClick={onDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Hapus</button>
      </div>
      {modal === "change" && <ChangeModal lostFound={lostFound} onClose={() => setModal(null)} />}
      {modal === "cover" && <ChangeCoverModal lostFoundId={lostFound.id} onClose={() => setModal(null)} />}
    </article>
  );
}
