import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

export type { UnknownAction };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Payload = Record<string, any>;

export type AppAction = UnknownAction & { payload: Payload };

export type AppThunkDispatch = ThunkDispatch<unknown, undefined, UnknownAction>;
export type AppThunk = (dispatch: AppThunkDispatch) => Promise<void> | void;
