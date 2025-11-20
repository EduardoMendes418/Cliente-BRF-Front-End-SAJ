import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../..";

const state = (state: RootState) => state.lockSystem;

export const getItemLockSystem = createSelector(
	[state],
	(state) => state.item
)

export const getListLockSystem = createSelector(
	[state],
	(state) => state.list
)

export const getErrorLockSystem = createSelector(
	[state],
	(state) => state.error
)

export const getStatusLockSystem = createSelector(
	[state],
	(state) => state.status
)

export const getListIsLockSystem = createSelector(
	[state],
	(state) => state.lock
)

export const getIsLockSystem = createSelector(
	[state],
	(state) => {
		if (!!!state.lock)
			return false

		if (state.lock.length === 0) {
			return false
		}

		return true
	}
)