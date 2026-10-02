import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockRouter } from "@/setupTests";
import { putAccessToken } from "../../../helpers/apiHelper";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  it("menampilkan banner dan konten anak bila belum login", () => {
    render(<AuthLayout><div>Form Login</div></AuthLayout>);
    expect(screen.getByText("Form Login")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Delcom Posts" })).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("mengalihkan ke beranda dan tidak merender konten bila token ada", () => {
    putAccessToken("tok");
    render(<AuthLayout><div>Form Login</div></AuthLayout>);
    expect(screen.queryByText("Form Login")).not.toBeInTheDocument();
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});
