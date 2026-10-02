import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockNav } from "@/setupTests";
import SidebarComponent from "./SidebarComponent";

describe("SidebarComponent", () => {
  it("menampilkan seluruh menu dan menandai menu aktif", () => {
    mockNav.pathname = "/users";
    render(<SidebarComponent open={false} onClose={vi.fn()} />);
    ["Semua Postingan", "Postingan Saya", "Daftar Pengguna", "Profil Saya"].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
    expect(screen.getByText("Daftar Pengguna").closest("a")).toHaveClass("text-indigo-700");
    expect(screen.getByText("Profil Saya").closest("a")).not.toHaveClass("text-indigo-700");
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  it("drawer terbuka: overlay dan menu menutup drawer saat diklik", async () => {
    const onClose = vi.fn();
    render(<SidebarComponent open onClose={onClose} />);
    await userEvent.click(screen.getByTestId("sidebar-overlay"));
    await userEvent.click(screen.getByText("Daftar Pengguna"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
