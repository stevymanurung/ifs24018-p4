import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangePostCover } from "../states/action";
import ChangeCoverModal from "./ChangeCoverModal";

vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../states/action")>()),
  asyncChangePostCover: vi.fn(() => ({ type: "noop" })),
}));

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("tombol unggah nonaktif sebelum berkas dipilih", () => {
    renderWithProviders(<ChangeCoverModal postId={3} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Unggah" })).toBeDisabled();
    expect(screen.queryByAltText("Pratinjau cover")).not.toBeInTheDocument();
  });

  it("menampilkan pratinjau, mengunggah, dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal postId={3} onClose={onClose} onSaved={vi.fn()} />);
    const file = new File(["x"], "c.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Berkas cover"), file);
    expect(screen.getByAltText("Pratinjau cover")).toHaveAttribute("src", "blob:preview");
    await user.click(screen.getByRole("button", { name: "Unggah" }));
    expect(asyncChangePostCover).toHaveBeenCalledWith(3, file);
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("membatalkan pilihan berkas mengosongkan pratinjau", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangeCoverModal postId={3} onClose={vi.fn()} onSaved={vi.fn()} />);
    const input = screen.getByLabelText("Berkas cover");
    await user.upload(input, new File(["x"], "c.png", { type: "image/png" }));
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByAltText("Pratinjau cover")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unggah" })).toBeDisabled();
  });

  it("memanggil onSaved dan mereset flag ketika isPostChangedCover true", () => {
    const onSaved = vi.fn();
    const { store } = renderWithProviders(<ChangeCoverModal postId={3} onClose={vi.fn()} onSaved={onSaved} />, {
      preloadedState: { isPostChangedCover: true },
    });
    expect(onSaved).toHaveBeenCalled();
    expect(store.getState().isPostChangedCover).toBe(false);
  });
});
