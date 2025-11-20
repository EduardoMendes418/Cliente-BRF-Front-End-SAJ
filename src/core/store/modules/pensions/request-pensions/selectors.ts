import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import {
	getProcessFolder,
	getProcessLocalidade,
	getProcessOppositeParty,
} from 'src/core/store/modules/process/selectors';
import { getAreaByID } from '../../areas/selectors';
import { handleGender } from 'src/core/utils/func';

const state = (state: RootState) => state.pensions.requestPensions;

export const getPensionRequestStatus = createSelector(
	[state],
	(state) => state.status
);

export const getPensionRequestIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching'
);


export const getPensionRequestList = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getPensionRequestByID = (id: number) => {
	return createSelector([state], (state) =>
		state.list.find((item) => item.id === id)
);
};

export const getPensionCategories = createSelector(
	[state],
	(state) => state.categories ?? []
);

export const getPensionClosureReason = createSelector(
	[state],
	(state) => state.closureReason ?? []
);

export const getPensionRequestRows = createSelector(
	[getPensionRequestList, getAreaByID],
	(list, areaByID) => {
		return list.map((item) => ({
			...item,
			id: item.id ?? '',
			requestDate: item.requestDate ?? '',
			folderNumber: item.folderNumber,
			area: areaByID?.[item.areaId]?.name ?? '',
			parteContraria: item.fullName ?? '',
			status: item.requestStatus,
			flowId: item.statusFlowId ?? -1
		}));
	}
);

export const getPensionCategoriesAsOptions = createSelector(
	[getPensionCategories],
	(categories) =>
		categories?.map((category) => {
			return { label: category.description, value: category.id };
		}) ?? []
);

export const getPensionClosureReasonAsOptions = createSelector(
	[getPensionClosureReason],
	(reasons) => {
		if (reasons)
			return reasons?.map((reason) => {
				return { label: reason.description, value: reason.id };
			});
		return [];
	}
);

export const getPensionRequestFolderInfo = createSelector(
	[getProcessFolder, getProcessOppositeParty, getProcessLocalidade],
	(folder, parteContraria, localidade) => {
		const {
			folderNumber,
			gender,
			bornDate,
			costCenter,
			processNumber,
			oldNumber,
			legalDepartmentArea,
			legalDepartmentAreaId,
			city,
			closed,
			individual,
		} = folder;

		return {
			parteContraria: individual !== undefined ? individual.name : '',
			folderNumber,
			costCenter,
			processNumber: processNumber ?? oldNumber ?? '',
			legalDepartmentArea,
			localidade,
			city,
			chaveProcesso: folder?.orders?.[0]?.processId ?? '',
			gender: handleGender(gender),
			bornDate: bornDate ?? '',
			cpf: parteContraria.identificationNumber ?? '',
			closed,
			legalDepartmentAreaId,
			individual: {
				...individual,
				gender: handleGender(individual?.gender),
			},
		};
	}
);

export const getPensionRequestListFilters = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getErrorMessagePensionRequest = createSelector(
	[state],
	(state) => state.error
);