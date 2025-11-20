import { createSlice } from '@reduxjs/toolkit';
import { fetchUser } from './thunks';
import { TState } from 'src/core/models';
import { clears } from '..';
import { TPermissions } from 'src/core/models/profiles';
import { pathEq, pathOr } from 'ramda';

export type TError = { detail: string };

type TUserData = {
	id?: number;
	idBrf?: number;
	name?: string;
	email: string;
	dejurAreas?: number[];
	responsibleAreas?: number[];
	isAdmin?: boolean;
	profileId?: number;
}

export type State = {
	permissions: TPermissions[];
	data: TUserData;
	error: TError;
};

export const initialState: TState & State = {
	status: 'initial',
	permissions: [] as TPermissions[],
	data: {} as TUserData,
	error: {} as TError
};

const slice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: clears(initialState),
	extraReducers: ({ addCase }) => {
		addCase(fetchUser.fulfilled, (state, { payload }) => {
			state.permissions = pathEq(['profile', 'status'], true, payload)
				? pathOr([], ['profile', 'permissions'], payload)
				: []
			state.data = {
				id: payload.id,
				idBrf: payload.idBrf ?? 0,
				name: payload.name ?? '',
				email: payload.email,
				dejurAreas: payload.dejurArea,
				responsibleAreas: payload.responsibleArea,
				isAdmin: payload.isAdmin,
				profileId: payload.profileId
			}
			state.status = 'initial';
		});

		addCase(fetchUser.pending, (state) => {
			state.status = 'fetching';
		});

		addCase(fetchUser.rejected, (state, { payload, meta }) => {
			state.status = 'failure';
			state.data = { email: meta.arg };
			state.permissions = [];
			state.error = payload as TError;
		});

	},
});

export default slice;
