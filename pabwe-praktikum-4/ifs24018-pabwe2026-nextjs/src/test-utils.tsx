import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { reducer, type RootState } from "./store";

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {} }: { preloadedState?: object } = {}
) {
  const store = configureStore({ reducer, preloadedState: preloadedState as Partial<RootState> });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
