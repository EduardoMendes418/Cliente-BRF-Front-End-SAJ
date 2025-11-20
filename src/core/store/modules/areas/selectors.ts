import { createSelector } from '@reduxjs/toolkit';
import { TArea } from 'src/core/models/areas';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.areas;

export const getListAreasDEJUR = createSelector([state], (state) => state.listDEJUR);

export const getListAreasDEJURGrouped = createSelector([state], (state) => state.listDEJURGrouped);

export const getListAreasDEJURGroupedByUser = createSelector([state], (state) => state.listDEJURGroupedByUser);


export const getListAreasDEJURbyUser = createSelector([state], (state) => state.listDEJURbyUser);

export const getListAreasResponsible = createSelector([state], (state) => state.listResponsible);

export const getLoadingAreasDEJUR = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getAreasDEJURAsOptions = createSelector([getListAreasDEJUR], (areas) =>
	{
		return areas.filter(({parentAreaId}) => parentAreaId === 1).map((area) => ({ label: area.name, value: area.id }))
	},
);

export const getAreasResponsibleAsOptions = createSelector([getListAreasResponsible], (areas) =>
	areas.map((area) => ({ label: area.name, value: area.id })),
);

export const getAreasResponsiblePathAsOptions = createSelector([getListAreasResponsible], (areas) =>
	areas.map((area) => ({ label: area.path, value: area.id })),
);

export const getAreasDEJURWithNamesAsValues = createSelector([getListAreasDEJUR], (areas) =>
	areas.map((area) => ({ label: area.name, value: area.name })).sort((a, b) => a.label.localeCompare(b.label)),
);


export const getAreasDEJURPathAsOptions = createSelector([getListAreasDEJUR], (areas) =>
	areas.map((area) => ({ label: area.path, value: area.id })),
);

export const getAreaByName = createSelector([getListAreasDEJUR], (areas) => {
	const areaByName: {
		[name: string]: TArea;
	} = {};

	areas.forEach((area) => {
		areaByName[area.name] = area;
	});

	return areaByName;
});

export const getAreaByID = createSelector([getListAreasDEJUR], (areas) => {
	const areaByID: {
		[key: number]: TArea;
	} = {};

	areas.forEach((area) => {
		if (area.id) areaByID[area.id] = area;
	});

	return areaByID;
});

export const getAreaResponsibleByID = createSelector([getListAreasResponsible], (areas) => {
	const areaByID: {
		[key: number]: TArea;
	} = {};

	areas.forEach((area) => {
		if (area.id) areaByID[area.id] = area;
	});

	return areaByID;
});
