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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{isMe ? "Postingan Saya" : "Linimasa Postingan"}</h2>
        <div className="flex gap-2">
          {isMe && (
            <button onClick={onDeleteAll} className="rounded-lg border border-red-300 px-4 py-2 text-red-600">
              Hapus Semua
            </button>
          )}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
            <IconPlus size={18} /> Tambah Postingan
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <Link href="/" className={`rounded-full px-4 py-1.5 ${isMe ? "bg-white" : "bg-indigo-600 text-white"}`}>Semua</Link>
        <Link href="/?tab=me" className={`rounded-full px-4 py-1.5 ${isMe ? "bg-indigo-600 text-white" : "bg-white"}`}>Milik Saya</Link>
        <input value={keyword} onChange={onKeyword} placeholder="Cari postingan..."
          className="min-w-52 flex-1 rounded-lg border border-slate-300 px-3 py-2 font-normal" />
      </div>

      {isLoading && <p className="text-slate-500">Memuat data...</p>}
      {filtered.length === 0 ? (
        <p className="text-slate-500">Tidak ada postingan ditemukan.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}
                className="block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
                {post.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(post.cover)} alt="Cover postingan" className="h-44 w-full object-cover" />
                )}
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-indigo-700">{getAuthor(post).name}</p>
                  <p className="line-clamp-3">{post.description}</p>
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
