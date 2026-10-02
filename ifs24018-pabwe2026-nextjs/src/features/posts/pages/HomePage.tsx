"use client";

import { IconHeart, IconMessageCircle, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  countOf,
  formatDate,
  getAuthor,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import AddModal from "../modals/AddModal";
import {
  asyncDeleteAllPosts,
  asyncGetPosts,
  setIsPostDeletedAllActionCreator,
} from "../states/action";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((s) => s.posts);
  const isLoading = useAppSelector((s) => s.isPost);
  const isDeletedAll = useAppSelector((s) => s.isPostDeletedAll);
  const isMe = useSearchParams().get("tab") === "me";
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, onKeyword] = useInput();

  const load = useCallback(
    () => dispatch(asyncGetPosts(isMe ? { is_me: 1 } : {})),
    [dispatch, isMe]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isDeletedAll) {
      dispatch(setIsPostDeletedAllActionCreator(false));
      load();
    }
  }, [isDeletedAll, dispatch, load]);

  const onSaved = useCallback(() => {
    setShowAdd(false);
    load();
  }, [load]);

  const onDeleteAll = async () => {
    if (await showConfirmDialog("Hapus SEMUA postingan milikmu?", "Hapus Semua")) {
      dispatch(asyncDeleteAllPosts());
    }
  };

  const kw = keyword.toLowerCase();
  const filtered = posts.filter(
    (p) =>
      p.description.toLowerCase().includes(kw) || getAuthor(p).name.toLowerCase().includes(kw)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200">
        <h2 className="text-2xl font-extrabold tracking-tight">{isMe ? "Postingan Saya" : "Linimasa Postingan"}</h2>
        <div className="flex gap-2">
          {isMe && (
            <button onClick={onDeleteAll} className="btn bg-white/15 text-white hover:bg-white/25">
              Hapus Semua
            </button>
          )}
          <button onClick={() => setShowAdd(true)}
            className="btn bg-white text-indigo-700 shadow-sm hover:bg-indigo-50">
            <IconPlus size={18} /> Tambah Postingan
          </button>
        </div>
      </div>

      <div className="card flex flex-wrap items-center gap-2 p-3 text-sm font-semibold">
        <Link href="/" className={`rounded-xl px-4 py-2 ${isMe ? "text-slate-600 hover:bg-slate-100" : "bg-indigo-600 text-white"}`}>Semua</Link>
        <Link href="/?tab=me" className={`rounded-xl px-4 py-2 ${isMe ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Milik Saya</Link>
        <input value={keyword} onChange={onKeyword} placeholder="Cari postingan..."
          className="input min-w-52 flex-1 font-normal" />
      </div>

      {isLoading && <p className="animate-pulse text-sm font-medium text-indigo-600">Memuat data...</p>}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">Tidak ada postingan ditemukan.</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}
                className="card block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
                {post.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(post.cover)} alt="Cover postingan" className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-24 bg-linear-to-br from-indigo-100 via-violet-100 to-sky-100" />
                )}
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-indigo-700">{getAuthor(post).name}</p>
                  <p className="line-clamp-3 leading-relaxed">{post.description}</p>
                  <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><IconHeart size={16} /> {countOf(post.likes)}</span>
                    <span className="flex items-center gap-1"><IconMessageCircle size={16} /> {countOf(post.comments)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSaved={onSaved} />}
    </div>
  );
}
