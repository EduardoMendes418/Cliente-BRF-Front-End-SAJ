import { createAsyncThunk } from "@reduxjs/toolkit";
import { pathOr } from "ramda";

import {
	TUser,
	TUserAdditionalInformation,
	TUserFilters,
	TUserRequest,
	userRoleFlag,
} from "src/core/models/users";
import api from "src/core/api/users";
import { actions, RootState } from "../..";
import { ParamsGet } from "src/core/models";
import {
	getAxiosError,
	getBitFlagArray,
	isNull,
	rejectNoValues,
} from "src/core/utils/func";

const normalizeUser = ({
	usersAdditionalInformation,
	...item
}: TUserRequest): TUserRequest => ({
	...item,
	usersAdditionalInformation: isNull(usersAdditionalInformation)
		? ({} as TUserAdditionalInformation)
		: {
				...usersAdditionalInformation,
				dejurArea: usersAdditionalInformation.dejurArea.map(
					({ dejurAreaId }: any) => dejurAreaId
				),
				responsibleArea: usersAdditionalInformation.responsibleArea.map(
					({ responsibleAreaId }: any) => responsibleAreaId
				),
				rawRole: getBitFlagArray(
					userRoleFlag,
					Number(usersAdditionalInformation.role) ?? 0
				),
		  },
});

const normalizeDataResponse = (data: { items: TUserRequest[] }) => ({
	...data,
	items: data.items.map(normalizeUser),
});

const normalizeDataRequest = ({
	dejurArea,
	responsibleArea,
	rawRole,
	...data
}: TUserAdditionalInformation) => {
	return {
		...data,
		dejurArea: dejurArea.map((dejurAreaId) => ({ dejurAreaId })),
		responsibleArea: responsibleArea.map((responsibleAreaId) => ({
			responsibleAreaId,
		})),
		role:
			rawRole && rawRole.length > 0
				? rawRole.map((x) => Number(x)).reduce((prev, curr) => prev + curr)
				: 0,
	} as any;
};

export const fetchUsers = createAsyncThunk(
	"users/fetch",
	async ({field, ...values}: ParamsGet & TUserFilters & {field?: string}, 
				 { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values);
			const response = await api.list(normalizedValues);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount));

			return {values: normalizeDataResponse(response.data).items, field};
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchUsersList = createAsyncThunk(
	"users/fetchList",
	async ({field, ...values}: ParamsGet & TUserFilters & {field?: string}, 
				 { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values);
			const response = await api.listGrid(normalizedValues);

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount));

			return {values: normalizeDataResponse(response.data).items, field};
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getUsers = createAsyncThunk(
	"users/get",
	async (id: number | string, { getState, rejectWithValue }) => {
		try {
			const {
				users: { list },
			} = getState() as RootState;

			// const item = list.find((item) => item.id === Number(id));
			// if (item) return item;

			const response = await api.list({ id });
			return pathOr({}, ["items", 0], normalizeDataResponse(response.data));
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchActivesUsers = createAsyncThunk(
	"users/fetchActives",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getActives();
			return response.data.map(normalizeUser);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addUsers = createAsyncThunk(
	"users/add",
	async (
		{
			isActive,
			idBrf,
			name,
			email,
			profileId,
			isInternal,
			isAdmin,
			...values
		}: TUser,
		{ rejectWithValue }
	) => {
		try {
			const normalizedValues: TUserRequest = {
				isActive,
				idBrf,
				name,
				email,
				profileId,
				isInternal,
				isAdmin,
				usersAdditionalInformation: normalizeDataRequest(values),
			};
			const response = await api.add(normalizedValues);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const switchUsers = createAsyncThunk(
	"users/switch",
	async (
		{
			id,
			isActive,
		}: TUser,
		{ rejectWithValue }
	) => {
		try {
			
			const {data} = await api.list({id: Number(id)});
			if (!data.items) throw "Nao encontrado"
			
			const response = await api.edit({ ...data.items[0], isActive: isActive });
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editUsers = createAsyncThunk(
	"users/edit",
	async (
		{
			id,
			isActive,
			idBrf,
			name,
			email,
			profileId,
			isInternal,
			isAdmin,
			lastAccess,
			...values
		}: TUser,
		{ rejectWithValue }
	) => {
		try {
			const normalizedValues: TUserRequest = {
				isActive,
				idBrf,
				name,
				email,
				profileId,
				isInternal,
				isAdmin,
				lastAccess,
				usersAdditionalInformation: normalizeDataRequest(values),
			};

			const response = await api.edit({ ...normalizedValues, id: Number(id) });
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const generateUsersExcel = createAsyncThunk(
	"users/generate-excel",
	async (filters: TUserFilters, { rejectWithValue }) => {
		try {
			const normalizeFilter = rejectNoValues(filters);
			const response = await api.generateExcel(normalizeFilter);
			return response.data;
		} catch (err: unknown) {
			const axiosError = getAxiosError(err);
			return rejectWithValue(axiosError?.response?.data);
		}
	}
);
