import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import {
	getProcessFolder,
	getProcessLocalidade,
} from 'src/core/store/modules/process/selectors';

const state = (state: RootState) => state.calculations;

export const getCalculationsIsSaving = createSelector(
	[state],
	(state) => state.status === 'saving'
);

export const getCalculationsIsEdited = createSelector(
	[state],
	(state) => state.status === 'edited'
);

export const getCalculationsIsFailure = createSelector(
	[state],
	(state) => state.status === 'failure'
);

export const getCalculationsFolderInfo = createSelector(
	[getProcessFolder, getProcessLocalidade],
	(folder, localidade) => {
		const {
			processNumber,
			oldNumber,
			legalDepartmentArea,
			costCenter,
			provisionClass,
			processParties,
			closed,
		} = folder;

		return {
			processNumber: processNumber ?? oldNumber ?? '',
			legalDepartmentArea,
			costCenter,
			provisionClass,
			localidade,
			processParties,
			closed,
		};
	}
);
