import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import {
  countOf,
  formatDate,
  getAuthor,
  getOwnerId,
  isOwnedBy,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));
const fire = Swal.fire as unknown as ReturnType<typeof vi.fn>;

describe("toolsHelper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("dialog sukses, error, dan warning memanggil Swal dengan ikon yang tepat", () => {
    showSuccessDialog("ok");
    showErrorDialog("err");
    showWarningDialog("warn");
    expect(fire.mock.calls.map(([o]) => o.icon)).toEqual(["success", "error", "warning"]);
    expect(fire.mock.calls[0][0].text).toBe("ok");
  });

  it("showConfirmDialog mengembalikan status konfirmasi (teks default & custom)", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("hapus?")).toBe(true);
    expect(fire.mock.calls[0][0].confirmButtonText).toBe("Ya");

    fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("keluar?", "Keluar")).toBe(false);
    expect(fire.mock.calls[1][0].confirmButtonText).toBe("Keluar");
  });

  it("formatDate memformat tanggal ke locale Indonesia", () => {
    expect(formatDate("2024-02-28T10:00:00Z")).toContain("2024");
  });

  it("countOf menangani array, angka, dan nilai kosong", () => {
    expect(countOf([1, 2, 3])).toBe(3);
    expect(countOf(4)).toBe(4);
    expect(countOf(undefined)).toBe(0);
  });

  it("getAuthor memakai author atau fallback", () => {
    expect(getAuthor({ id: 1, description: "", cover: null, created_at: "", author: { name: "A" } }).name).toBe("A");
    expect(getAuthor({ id: 1, description: "", cover: null, created_at: "" }).name).toBe("Pengguna");
  });

  it("getOwnerId memakai author.id, lalu user_id", () => {
    const base = { id: 1, description: "", cover: null, created_at: "" };
    expect(getOwnerId({ ...base, author: { id: 7, name: "A" } })).toBe(7);
    expect(getOwnerId({ ...base, user_id: 8 })).toBe(8);
  });

  it("isOwnedBy membandingkan id pemilik dengan profil", () => {
    expect(isOwnedBy(1, { id: "1" })).toBe(true);
    expect(isOwnedBy(2, { id: 1 })).toBe(false);
    expect(isOwnedBy(undefined, { id: 1 })).toBe(false);
    expect(isOwnedBy(1, null)).toBe(false);
  });
});
