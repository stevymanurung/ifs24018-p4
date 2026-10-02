import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNav } from "@/setupTests";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncDeleteAllPosts, asyncGetPosts } from "../states/action";
import HomePage from "./HomePage";

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../helpers/toolsHelper")>()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../modals/AddModal", () => ({
  default: ({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) => (
    <div>
      <button onClick={onClose}>Tutup Modal</button>
      <button onClick={onSaved}>Simpan Modal</button>
    </div>
  ),
}));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../states/action")>()),
  asyncGetPosts: vi.fn(() => ({ type: "noop" })),
  asyncDeleteAllPosts: vi.fn(() => ({ type: "noop" })),
}));

const posts = [
  { id: 1, description: "Belajar React", cover: null, created_at: "2024-01-01T00:00:00Z", author: { name: "Budi" }, likes: [{ user_id: 1 }], comments: 3 },
  { id: 2, description: "Belajar Next", cover: "img/p.png", created_at: "2024-01-02T00:00:00Z", author: { name: "Siti" } },
];
const confirm = showConfirmDialog as unknown as ReturnType<typeof vi.fn>;
const setup = (extra = {}) => renderWithProviders(<HomePage />, { preloadedState: { posts, ...extra } });

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat semua postingan dan menampilkan kartu (like & komentar)", () => {
    setup({ isPost: true });
    expect(asyncGetPosts).toHaveBeenCalledWith({});
    expect(screen.getByText("Linimasa Postingan")).toBeInTheDocument();
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
    expect(screen.getByText("Belajar React").closest("a")).toHaveAttribute("href", "/posts/1");
    expect(screen.getByAltText("Cover postingan")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus Semua" })).not.toBeInTheDocument();
  });

  it("mencari berdasarkan deskripsi atau nama pembuat, serta pesan kosong", async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByPlaceholderText(/Cari postingan/), "siti");
    expect(screen.queryByText("Belajar React")).not.toBeInTheDocument();
    expect(screen.getByText("Belajar Next")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/Cari postingan/), "zzz");
    expect(screen.getByText(/Tidak ada postingan/)).toBeInTheDocument();
  });

  it("tab 'Milik Saya' memuat is_me=1; hapus semua: batal & konfirmasi", async () => {
    const user = userEvent.setup();
    mockNav.search = "tab=me";
    setup();
    expect(asyncGetPosts).toHaveBeenCalledWith({ is_me: 1 });
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    confirm.mockResolvedValueOnce(false);
    await user.click(screen.getByRole("button", { name: "Hapus Semua" }));
    expect(asyncDeleteAllPosts).not.toHaveBeenCalled();
    confirm.mockResolvedValueOnce(true);
    await user.click(screen.getByRole("button", { name: "Hapus Semua" }));
    expect(asyncDeleteAllPosts).toHaveBeenCalled();
  });

  it("membuka modal tambah, menutup, dan menyimpan (muat ulang)", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: /Tambah Postingan/ }));
    await user.click(screen.getByText("Tutup Modal"));
    expect(screen.queryByText("Simpan Modal")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Tambah Postingan/ }));
    await user.click(screen.getByText("Simpan Modal"));
    expect(screen.queryByText("Simpan Modal")).not.toBeInTheDocument();
    expect(asyncGetPosts).toHaveBeenCalledTimes(2);
  });

  it("setelah semua postingan dihapus: reset flag dan muat ulang", () => {
    const { store } = setup({ isPostDeletedAll: true });
    expect(store.getState().isPostDeletedAll).toBe(false);
    expect(asyncGetPosts).toHaveBeenCalledTimes(2);
  });
});
