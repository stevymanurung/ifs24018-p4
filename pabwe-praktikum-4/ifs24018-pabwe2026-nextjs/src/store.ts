import { configureStore } from "@reduxjs/toolkit";
import { isAuthLogin, isAuthLogout, isAuthRegister } from "./features/auth/states/reducer";
import * as usersReducers from "./features/users/states/reducer";
import * as postsReducers from "./features/posts/states/reducer";

export const reducer = {
  isAuthLogin,
  isAuthRegister,
  isAuthLogout,
  ...usersReducers,
  ...postsReducers,
};

export const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
