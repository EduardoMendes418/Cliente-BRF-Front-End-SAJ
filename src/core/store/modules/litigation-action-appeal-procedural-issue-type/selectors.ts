import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { convertToOptions } from 'src/core/utils/func';

const state = (state: RootState) => state.litigationActionAppealProceduralIssueType;

export const getListLitigationActionAppealProceduralIssueType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getListLitigationActionAppealProceduralIssueTypeAsOptions = createSelector(
	[getListLitigationActionAppealProceduralIssueType],
	(list) => convertToOptions(list)
);
