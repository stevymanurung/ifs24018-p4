import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NavbarComponent from "./NavbarComponent";

const setup = (profile: { id: number; name: string; email: string; photo: string | null } | null, props = {}) =>
  render(<NavbarComponent profile={profile} onToggleSidebar={vi.fn()} onLogout={vi.fn()} {...props} />);

const budi = { id: 1, name: "Budi", email: "b@b.c", photo: null };

describe("NavbarComponent", () => {
  it("menampilkan status memuat saat profil kosong", () => {
    setup(null);
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
  });

  it("menampilkan nama & foto profil", () => {
    setup({ ...budi, photo: "img/b.png" });
    expect(screen.getByAltText("Budi")).toBeInTheDocument();
  });

  it("memanggil toggle sidebar", async () => {
    const onToggleSidebar = vi.fn();
    setup(budi, { onToggleSidebar });
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("membuka dropdown, menutupnya lewat link profil, dan logout", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    setup(budi, { onLogout });
    await user.click(screen.getByLabelText("Menu profil"));
    await user.click(screen.getByText("Profil Saya"));
    expect(screen.queryByText("Keluar")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Menu profil"));
    await user.click(screen.getByText("Keluar"));
    expect(onLogout).toHaveBeenCalled();
  });
});
