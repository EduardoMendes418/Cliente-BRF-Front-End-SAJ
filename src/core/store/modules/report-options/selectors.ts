import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { convertToOptions } from 'src/core/utils/func';

const state = (state: RootState) => state.reportOptions;

export const getBusinessAreas = createSelector(
	[state],
	(state) => state.businessAreas ?? []
);

export const getBusinessAreasAsOptions = createSelector(
	[getBusinessAreas],
	(businessAreas) => convertToOptions(businessAreas)
);

export const getProvisionClasses = createSelector(
	[state],
	(state) => state.provisionClasses ?? []
);

export const getGrouperCostCenters = createSelector(
	[state],
	(state) => state.grouperCostCenters ?? []
);

export const getProvisionClassesAsOptions = createSelector(
	[getProvisionClasses],
	(provisionClasses) => convertToOptions(provisionClasses)
);

