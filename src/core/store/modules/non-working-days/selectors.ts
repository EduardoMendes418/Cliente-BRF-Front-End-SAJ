import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import { uniq } from 'ramda';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.nonWorkingDays;

export const getListNonWorkingDays = createSelector(
	[state],
	({ list }: State) => list
);

export const getListMonthNonWorkingDays = createSelector(
	[state],
	({ listMonth }: State) => uniq(listMonth.map(({ date }) => moment(date).format('D')))
);

export const getCurrentYearMonthNonWorkingDays = createSelector(
	[state],
	({ currenYearMonth }: State) => currenYearMonth
);

export const getItemNonWorkingDays = createSelector(
	[state],
	({ item }) => item
);

export const getStatusNonWorkingDays = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingNonWorkingDays = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageNonWorkingDays = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getListFiltersNonWorkingDays = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);
