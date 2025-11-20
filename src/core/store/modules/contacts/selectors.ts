import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

const state = (state: RootState) => state.contacts;

export const getIsFetchingContacts = createSelector(
	[state],
	({ status }) => status === 'fetching',
);

export const getFilterContacts = createSelector(
	[state],
	({ filter }) => filter
);

export const getListContacts = createSelector(
	[state],
	({ list }) => list
);

export const getItemContacts = createSelector(
	[state],
	({ item }) => item
);

export const getMultipleListContacts = createSelector(
	[state],
	({ multipleList }) => multipleList
);

export const getContactsWithoutIncludes = createSelector(
	[state],
	({ withoutIncludes }) => withoutIncludes
)