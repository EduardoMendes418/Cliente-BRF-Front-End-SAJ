import api from "src/core/api/lock-system";
import { LockSystem } from "src/core/models/lock-system";
import { getAxiosError } from "src/core/utils/func";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchByIdLockSystem = createAsyncThunk(
	"lockSystem/fetchById",
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.getById(id);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
);

export const fetchLockSystem = createAsyncThunk(
	"lockSystem/fetch",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.list();
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
);

export const editLockSystem = createAsyncThunk(
	"lockSystem/edit",
	async (lockSystem: LockSystem, { rejectWithValue }) => {
		try {
			const response = await api.update(lockSystem);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
);

export const addLockSystem = createAsyncThunk(
	"lockSystem/add",
	async (lockSystem: LockSystem, { rejectWithValue }) => {
		try {
			const response = await api.create(lockSystem);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
)

export const checkLockSystem = createAsyncThunk(
	"lockSystem/check",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.validate();
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
)