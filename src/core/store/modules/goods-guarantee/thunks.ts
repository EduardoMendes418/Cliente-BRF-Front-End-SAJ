import { createAsyncThunk } from "@reduxjs/toolkit";
import { pathOr } from "ramda";

import goodsGuaranteesRequestApi from "src/core/api/goods-guarantee";
import { TUpdateStatus } from "src/core/models";
import {
	TGoodsGuaranteesRequest,
	TGoodsGuaranteesRequestParams,
	renameProps,
	TGuaranteeFlowProperty,
	TGuaranteeFlowLetter,
	TGuaranteesNotificationFilter,
} from "src/core/models/goods-guarantee";
import { renameKeys, convertToBlob, getAxiosError } from "src/core/utils/func";
import { actions, RootState } from "../..";
import apiInterestUpdate from "src/core/api/interest-update"
import { TCreateInterestUpdatesForApprovalParams, TGetExecutedInterestUpdatesParams, TReportInterestUpdatesAccountingParams, TRunInterestDepositParams } from "src/core/models/closures";

const renameKeysBack = renameKeys(renameProps, true);

export const fetchGoodsGuaranteesRequestList = createAsyncThunk(
	"goodsGuaranteesRequest/fetchGoodsGuaranteesRequestList",
	async (
		params: TGoodsGuaranteesRequestParams,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const renamedParams = renameKeysBack({...params});
			const response = await goodsGuaranteesRequestApi.list(renamedParams);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount));
			return renameKeys(renameProps)(response.data);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGoodsGuaranteesRequestListSimplify = createAsyncThunk(
	"goodsGuaranteesRequest/fetchGoodsGuaranteesRequestListSimplify",
	async (
		params: TGoodsGuaranteesRequestParams,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const renamedParams = renameKeysBack({...params});
			if (renamedParams.requestTypeIdGeneral) {
				const [type, id] = renamedParams.requestTypeIdGeneral.split('-');
				renamedParams[type] = Number(id);
				delete renamedParams.requestTypeIdGeneral
			}
			const response = await goodsGuaranteesRequestApi.listSimplify(renamedParams);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount));
			return renameKeys(renameProps)(response.data);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addGoodsGuaranteesRequest = createAsyncThunk(
	"goodsGuaranteesRequest/addGoodsGuaranteesRequest",
	async (value: TGoodsGuaranteesRequest, { rejectWithValue, getState }) => {
		try {
			const { files, ...data } = renameKeysBack(value);
			const {goodsGuaranteesRequest: {emails}} = getState() as RootState

			const response = await goodsGuaranteesRequestApi.add(
				data as TGoodsGuaranteesRequest,
				emails
			);
			const goodsGuaranteesId = response.data.id;

			if (goodsGuaranteesId && files.length > 0) {
				const responseFile = await goodsGuaranteesRequestApi.uploadFiles(
					goodsGuaranteesId,
					files as any
				);
				return responseFile.data;
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editGoodsGuaranteesRequest = createAsyncThunk(
	"goodsGuaranteesRequest/editGoodsGuaranteesRequest",
	async (
		value: (
			| TGoodsGuaranteesRequest
			| TGuaranteeFlowProperty
			| TGuaranteeFlowLetter
		) & { id: number; generateLog?: TUpdateStatus; sendEmail?: boolean },
		{ rejectWithValue, getState }
	) => {
		try {
			const { files, generateLog, attachments, sendEmail, ...data } =
				renameKeysBack(value);

			const {goodsGuaranteesRequest: {emails}} = getState() as RootState

			if (data.id && files.length > 0) {
				  await goodsGuaranteesRequestApi.uploadFiles(
					data.id,
					files as FileList,
					true
				); 
			}

			  if (generateLog) {
				  await goodsGuaranteesRequestApi.updateStatusFlow({
						id: value.id,
						statusFlowId: generateLog.statusFlowId,
					 	observation: generateLog.observation,
				}, emails);

				data.statusFlowId = generateLog.statusFlowId; 
			} 

			const response: any[] = [];

	     delete data.payment;
			response.push(
				await goodsGuaranteesRequestApi.edit(data as TGoodsGuaranteesRequest, emails)
			);

			return response; 
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const editGoodsGuaranteesRequestWithouUpdateStatus = createAsyncThunk(
	"goodsGuaranteesRequest/editGoodsGuaranteesRequestWithoutUpdateStatus",
	async (
		value: (
			| TGoodsGuaranteesRequest
			| TGuaranteeFlowProperty
			| TGuaranteeFlowLetter
		) & { id: number; generateLog?: TUpdateStatus; sendEmail?: boolean },
		{ rejectWithValue, getState }
	) => {
		try {
			const { files, generateLog, attachments, sendEmail, ...data } =
				renameKeysBack(value);

			const {goodsGuaranteesRequest: {emails}} = getState() as RootState

			if (data.id && files.length > 0) {
				  await goodsGuaranteesRequestApi.uploadFiles(
					data.id,
					files as FileList,
					true
				); 
			}

			const response: any[] = [];

	     delete data.payment;
			response.push(
				await goodsGuaranteesRequestApi.edit(data as TGoodsGuaranteesRequest, emails)
			);

			return response; 
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});		

export const uploadGoodsGuaranteesFile = createAsyncThunk(
	"goodsGuaranteesRequest/uploadGoodsGuaranteesFile",
	async (
		{
			goodsAndGuaranteesId,
			files,
			isMainFile
		}: { goodsAndGuaranteesId: number; files: FileList, isMainFile?: boolean },
		{ rejectWithValue }
	) => {
		try {
			goodsGuaranteesRequestApi.uploadFiles(goodsAndGuaranteesId, files, isMainFile ?? false);
		} catch (err: any) {
			return rejectWithValue(err.response.data?.detail);
		}});

export const fetchGoodsGuaranteesRequestById = createAsyncThunk(
	"goodsGuaranteesRequest/fetchGoodsGuaranteesRequestById",
	async (id: number, { rejectWithValue, getState }) => {
		try {
			const response = await goodsGuaranteesRequestApi.getById(id);
			return renameKeys(renameProps)(
				pathOr({}, ["data", "items", 0], response)
			);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const deleteGoodsGuaranteesRequestFile = createAsyncThunk(
	"goodsGuaranteesRequest/deleteGoodsGuaranteesRequestFile",
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await goodsGuaranteesRequestApi.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const updateGoodsGuaranteesStatusFlow = createAsyncThunk(
	"goodsGuaranteesRequest/updateGoodsGuaranteesStatusFlow",
	async (values: TUpdateStatus, { rejectWithValue, getState }) => {
		try {
			const {goodsGuaranteesRequest: {emails}} = getState() as RootState

			const { id, attachments } = values;

			if (attachments && attachments.length > 0) {
				await goodsGuaranteesRequestApi.uploadFiles(
					Number(id),
					attachments,
					false
				);
			}
			const response = await goodsGuaranteesRequestApi.updateStatusFlow(values, emails);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

		export const updateGoodsGuaranteesStatusFlowWhenEqualsTwo = createAsyncThunk(
            "goodsGuaranteesRequest/updateGoodsGuaranteesStatusFlow",
            async (values: TUpdateStatus, { rejectWithValue }) => {
                try {
                
                    const { id, attachments, flowEmails } = values;
        
                    if (attachments && attachments.length > 0) {
                        await goodsGuaranteesRequestApi.uploadFiles(
                            Number(id),
                            attachments,
                            false
                        );
                    }
                    const response = await goodsGuaranteesRequestApi.updateStatusFlow(values, flowEmails);
                    return response.data;
                } catch (err: any) {
                    return rejectWithValue(err.response.data);
                }});		

export const saveAndSendEmail = createAsyncThunk(
	"goodsGuaranteesRequest/saveAndSendEmail",
	async (
		{
			emails,
			statusFlowId,
		}: { id: number; emails: string; statusFlowId: number },
		{ rejectWithValue, getState }
	) => {
		try {
			const {
				goodsGuaranteesRequest: { item, emails: flowEmails },

			} = getState() as RootState;
			const payload = renameKeysBack(item);

			const response = await goodsGuaranteesRequestApi.edit({
				...payload,
				statusFlowId,
				emails,
			} as TGoodsGuaranteesRequest, flowEmails);

			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const getReportInterestUpdatesAccounting = createAsyncThunk(
	"goodsGuaranteesRequest/getReportInterestUpdatesAccounting",
	async (
		{ referenceMonth, referenceYear, accoutingTypes, judicialAreaIds, id, closureId }: TReportInterestUpdatesAccountingParams,
		{ rejectWithValue }
	) => {
		try {
			const response =
				await apiInterestUpdate.getReportInterestUpdatesAccounting({
					referenceMonth,
					referenceYear,
					accoutingTypes,
					judicialAreaIds,
					id,
					closureId
				});
			return { report: convertToBlob(response.data) };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const getExecutedInterestUpdates = createAsyncThunk(
	"goodsGuaranteesRequest/getExecutedInterestUpdates",
	async (
		{ juridicalAreaIds, competenceDate, accountingTypeId, statusApprovals, closureId }: TGetExecutedInterestUpdatesParams,
		{ rejectWithValue }
	) => {
		try {
			const response =
				await apiInterestUpdate.getExecutedInterestUpdates({
					closureId,
					juridicalAreaIds,
					competenceDate,
					accountingTypeId,
					statusApprovals
				});
			return  response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const getExecutedInterestUpdatesWhenPageLoad = createAsyncThunk(
			"goodsGuaranteesRequest/getExecutedInterestUpdates",
			async (
			) => {
				try {
					const response = await apiInterestUpdate.getExecutedInterestUpdatesWhenpageLoad();
					return  response.data;
				} catch (err: any) {
					return err.response.data;
				}});

export const getRunInterestDeposit = createAsyncThunk(
	"goodsGuaranteesRequest/getRunInterestDeposit",
	async (
		{ date, areaDejur, closureId}: TRunInterestDepositParams,
		{ rejectWithValue }
	) => {
		try {
			const response =
				await apiInterestUpdate.runInterestDeposit({
					date,
					areaDejur,
					closureId
				});
			return  response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

 export const createInterestUpdateForApproval = createAsyncThunk(
	"goodsGuaranteesRequest/getReportInterestUpdatesAccounting",
	async (
		{ id, referenceDate, juridicalAreaId }: TCreateInterestUpdatesForApprovalParams,
		{ rejectWithValue }
	) => {
		try {
			const response =
				await apiInterestUpdate.createInterestUpdateForApproval({
					id, referenceDate, juridicalAreaId
				});
			return  response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}});

export const fetchNotificationList = createAsyncThunk(
	"goodsGuaranteesRequests/fetchNotificationList",
	async (
		{notPaginate, ...params}: TGuaranteesNotificationFilter,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await goodsGuaranteesRequestApi.getNotifications({...params, notPaginate});
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

type SetAwareParams = {
	id: number;
	isUserAwared: boolean;
};

export const setAwareNotification = createAsyncThunk(
	"goodsGuaranteesRequests/setAwareNotification",
	async (
		{ id, isUserAwared }: SetAwareParams,
		{ dispatch, getState, rejectWithValue }
	) => {
		try {
			const response = await goodsGuaranteesRequestApi.setAwareNotification(
				id,
				isUserAwared
			);

			const {
				goodsGuaranteesRequest: { notificationFilter },
			} = getState() as RootState;
			dispatch(fetchNotificationList({...notificationFilter!, notPaginate: true}));

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

type SetPostponedParams = {
	id: number;
	isUserPostponed: boolean;
};

export const setPostponedNotification = createAsyncThunk(
	"goodsGuaranteesRequests/setPostponedNotification",
	async (
		{ id, isUserPostponed }: SetPostponedParams,
		{ dispatch, getState, rejectWithValue }
	) => {
		try {
			const response = await goodsGuaranteesRequestApi.setPostponedNotification(
				id,
				isUserPostponed
			);

			const {
				goodsGuaranteesRequest: { notificationFilter },
			} = getState() as RootState;
			dispatch(fetchNotificationList({...notificationFilter, notPaginate: true}!));

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

type SetAnsweredParams = {
	id: number;
	isUserAnswered: boolean;
};

export const setAnsweredNotification = createAsyncThunk(
	"goodsGuaranteesRequests/",
	async (
		{ id, isUserAnswered }: SetAnsweredParams,
		{ dispatch, getState, rejectWithValue }
	) => {
		try {
			const response = await goodsGuaranteesRequestApi.setAnsweredNotification(
				id,
				isUserAnswered
			);

			const {
				goodsGuaranteesRequest: { notificationFilter },
			} = getState() as RootState;
			dispatch(fetchNotificationList({...notificationFilter!, notPaginate: true}));

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGoodGuarantiesCompanies = createAsyncThunk(
	"goodsGuaranteesRequests/companies",
	async (_, { rejectWithValue }) => {
		try {
			const response = await goodsGuaranteesRequestApi.getCompanies()

			return response.data;
		} catch (error) {
			const axiosError = getAxiosError(error)

			if (axiosError) {
				return rejectWithValue(axiosError.response?.data)
			}

			return rejectWithValue("");
		}
	}
);