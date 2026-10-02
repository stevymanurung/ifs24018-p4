import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncAddPost } from "../states/action";
import AddModal from "./AddModal";

vi.mock("../../../helpers/toolsHelper", () => ({ showWarningDialog: vi.fn() }));
vi.mock("../states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../states/action")>()),
  asyncAddPost: vi.fn(() => ({ type: "noop" })),
}));

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi deskripsi kosong", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddModal onClose={vi.fn()} onSaved={vi.fn()} />);
    await user.type(screen.getByLabelText("Deskripsi"), "   ");
    await user.click(screen.getByRole("button", { name: "Publikasikan" }));
    expect(showWarningDialog).toHaveBeenCalled();
    expect(asyncAddPost).not.toHaveBeenCalled();
  });

  it("mengirim postingan dan menutup lewat Batal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} onSaved={vi.fn()} />);
    await user.type(screen.getByLabelText("Deskripsi"), "Halo dunia");
    await user.click(screen.getByRole("button", { name: "Publikasikan" }));
    expect(asyncAddPost).toHaveBeenCalledWith({ description: "Halo dunia" });
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("memanggil onSaved dan mereset flag ketika isPostAdded true", () => {
    const onSaved = vi.fn();
    const { store } = renderWithProviders(<AddModal onClose={vi.fn()} onSaved={onSaved} />, {
      preloadedState: { isPostAdded: true },
    });
    expect(onSaved).toHaveBeenCalled();
    expect(store.getState().isPostAdded).toBe(false);
  });
});
