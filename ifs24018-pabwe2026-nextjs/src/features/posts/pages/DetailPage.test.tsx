import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNav, mockRouter } from "@/setupTests";
import { showConfirmDialog, showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import * as actions from "../states/action";
import DetailPage from "./DetailPage";

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../helpers/toolsHelper")>()),
  showConfirmDialog: vi.fn(),
  showWarningDialog: vi.fn(),
}));
vi.mock("../modals/ChangeModal", () => ({
  default: ({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) => (
    <div><button onClick={onClose}>Tutup Ubah</button><button onClick={onSaved}>Simpan Ubah</button></div>
  ),
}));
vi.mock("../modals/ChangeCoverModal", () => ({
  default: ({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) => (
    <div><button onClick={onClose}>Tutup Cover</button><button onClick={onSaved}>Simpan Cover</button></div>
  ),
}));
vi.mock("../states/action", async (importOriginal) => {
  const real = await importOriginal<typeof import("../states/action")>();
  const noop = () => vi.fn(() => ({ type: "noop" }));
  return {
    ...real,
    asyncGetPost: noop(),
    asyncDeletePost: noop(),
    asyncLikePost: noop(),
    asyncAddComment: noop(),
    asyncDeleteComment: noop(),
  };
});

const confirm = showConfirmDialog as unknown as ReturnType<typeof vi.fn>;
const me = { id: 1, name: "Budi", email: "b@b.c", photo: null };
const base = {
  id: 5, description: "Isi postingan", cover: "img/p.png", created_at: "2024-01-01T00:00:00Z",
  author: { id: 1, name: "Budi", photo: null },
  likes: [{ user_id: 1 }],
  comments: [
    { id: 10, comment: "Komentar saya", created_at: "2024-01-02T00:00:00Z", author: { id: 1, name: "Budi" } },
    { id: 11, comment: "Komentar lain", created_at: "2024-01-02T00:00:00Z", user_id: 2 },
  ],
};

const setup = (state: object = {}) => {
  mockNav.params = { postId: "5" };
  return renderWithProviders(<DetailPage />, { preloadedState: { post: base, profile: me, ...state } });
};

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan pesan memuat bila data belum sesuai id", () => {
    setup({ post: { ...base, id: 99 } });
    expect(actions.asyncGetPost).toHaveBeenCalledWith("5");
    expect(screen.getByText(/Memuat detail/)).toBeInTheDocument();
  });

  it("pemilik: detail lengkap, sudah disukai, tombol kelola & komentar sendiri terhapus-able", async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getByAltText("Cover postingan")).toBeInTheDocument();
    expect(screen.getByText("Komentar (2)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Batal Suka \(1\)/ })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Hapus komentar")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /Batal Suka/ }));
    expect(actions.asyncLikePost).toHaveBeenCalledWith(5, "unlike");
    await user.click(screen.getByLabelText("Hapus komentar"));
    expect(actions.asyncDeleteComment).toHaveBeenCalledWith(5, 10);
  });

  it("bukan pemilik & belum suka: tanpa tombol kelola, tanpa cover, komentar berupa angka", async () => {
    const user = userEvent.setup();
    setup({
      profile: { ...me, id: 9 },
      post: { ...base, cover: null, author: undefined, user_id: 1, likes: 4, comments: 2 },
    });
    expect(screen.queryByAltText("Cover postingan")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus Postingan" })).not.toBeInTheDocument();
    expect(screen.getByText("Komentar (0)")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Suka \(4\)/ }));
    expect(actions.asyncLikePost).toHaveBeenCalledWith(5, "like");
  });

  it("mengirim komentar: validasi kosong, lalu kirim dan kosongkan input", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Kirim" }));
    expect(showWarningDialog).toHaveBeenCalled();
    await user.type(screen.getByLabelText("Komentar"), "Mantap");
    await user.click(screen.getByRole("button", { name: "Kirim" }));
    expect(actions.asyncAddComment).toHaveBeenCalledWith("5", "Mantap");
    expect(screen.getByLabelText("Komentar")).toHaveValue("");
  });

  it("modal ubah postingan & cover: buka, tutup, dan simpan (muat ulang)", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Ubah Postingan" }));
    await user.click(screen.getByText("Tutup Ubah"));
    await user.click(screen.getByRole("button", { name: "Ubah Postingan" }));
    await user.click(screen.getByText("Simpan Ubah"));
    expect(screen.queryByText("Simpan Ubah")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ubah Cover" }));
    await user.click(screen.getByText("Tutup Cover"));
    await user.click(screen.getByRole("button", { name: "Ubah Cover" }));
    await user.click(screen.getByText("Simpan Cover"));
    expect(screen.queryByText("Simpan Cover")).not.toBeInTheDocument();
    expect(actions.asyncGetPost).toHaveBeenCalledTimes(3);
  });

  it("hapus postingan: batal tidak menghapus, konfirmasi menghapus", async () => {
    const user = userEvent.setup();
    setup();
    confirm.mockResolvedValueOnce(false);
    await user.click(screen.getByRole("button", { name: "Hapus Postingan" }));
    expect(actions.asyncDeletePost).not.toHaveBeenCalled();
    confirm.mockResolvedValueOnce(true);
    await user.click(screen.getByRole("button", { name: "Hapus Postingan" }));
    expect(actions.asyncDeletePost).toHaveBeenCalledWith("5");
  });

  it("like/komentar berubah: reset flag dan muat ulang detail", () => {
    const { store } = setup({ isPostLiked: true, isPostAddedComment: true, isPostDeletedComment: true });
    expect(store.getState().isPostLiked).toBe(false);
    expect(store.getState().isPostAddedComment).toBe(false);
    expect(store.getState().isPostDeletedComment).toBe(false);
    expect(actions.asyncGetPost).toHaveBeenCalledTimes(2);
  });

  it("setelah dihapus: kembali ke beranda", () => {
    const { store } = setup({ isPostDeleted: true });
    expect(mockRouter.push).toHaveBeenCalledWith("/");
    expect(store.getState().isPostDeleted).toBe(false);
  });
});
