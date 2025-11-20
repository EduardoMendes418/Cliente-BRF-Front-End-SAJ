import { createAsyncThunk } from "@reduxjs/toolkit";
import { pathOr } from "ramda";
import {
	TProvisionOrder,
	TpaymentOrders
} from 'src/core/models/provision-order'
import {
	TPaymentType,
  } from "src/core/models/payment-type";
import judicialBlocksAndTransfersApi from "src/core/api/judicial-blocks-and-transfers";
import {
	TJudicialBlocksAndTransfers,
	TJudicialBlocksAndTransfersAcconting,
	TJudicialBlocksAndTransfersAccontingFilter,
	TJudicialBlocksAndTransfersParams,
	TUpdateStatus,
} from "src/core/models/judicial-blocks-and-transfers";
import {
	STATUS_FLOW,
} from "src/screen/judicial-blocks-and-transfers/constants";
import { actions, RootState } from "../..";

export const fetchJudicialBlocksAndTransfersList = createAsyncThunk(
	"judicialBlocksAndTransfers/fetchJudicialBlocksAndTransfersList",
	async (
		params: TJudicialBlocksAndTransfersParams,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await judicialBlocksAndTransfersApi.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount))
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchJudicialBlocksAndTransfersById = createAsyncThunk(
	"judicialBlocksAndTransfers/fetchJudicialBlocksAndTransfersById",
	async (id: number, { rejectWithValue, getState }) => {
		try {
			const {
				judicialBlocksAndTransfers: { list },
			} = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;

			const response = await judicialBlocksAndTransfersApi.getById(id);
			return pathOr(
				{},
				["data", "items", 0],
				response
			) as TJudicialBlocksAndTransfers;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

// const getValueByorderRatingProbababilityId = (values: TJudicialBlocksAndTransfers, OrderRatingDescriptions:number): number => {
// 	if(OrderRatingDescriptions === 1) return Number(values.value)

// 	return 0
// }
export const addJudicialBlocksAndTransfers = createAsyncThunk(
	"judicialBlocksAndTransfers/addJudicialBlocksAndTransfers",
	async (value: TJudicialBlocksAndTransfers, { rejectWithValue, getState }) => {
		try {
			const { files, ...data } = value;
			const { provisionOrder: {process} } = getState() as RootState
			const { paymentType: { list } } = getState() as RootState
			const { provisionOrder: { paymentOrders, orders } } = getState() as RootState

			/* const finalPaymentOrders = doPaymantOrders(list, data, orders, paymentOrders, false); */
			
			const response = await judicialBlocksAndTransfersApi.add(
				{...data, processId: process.id/* , judicialBlocksAndTransferOrders: finalPaymentOrders.flat(1) */ } as TJudicialBlocksAndTransfers
			);
			const { id } = response.data;

			if (id && files && files.length > 0) {
				const responseFile = await judicialBlocksAndTransfersApi.uploadFiles(
					id,
					files as any
				);
				return responseFile.data;
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editJudicialBlocksAndTransfers = createAsyncThunk(
	"judicialBlocksAndTransfers/editJudicialBlocksAndTransfers",
	async (
		value: TJudicialBlocksAndTransfers & { generateLog?: TUpdateStatus },
		{ rejectWithValue, getState }
	) => {
		try {
			const { files, generateLog, ...data } = value;
			const { provisionOrder: {process: {id}} } = getState() as RootState
			const { provisionOrder: { paymentOrders, orders } } = getState() as RootState
			const { paymentType: { list } } = getState() as RootState

			/* const finalPaymentOrders = doPaymantOrders(list, data, orders, paymentOrders, true); */
			if (generateLog)
				await judicialBlocksAndTransfersApi.updateStatusFlow(
					Number(value.id),
					generateLog.statusFlowId,
					generateLog.observation,
					generateLog.rejectionAndReturnReasonsId
				);

			const calls = [
				judicialBlocksAndTransfersApi.edit({...data, processId:id/* , judicialBlocksAndTransferOrders: finalPaymentOrders */}),
			];

			if (files)
				calls.push(
					judicialBlocksAndTransfersApi.uploadFiles(Number(value.id), files)
				);

			const response = await Promise.all(calls);

			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteJudicialBlocksAndTransfersFile = createAsyncThunk(
	"judicialBlocksAndTransfers/deleteJudicialBlocksAndTransfersFile",
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await judicialBlocksAndTransfersApi.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateJudicialBlocksAndTransfersStatusFlow = createAsyncThunk(
	"judicialBlocksAndTransfers/updateJudicialBlocksAndTransfersStatusFlow",
	async (values: TUpdateStatus, { rejectWithValue }) => {
		try {
			const { id, statusFlowId, observation } = values;

			const response = await judicialBlocksAndTransfersApi.updateStatusFlow(
				Number(id),
				statusFlowId,
				observation
			);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchJudicialBlocksAndTransfersSapResponse = createAsyncThunk(
	"judicialBlocksAndTransfers/SapResponse",
	async (
		{ id, folderNumber }: TJudicialBlocksAndTransfersAccontingFilter,
		{ rejectWithValue }
	) => {
		try {
			const response =
				await judicialBlocksAndTransfersApi.getAccountingSapResponse(
					id,
					folderNumber
				);

			const data = response.data as {
				items: TJudicialBlocksAndTransfersAcconting[]
			}
			const fitredData = data.items.filter(({documentNumber, messageType}) => documentNumber !== "" && messageType === "S")
			if (fitredData.length === 0) {
				return
			} else {
				return fitredData
			}

		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
);
function doPaymantOrders(list: TPaymentType[], data:TJudicialBlocksAndTransfers, orders:TProvisionOrder [], paymentOrders: TpaymentOrders[], edit: boolean) {
	const payType = list.find((item) => data.occurrenceReason === item.id);

	const finalPaymentOrders = [] as any;
	const filtredOrders = orders.filter(({ isActive, orderRatings }) => {
		if (!isActive) return false;
		const orderRatingProbabability = orderRatings.filter(({ value }) => value !== 0 && value !== null).pop();
		if (orderRatingProbabability?.value === undefined) return false;
		return true;
	});
	if (payType && payType.abaterSaldoProvisao === 1 && data.statusFlowId !== STATUS_FLOW.CANCELLED) {
		
		// if (filtredOrders.length === 1 && !edit) {
		// 	const [{ orderRatings }] = orders;
		// 	const filtredOrderRatings = orderRatings.filter((item) => item.orderRatingProbabability.account && item.orderRatingProbabability.id === 1);

		// 	finalPaymentOrders = filtredOrderRatings.map((item) => ({
		// 		id: 0,
		// 		orderRatingId: item.id,
		// 		value: getValueByorderRatingProbababilityId(data, Number(item.orderRatingDescriptionId))
		// 	}));
		// } else finalPaymentOrders = paymentOrders
		return paymentOrders
	}
	if (payType && payType.abaterSaldoProvisao === 2 && data.statusFlowId !== STATUS_FLOW.CANCELLED) {
		

		if (filtredOrders.length !== 0) {
			filtredOrders.forEach((finalOrders) => {
				const { orderRatings } = finalOrders;
				const filtredOrderRatings = orderRatings.filter((item) => item.orderRatingProbabability.account);

				const tmpOrderRatings = filtredOrderRatings.map((item) => ({
					id: 0,
					paymentId: 0,
					orderRatingId: item.id,
					value: item.value
				}));
				finalPaymentOrders.push(tmpOrderRatings);
			});
		}
		
		return [...finalPaymentOrders, ...paymentOrders.map((item) => ({...item, value: 0, isDeleted: true}))].flat(1)
	}
	return paymentOrders.map((item) => ({...item, value: 0, isDeleted: true}));
}

