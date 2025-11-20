import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.guaranteeAccountability;

export const getListGuaranteeAccountability = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemGuaranteeAccountability = createSelector(
	[state],
	({ item }) => item
);

export const getHasItemGuaranteeAccountability = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getStatus = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingGuaranteeAccountability = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessage = createSelector(
	[state],
	({ error }: State): string => {
		if (error?.detail && error?.detail.includes('Record already exists in the database'))
			return 'Registro duplicado'
		else return error?.detail
	}
);

export const getFiltersGuaranteeAccountability = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);


export const getaccountability = createSelector(
	[state],
	({ accontability }: State) => accontability
);

export const getAccountabilityArray = createSelector(
	[state],
	({ accontabilityArray }: State) => accontabilityArray
);
export const getCreditReceipt = createSelector(
	[state],
	({ creditReceipt }: State) => creditReceipt
);

export const getGuaranteeAccountabilityAccounting = createSelector(
	[state],
	({ accounting }) => accounting
);
