import { createSelector } from "@reduxjs/toolkit";

import { TState } from "src/core/models";
import { RootState } from "../../index";

const state = (state: RootState) => state.judicialBlocksAndTransfers;

export const getLoadingJudicialBlocksAndTransfers = createSelector(
	[state],
	({ status }) => status === "fetching"
);

export const getFiltersJudicialBlocksAndTransfers = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getListJudicialBlocksAndTransfers = createSelector(
	[state],
	({ list }) => list ?? []
);

export const getItemJudicialBlocksAndTransfers = createSelector(
	[state],
	({ item }) => item
);

export const getStatus = createSelector([state], ({ status }) => status);

export const getRedirectUrl = createSelector(
	[state],
	({ redirectUrl }) => redirectUrl
);

export const getHasItemJudicialBlocksAndTransfers = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getErrorMessage = createSelector(
	[state],
	({ error }: TState): string => {
		if (!error) return "";

		if (typeof error === "object" && error !== null)
			return (error as any).error;

		return error as string;
	}
);

export const getError = createSelector(
	[state],
    ({error}) => error

	);

export const getJudicialBlocksAndTransfersAccounting = createSelector(
	[state],
	({ acconting }) => acconting
);
