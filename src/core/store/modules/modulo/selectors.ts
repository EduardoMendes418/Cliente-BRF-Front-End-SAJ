import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.modulo;

export const getModuloList = createSelector([state], (state) => state.list);
