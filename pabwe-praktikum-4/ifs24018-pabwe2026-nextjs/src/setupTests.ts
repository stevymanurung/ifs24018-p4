import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

// Mock bersama untuk next/navigation (router, pathname, params)
const hoisted = vi.hoisted(() => ({
  mockRouter: { push: vi.fn(), replace: vi.fn(), back: vi.fn() },
  mockNav: { pathname: "/", search: "", params: {} as Record<string, string> },
}));
export const mockRouter = hoisted.mockRouter;
export const mockNav = hoisted.mockNav;

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockNav.pathname,
  useParams: () => mockNav.params,
  useSearchParams: () => new URLSearchParams(mockNav.search),
}));

beforeEach(() => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
  mockNav.pathname = "/";
  mockNav.search = "";
  mockNav.params = {};
  localStorage.clear();
});
