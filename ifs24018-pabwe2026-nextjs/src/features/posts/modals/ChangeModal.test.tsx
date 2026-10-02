import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangePost } from "../states/action";
import ChangeModal from "./ChangeModal";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../states/action")>()),
  asyncChangePost: vi.fn(() => ({ type: "noop" })),
}));

const post = { id: 7, description: "Awal", cover: null, created_at: "2024-01-01" };

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("terisi data awal dan memvalidasi input kosong", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangeModal post={post} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByLabelText("Deskripsi")).toHaveValue("Awal");
    await user.clear(screen.getByLabelText("Deskripsi"));
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(asyncChangePost).not.toHaveBeenCalled();
  });

  it("mengirim perubahan dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal post={post} onClose={onClose} onSaved={vi.fn()} />);
    await user.type(screen.getByLabelText("Deskripsi"), " baru");
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    expect(asyncChangePost).toHaveBeenCalledWith(7, { description: "Awal baru" });
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("memanggil onSaved dan mereset flag ketika isPostChanged true", () => {
    const onSaved = vi.fn();
    const { store } = renderWithProviders(<ChangeModal post={post} onClose={vi.fn()} onSaved={onSaved} />, {
      preloadedState: { isPostChanged: true },
    });
    expect(onSaved).toHaveBeenCalled();
    expect(store.getState().isPostChanged).toBe(false);
  });
});
