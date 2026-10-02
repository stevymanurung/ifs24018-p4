"use client";

import { IconHeart, IconHeartFilled, IconTrash } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Avatar from "../../../components/Avatar";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  countOf,
  formatDate,
  getAuthor,
  getOwnerId,
  isOwnedBy,
  showConfirmDialog,
  showWarningDialog,
} from "../../../helpers/toolsHelper";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useInput from "../../../hooks/useInput";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncAddComment,
  asyncDeleteComment,
  asyncDeletePost,
  asyncGetPost,
  asyncLikePost,
  setIsPostAddedCommentActionCreator,
  setIsPostDeletedActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostLikedActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const post = useAppSelector((s) => s.post);
  const profile = useAppSelector((s) => s.profile);
  const isLiked = useAppSelector((s) => s.isPostLiked);
  const isAddedComment = useAppSelector((s) => s.isPostAddedComment);
  const isDeletedComment = useAppSelector((s) => s.isPostDeletedComment);
  const isDeleted = useAppSelector((s) => s.isPostDeleted);
  const [modal, setModal] = useState<"change" | "cover" | null>(null);
  const [comment, onComment, setComment] = useInput();

  useEffect(() => {
    dispatch(asyncGetPost(postId));
  }, [dispatch, postId]);

  // Like/komentar berubah: reset flag lalu muat ulang detail
  useEffect(() => {
    if (isLiked || isAddedComment || isDeletedComment) {
      dispatch(setIsPostLikedActionCreator(false));
      dispatch(setIsPostAddedCommentActionCreator(false));
      dispatch(setIsPostDeletedCommentActionCreator(false));
      dispatch(asyncGetPost(postId));
    }
  }, [isLiked, isAddedComment, isDeletedComment, dispatch, postId]);

  // Modal ubah postingan/cover berhasil menyimpan: tutup modal dan muat ulang
  const onSaved = useCallback(() => {
    setModal(null);
    dispatch(asyncGetPost(postId));
  }, [dispatch, postId]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(setIsPostDeletedActionCreator(false));
      router.push("/");
    }
  }, [isDeleted, dispatch, router]);

  const onDelete = async () => {
    if (await showConfirmDialog("Hapus postingan ini?", "Hapus")) {
      dispatch(asyncDeletePost(postId));
    }
  };

  const onSubmitComment = (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) {
      showWarningDialog("Komentar tidak boleh kosong");
      return;
    }
    dispatch(asyncAddComment(postId, comment));
    setComment("");
  };

  if (!(post && String(post.id) === postId)) {
    return <p className="text-slate-500">Memuat detail postingan...</p>;
  }

  const author = getAuthor(post);
  const isOwner = isOwnedBy(getOwnerId(post), profile);
  const liked =
    Array.isArray(post.likes) && post.likes.some((l) => String(l.user_id) === String(profile?.id));
  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <article className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={assetUrl(post.cover)} alt="Cover postingan"
          className="max-h-96 w-full rounded-xl bg-slate-100 object-contain" />
      )}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Avatar name={author.name} photo={author.photo} className="h-8 w-8" />
        <span className="font-semibold text-slate-800">{author.name}</span>
        <span>· {formatDate(post.created_at)}</span>
      </div>
      <p className="whitespace-pre-line">{post.description}</p>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => dispatch(asyncLikePost(post.id, liked ? "unlike" : "like"))}
          className="flex items-center gap-1 rounded-lg border px-4 py-2">
          {liked ? <IconHeartFilled size={18} className="text-red-500" /> : <IconHeart size={18} />}
          {liked ? "Batal Suka" : "Suka"} ({countOf(post.likes)})
        </button>
        {isOwner && (
          <>
            <button onClick={() => setModal("cover")} className="rounded-lg border px-4 py-2">Ubah Cover</button>
            <button onClick={() => setModal("change")} className="rounded-lg border px-4 py-2">Ubah Postingan</button>
            <button onClick={onDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">Hapus Postingan</button>
          </>
        )}
      </div>

      <section className="space-y-3 border-t pt-4">
        <h3 className="font-bold">Komentar ({comments.length})</h3>
        <form onSubmit={onSubmitComment} className="flex gap-2">
          <input aria-label="Komentar" value={comment} onChange={onComment} placeholder="Tulis komentar..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Kirim</button>
        </form>
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 p-3">
              <div>
                <p className="text-sm font-semibold">{c.author?.name ?? "Pengguna"}</p>
                <p className="text-sm">{c.comment}</p>
                <p className="text-xs text-slate-400">{formatDate(c.created_at)}</p>
              </div>
              {isOwnedBy(c.author?.id ?? c.user_id, profile) && (
                <button aria-label="Hapus komentar" onClick={() => dispatch(asyncDeleteComment(post.id, c.id))}
                  className="text-red-500">
                  <IconTrash size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {modal === "change" && <ChangeModal post={post} onClose={() => setModal(null)} onSaved={onSaved} />}
      {modal === "cover" && <ChangeCoverModal postId={post.id} onClose={() => setModal(null)} onSaved={onSaved} />}
    </article>
  );
}
