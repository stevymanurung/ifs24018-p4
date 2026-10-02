import Swal from "sweetalert2";
import type { Post, PostAuthor } from "../types";

const base = { confirmButtonColor: "#4f46e5" };

export const showSuccessDialog = (message: string) =>
  Swal.fire({ ...base, icon: "success", title: "Berhasil", text: message });

export const showErrorDialog = (message: string) =>
  Swal.fire({ ...base, icon: "error", title: "Gagal", text: message });

export const showWarningDialog = (message: string) =>
  Swal.fire({ ...base, icon: "warning", title: "Perhatian", text: message });

export async function showConfirmDialog(message: string, confirmText = "Ya"): Promise<boolean> {
  const result = await Swal.fire({
    ...base,
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export const formatDate = (value: string): string =>
  new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Jumlah like/komentar bisa berupa array atau angka dari API
export const countOf = (value: unknown): number =>
  Array.isArray(value) ? value.length : Number(value) || 0;

export const getAuthor = (post: Post): PostAuthor => post.author ?? { name: "Pengguna" };

export const getOwnerId = (post: Post): string | number | undefined =>
  post.author?.id ?? post.user_id;

export const isOwnedBy = (
  ownerId: string | number | undefined,
  profile: { id: string | number } | null
): boolean => profile != null && ownerId != null && String(ownerId) === String(profile.id);
