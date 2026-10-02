import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRouter } from "@/setupTests";
import { putAccessToken } from "../../../helpers/apiHelper";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import { asyncGetProfile } from "../../users/states/action";
import PostLayout from "./PostLayout";

vi.mock("../../../helpers/toolsHelper", () => ({ showConfirmDialog: vi.fn() }));
vi.mock("../../auth/states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../auth/states/action")>()),
  asyncSetIsAuthLogout: vi.fn(() => ({ type: "noop" })),
}));
vi.mock("../../users/states/action", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../users/states/action")>()),
  asyncGetProfile: vi.fn(() => ({ type: "noop" })),
}));

const ui = <PostLayout><div>Isi Halaman</div></PostLayout>;
const confirm = showConfirmDialog as unknown as ReturnType<typeof vi.fn>;

describe("PostLayout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tanpa token: alihkan ke login, konten tidak dirender, profil tidak dimuat", () => {
    renderWithProviders(ui);
    expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login");
    expect(screen.queryByText("Isi Halaman")).not.toBeInTheDocument();
    expect(asyncGetProfile).not.toHaveBeenCalled();
  });

  it("dengan token: memuat profil, menampilkan navbar, sidebar, dan konten", async () => {
    putAccessToken("tok");
    renderWithProviders(ui, { preloadedState: { profile: { id: 1, name: "Budi", email: "b", photo: null } } });
    expect(asyncGetProfile).toHaveBeenCalled();
    expect(screen.getByText("Isi Halaman")).toBeInTheDocument();
    expect(screen.getByText("Budi", { selector: "span.hidden" })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("logout: batal tidak melakukan apa-apa, konfirmasi memanggil logout", async () => {
    const user = userEvent.setup();
    putAccessToken("tok");
    renderWithProviders(ui);
    confirm.mockResolvedValueOnce(false);
    await user.click(screen.getByLabelText("Menu profil"));
    await user.click(screen.getByText("Keluar"));
    expect(asyncSetIsAuthLogout).not.toHaveBeenCalled();

    confirm.mockResolvedValueOnce(true);
    await user.click(screen.getByText("Keluar"));
    expect(asyncSetIsAuthLogout).toHaveBeenCalled();
  });

  it("menuju login dan mereset state ketika isAuthLogout true", () => {
    putAccessToken("tok");
    const { store } = renderWithProviders(ui, { preloadedState: { isAuthLogout: true } });
    expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login");
    expect(store.getState().isAuthLogout).toBe(false);
  });
});
