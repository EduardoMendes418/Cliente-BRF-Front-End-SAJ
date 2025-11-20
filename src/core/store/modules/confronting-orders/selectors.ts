import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.confrontingOrders;

export const getConfrontingOrdersList = createSelector(
	[state],
	({ list }: State) => list
);

export const getConfrontingOrdersLogList = createSelector(
	[state],
	({ logList }: State) => logList
);

export const getConfrontingOrdersIsLoading = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getConfrontingOrdersTableList = createSelector(
	[state],
	({ tableList }: State) => tableList
);

export const getConfrontingOrdersFilters = createSelector(
	[state],
	({ filters }: State) => filters
);
