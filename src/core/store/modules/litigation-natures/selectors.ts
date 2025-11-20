import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.litigationNatures;

export const getListLitigationNatures = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getListLitigationNaturesAsOptions = createSelector(
	[getListLitigationNatures],
	(list) =>
	 list
       .map(({ name, id }) => ({ label: name, value: Number(id) }))
       .sort(function (a, b) {
         return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
       })
);
