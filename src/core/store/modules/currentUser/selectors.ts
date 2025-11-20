import { createSelector } from '@reduxjs/toolkit';
import { permissionsScreens } from 'src/config/func';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.currentUser;

export const getDataCurrentUser = createSelector(
	[state],
	({ data }: State) => data
);

export const getPermissionsCurrentUser = createSelector(
	[state],
	({ permissions }: State) => permissions
);

export const getScreenPermissionsCurrentUser = createSelector(
	[getPermissionsCurrentUser],
	permissionsScreens
);

export const getStatusCurrentUser = createSelector(
	[state],
	({ status }) => status
);

export const getIdbrfCurrentUser = createSelector(
	[state],
	({ data }) => data.idBrf
);

export const getIdbrfCurrentUserFinal = createSelector(
	[getIdbrfCurrentUser],
	(idBrf) => idBrf ?? 0
);

export const getLoadingCurrentUser = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageCurrentUser = createSelector(
	[state],
	({ error }: State): string => error?.detail
);


