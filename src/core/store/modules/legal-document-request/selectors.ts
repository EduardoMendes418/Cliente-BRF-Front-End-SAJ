import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.legalDocRequest;

export const getLoadingLegalDocRequest = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListLegalDocRequest = createSelector(
	[state],
	(state) => state.list
);

export const getListFiltersLegalDocRequest = createSelector(
	[state],
	(state) => state.listFilters
);

export const getItemLegalDocRequest = createSelector(
	[state],
	(state) => state.item
);

export const getHasItemLegalDocRequest = createSelector(
	[state],
	({ item }) => !!item?.id
);

export const getStatusLegalDocRequest = createSelector(
	[state],
	(state) => state.status,
);

export const getProcessFolderDataLegalDocRequest = createSelector(
	[state],
	({ item }) => item,
);

export const getErrorMessageLegalDocRequest = createSelector(
	[state],
	(state): string => {
		if (!state.error) return '';
		else if (typeof state.error === 'object' && state.error !== null) return (state.error as any).detail;

		return state.error as string;
	},
);

export const getReplacementParties = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionReplacement?.parties
	}
)

export const getReplacementProcess = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionReplacement?.processes
	}
)

export const getReplacement = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionReplacement
	}
)

export const getReplacentCompany = createSelector(
	[getReplacementParties],
	(parties) => {
		if (!parties) return

		return parties.filter(x => x.partyType === 1)[0]
	}
)

export const getPrepositionParties = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionLetter?.parties
	}
)

export const getPrepositionProcess = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionLetter?.processes
	}
)

export const GetPreposition = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.prepositionLetter
	}
)

export const getPrepositionCompany = createSelector(
	[getPrepositionParties],
	(parties) => {
		if (!parties) return

		return parties.filter(x => x.partyType === 1)[0]
	}
)

export const getEletronicLegalGranteds = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.eletronicProcurationLegal?.granteds
	}
)

export const getEletronicLegal = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.eletronicProcurationLegal
	}
)

export const getEletronicOtherAreaGranteds = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.eletronicProcurationOtherArea?.granteds
	}
)

export const getEletronicOtherArea = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.eletronicProcurationOtherArea
	}
)

export const getRequestUserLegalDocRequest = createSelector(
	[state],
	({ item }) => {
		if (!item) return

		return item.requestUser
	}
)