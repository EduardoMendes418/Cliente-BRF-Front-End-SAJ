import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.litigationPhases;

export const getListLitigationPhases = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getListLitigationPhasesAsOptions = createSelector(
	[getListLitigationPhases],
	(list) =>
	 list
       .map(({ name, id }) => ({ label: name, value: Number(id) }))
       .sort(function (a, b) {
         return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
       })
);
