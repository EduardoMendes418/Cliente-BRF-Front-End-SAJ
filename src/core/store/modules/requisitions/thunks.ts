import { pathEq, pathOr } from "ramda";
import { createAsyncThunk } from "@reduxjs/toolkit";

import requisitionsAPI from "src/core/api/requisitions";
import {
	TRequisitionForm,
	TRequisitionService,
	TRequisitionsFilters,
} from "src/core/models/requisitions";
import { ATTACHMENT_TYPE, STATUS } from "src/screen/requisitions/constants";
import { actions, RootState } from "../..";
import { handleJSONError } from "src/core/utils/func";
import { AxiosResponse } from "axios";

export const fetchRequisitions = createAsyncThunk(
	"requisitions/fetchList",
	async (params: TRequisitionsFilters, { dispatch }) => {
		const response = await requisitionsAPI.list(params);

		dispatch(actions.pagination.setPageCount(response.data.pageCount));
		dispatch(actions.pagination.setItemCount(response.data.itemCount));

		return response.data;
	}
);

export const getRequisitions = createAsyncThunk(
	"requisitions/get",
	async (
		{
			id,
			responsibleUserId,
			serviceRequisition
		}: { id: number | string; responsibleUserId?: number, serviceRequisition?: boolean },
		{ getState }
	) => {
		const {
			requisitions: { list },
		} = getState() as RootState;

		const item = list.find((item) =>
			responsibleUserId !== undefined
				? item.id === Number(id) &&
				  pathEq(["requestParameter", "user", "id"], responsibleUserId, item)
				: item.id === Number(id)
		);

		if (item) return item;

		const response = await requisitionsAPI.list({
			id: Number(id),
			responsibleUserId,
			serviceRequisition
		});
		return pathOr({}, ["data", "items", 0], response);
	}
);

export const getDeadlineDateRequisitions = createAsyncThunk(
	"deadlineDate/get",
	async ({
		dateTime,
		requestParameterId,
	}: {
		dateTime: string;
		requestParameterId: number;
	}) => {
		const response = await requisitionsAPI.getDeadlineDate({
			dateTime,
			requestParameterId,
		});
		return response.data;
	}
);

export const getResponsibleEmails = createAsyncThunk(
	"responsibleEmails/get",
	async ({
		processId,
		requestParameterId,
	}: {
		processId: number;
		requestParameterId: number;
	}) => {
		const response = await requisitionsAPI.getResponsibleEmails({
			processId,
			requestParameterId,
		});
		return response.data;
	}
);

export const addRequisitionsBatch = createAsyncThunk(
	"Request/batch",

	async ({ files, type, ...values }: TRequisitionForm, { rejectWithValue }) => {
		try {
			const response = await requisitionsAPI.addBatch({...values, files: files});
			const requisitionsId = response.data.id;

			if (requisitionsId && files && files.length > 0) {
				try {
					await requisitionsAPI.uploadFiles(requisitionsId, files, type);
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}

			if (requisitionsId) await requisitionsAPI.sendEmail(requisitionsId);

			return rejectWithValue({status: response.status, data: response.data});
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const addRequisitions = createAsyncThunk(
	"requisitions/add",
	async ({ files, type, ...values }: TRequisitionForm, { rejectWithValue }) => {
		try {
			const response = await requisitionsAPI.add(values);
			const requisitionsId = response.data.id;

			if (requisitionsId && files && files.length > 0) {
				try {
					await requisitionsAPI.uploadFiles(requisitionsId, files, type);
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}

			if (requisitionsId) await requisitionsAPI.sendEmail(requisitionsId);

			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const editRequisitions = createAsyncThunk(
	"requisitions/edit",
	async (
		{ id, files, type, ...values }: TRequisitionForm | TRequisitionService,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const responses: AxiosResponse<any, any>[] = []
			responses.push(await requisitionsAPI.edit({ ...values, id: Number(id) }))

			if (files && files.length > 0) {
				responses.push(await requisitionsAPI.uploadFiles(Number(id), files, type));
			}

			await requisitionsAPI.updateStatus({
				id: Number(id),
				status: values.status,
				generateLog: false,
			});

			return responses;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const getRequisitionForServiceById = createAsyncThunk(
	"requisitions/requisitionForServiceById",
	async (
		{
			id,
			responsibleUserId,
			serviceRequisition,
		}: {
			id: number | string;
			responsibleUserId?: number;
			serviceRequisition?: boolean;
		},
		{ rejectWithValue, dispatch }
	) => {
		try {
			const params = {
				id: Number(id),
				serviceRequisition
			};

			let response = await requisitionsAPI.list(params);
			const requisition = pathOr(
				{},
				["data", "items", 0],
				response
			) as TRequisitionService;

			if (requisition.status !== STATUS.REQUESTED) return requisition;

			response = await requisitionsAPI.list({ id: Number(id), serviceRequisition });
			return pathOr({}, ["data", "items", 0], response);
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const rollbackRequisitionStatusIfNeeded = createAsyncThunk(
	"requisitions/answerRequisition",
	async (id: number, { rejectWithValue, getState, dispatch }) => {
		try {
			const response = await requisitionsAPI.updateStatus({
				id,
				status: STATUS.REQUESTED,
				generateLog: false,
			});

			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const cancelRequisition = createAsyncThunk(
	"requisitions/cancel",
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await requisitionsAPI.updateStatus({
				id,
				status: STATUS.CANCELLED,
			});
			return response.data;
		} catch (err: any) {
			return rejectWithValue(handleJSONError(err));
		}
	}
);

export const deleteFilesRequisition = createAsyncThunk(
	'requisitions/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await requisitionsAPI.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
