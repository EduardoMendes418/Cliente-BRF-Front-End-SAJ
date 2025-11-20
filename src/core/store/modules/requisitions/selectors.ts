import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from '.'

const state = (state: RootState) => state.requisitions;

export const getListRequisitions = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemRequisitions = createSelector(
	[state],
	({ item }: State) => item
);

export const getExpectedServiceDateRequisitions = createSelector(
	[state],
	(state) => state.deadlineDate ?? ''
);

export const getStatusRequisitions = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingRequisitions = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageRequisitions = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getFeedbackErrorMessageRequisitions = createSelector(
	[state],
	({ error }: State) => error?.logs
);

export const getHasItemRequisitions = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getFiltersRequisitions = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getRollbackStatusIfCancelRequisitions = createSelector(
	[state],
	({ rollbackStatusIfCancel }: State) => rollbackStatusIfCancel
);