import { createAsyncThunk } from '@reduxjs/toolkit';
import { omit, pathOr } from 'ramda';

import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { TPayment, renameProps, TPaymentRequestFilters, renameFilterProps, TPaymentGenerateReversalRecords, TGeneratedGuide } from 'src/core/models/payment';
import api from 'src/core/api/payment';
import apiPension from 'src/core/api/pension-request';
import { deepCopy, modifyProperty, renameKeys, toNumber } from 'src/core/utils/func';
import { TGetRatValues, TUpdateBankAndJudicial, TUpdateStatus } from 'src/core/models';
import {
	TPaymentType,
} from "src/core/models/payment-type";
import { TProvisionOrder, TpaymentOrders } from 'src/core/models/provision-order'
import { actions, RootState } from '../..';

export const fetchSolicitacao = createAsyncThunk(
	'paymentRequest/fetchSolicitacao',
	async (params: TPaymentRequestFilters, { dispatch }) => {
		const filters = renameKeys(renameFilterProps, true)(params);
		const response = await api.list(filters);
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return renameKeys(renameProps)(response.data)
	}
);

export const fetchSolicitacaoGrid = createAsyncThunk(
	'paymentRequest/fetchSolicitacaoGrid',
	async (params: TPaymentRequestFilters, { dispatch }) => {
		const response = await api.listGrid(params);
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return response.data
	}
);

export const fetchPensionPayment = createAsyncThunk(
	'paymentRequest/fetchPensionPayment',
	async (params: TPaymentRequestFilters, { dispatch }) => {
		const response = await apiPension.getPaymentByPensionId(params);
		response.data.pageCount && dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return { items: response.data }
	}
);

export const getPayment = createAsyncThunk(
	'paymentRequest/get',
	async (id: number, { getState }) => {
		const { paymentRequest: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return renameKeys(renameProps)(pathOr({}, ['data', 'items', 0], response))
	}
);

export const addPaymentRequest = createAsyncThunk(
	'paymentRequest/add',
	async (values: TPayment, { rejectWithValue, getState }) => {
	
		try {
			const { provisionOrder: { paymentOrders, orders } } = getState() as RootState
			const { paymentType: { list } } = getState() as RootState
			const normalizedValues = deepCopy(values)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const finalPaymentOrders = doPaymentOrders(list, normalizedValues, orders, paymentOrders);

			const response = await api.add({
				...normalizedValues,
				dataPagamento: new Date(normalizedValues.dataPagamento || ''),
				statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED,
				paymentOrders: finalPaymentOrders.flat(1).filter((item: any) => item?.value !== 0)
			});
			const pagamentoId = response.data.id;
			if (pagamentoId && values.filesEsocial && Object.keys(values.filesEsocial).length > 0 && values.filesEsocial.hasOwnProperty('undefined') === false) {
				await api.uploadFilesbase64(Number(pagamentoId), values.filesEsocial, false, true);
			}

			const eSocialRestriction = response?.data?.formaPagamento?.formaPagamentoTipoPagamentos[0]?.tipoPagamento?.eSocialRestriction
			
			const paymentId = JSON.parse(response?.request?.response)
	
			if(eSocialRestriction === true){
				await api.updateStatus(paymentId?.id, 1);
			}

			if (pagamentoId && values.files.length > 0) {
				try {
					const responseFile = await api.uploadFiles(pagamentoId, values.files);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
			if (pagamentoId && values.filesGuide.length > 0) {
				try {
					const responseFile = await api.uploadFiles(pagamentoId, values.filesGuide, false, false, true, false);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
			if (pagamentoId && values?.eSocialCalcFile?.length > 0) {
				try {
					const responseFile = await api.uploadFiles(pagamentoId, values.eSocialCalcFile, false, false, false, true);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			console.error(err)
			return rejectWithValue(err.response.data);
		}
	}
);

export const addPaymentRequestTaxDefault = createAsyncThunk(
	'paymentRequest/add',
	async (values: TPayment, { rejectWithValue, getState }) => {
	
		try {
			
			const { provisionOrder: { paymentOrders, orders } } = getState() as RootState
			const { paymentType: { list } } = getState() as RootState
			const normalizedValues = deepCopy(values)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const finalPaymentOrders = doPaymentOrders(list, normalizedValues, orders, paymentOrders);

			const response = await api.add({
				...normalizedValues,
				dataPagamento: new Date(normalizedValues.dataPagamento || ''),
				statusFlowId: STATUS_APPROVALS_FLOW.APPROVED,
				paymentOrders: finalPaymentOrders.flat(1).filter((item: any) => item?.value !== 0)
			});
			const pagamentoId = await response.data.id;
		
	
			if (pagamentoId && values.files.length > 0) {
	
				try {
					await api.uploadFiles(pagamentoId, values.files);

				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
				if (pagamentoId && values?.filesGuide.length > 0) {

					try {
						const responseFile = await api.uploadFiles(pagamentoId, values.filesGuide, false, false, true, false);
							return responseFile.data;
					} catch (err: any) {
						return rejectWithValue(err.response.data);
				}
			}
			
		} catch (err: any) {
			console.error(err)
			return rejectWithValue(err.response.data);
		}
	}
);


export const addPaymentRequestTax = createAsyncThunk(
	'paymentRequest/add',
	async (values: TPayment, { rejectWithValue, getState }, mudaStatus?: any) => {
	
		try {
			const { provisionOrder: { paymentOrders, orders } } = getState() as RootState
			const { paymentType: { list } } = getState() as RootState
			const normalizedValues = deepCopy(values)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const finalPaymentOrders = doPaymentOrders(list, normalizedValues, orders, paymentOrders);

			const response = await api.add({
				...normalizedValues,
				dataPagamento: new Date(normalizedValues.dataPagamento || ''),
				statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED,
				paymentOrders: finalPaymentOrders.flat(1).filter((item: any) => item?.value !== 0)
			});
			const pagamentoId = response.data.id;
			if (pagamentoId && values.filesEsocial && Object.keys(values.filesEsocial).length > 0) {
				await api.uploadFilesbase64(Number(pagamentoId), values.filesEsocial, false, true);
			}
			const eSocialRestriction = response?.data?.formaPagamento?.formaPagamentoTipoPagamentos[0]?.tipoPagamento?.eSocialRestriction
			
			const paymentId = JSON.parse(response?.request?.response)
	
			if(eSocialRestriction === true){
	
				await api.updateStatus(paymentId?.id, 1);
			}
			
			if (pagamentoId && values.files.length > 0) {
				try {
					const responseFile = await api.uploadFiles(pagamentoId, values.files);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			console.error(err)
			return rejectWithValue(err.response.data);
		}
	}
);

export const editPaymentRequest = createAsyncThunk(
	'paymentRequest/edit',
	async (values: TPayment, { rejectWithValue, getState }) => {
		try {
			let normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values),
				statusApprovalId: STATUS_APPROVALS_FLOW.NONE,
				statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED,
			} as TPayment
			normalizedValues = deepCopy(normalizedValues)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const { provisionOrder: { paymentOrders } } = getState() as RootState
			// const { paymentType: { list } } = getState() as RootState

			// let finalPaymentOrders = doPaymentOrders(list, values, orders, paymentOrders);

			if (values.files.length > 0) {
				await api.uploadFiles(Number(values.id), values.files, false, false)
			} 

			if(values.filesEsocial && values.filesEsocial.hasOwnProperty('undefined') === false){
				await api.uploadFilesbase64(Number(values.id), values.filesEsocial, false, true);
			}

			const calls = [
				api.edit({ ...normalizedValues, paymentOrders }),
				api.updateStatus(Number(normalizedValues.id), STATUS_APPROVALS_FLOW.REQUESTED),
			]

			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editPaymentRequestTax = createAsyncThunk(
	'paymentRequest/edit',
	async (values: TPayment, { rejectWithValue, getState }) => {
		try {
			let normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values),
				statusApprovalId: STATUS_APPROVALS_FLOW.NONE,
				statusFlowId: STATUS_APPROVALS_FLOW.APPROVED,
			} as TPayment
			normalizedValues = deepCopy(normalizedValues)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const { provisionOrder: { paymentOrders } } = getState() as RootState
			// const { paymentType: { list } } = getState() as RootState

			// let finalPaymentOrders = doPaymentOrders(list, values, orders, paymentOrders);

			if (values.files.length > 0) {
				await api.uploadFiles(Number(values.id), values.files, false, false)
			} 

			if(values.filesEsocial && values.filesEsocial.hasOwnProperty('undefined') === false){
				await api.uploadFilesbase64(Number(values.id), values.filesEsocial, false, true);
			}

			const calls = [
				api.edit({ ...normalizedValues, paymentOrders }),
				api.updateStatus(Number(normalizedValues.id), STATUS_APPROVALS_FLOW.APPROVED),
			]

			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editGeneratedGuide = createAsyncThunk(
	'paymentRequest/generatedGuide',
	async (values: TGeneratedGuide , { rejectWithValue }) => {
		try {
			const response = await api.generatedGuide(values);
			return response;
		}
	catch (err: any) {
		return rejectWithValue(err.response.data);
	}
}
);

export const editPaymentRequestSimple = createAsyncThunk(
	'paymentRequest/editSimple',
	async (values: TPayment & TUpdateStatus, { rejectWithValue, getState }) => {
		try {

			const normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values),
			} as TPayment

			const { provisionOrder: { paymentOrders } } = getState() as RootState
			// const { paymentType: { list } } = getState() as RootState

			// let finalPaymentOrders = doPaymentOrders(list, values, orders, paymentOrders);

			// if (values.files) {
			// 	await api.uploadFiles(Number(values.id), values.files)
			// }
			const calls = [
				api.updateStatus(Number(normalizedValues.id), normalizedValues.statusFlowId, values.observation),
				api.edit({ ...normalizedValues, paymentOrders }),
				/* api.updateStatus(Number(normalizedValues.id), normalizedValues.statusFlowId, values.observation) */
			]

			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editPaymentRequestWithoutStatusUpdate = createAsyncThunk(
	'paymentRequest/edit',
	async (values: TPayment, { rejectWithValue, getState }) => {
		try {

			let normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values),
				statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
			
			} as TPayment
			normalizedValues = deepCopy(normalizedValues)
			modifyProperty(normalizedValues, [
				"valorPagamentoJudicial",
				"valorPrincipal",
				"encargo",
				"sucumbencia",
				"valorJurosHistorico",
				"valorMulta",
				"valorPrincipal",
				"compensationAmount",
				"remunerationAmount"
			], toNumber);

			const { provisionOrder: { paymentOrders } } = getState() as RootState

			if (values.files) {
				await api.uploadFiles(Number(values.id), values.files, false, false)
			} 

			if(values.filesEsocial && values?.filesEsocial?.hasOwnProperty('undefined') === false){
				await api.uploadFilesbase64(Number(values.id), values.filesEsocial, false, true);
			}

			const calls = [
				api.edit({ ...normalizedValues, paymentOrders }),
			]

			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const rawEditPaymentRequest = createAsyncThunk(
	"paymentRequest/rawEdit",
	async (values: TPayment, { rejectWithValue, getState }) => {
		try {

			const normalizedValues = {
				...omit([
					'logs',
					'possibleApprovers',
					'approvalDateOfLegalControl',
					'approvalDateOfInternalLawyer',
					'approverOfLegalControl',
					'approverOfInternalLawyer',
					'observationOfLegalControl',
					'observationOfInternalLawyer',
					'files',
				], values)
			} as TPayment
			const { provisionOrder: { paymentOrders } } = getState() as RootState

			if (values.files) {
				await api.uploadFiles(Number(values.id), values.files)
			}

			const calls = [
				api.edit({ ...normalizedValues, paymentOrders }),
				api.updateStatus(Number(normalizedValues.id), normalizedValues.statusFlowId),
			]


			const response = await Promise.all(calls)

			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deletePaymentRequestFile = createAsyncThunk(
	'paymentRequest/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateStatusPaymentRequest = createAsyncThunk(
	   'paymentRequest/updateStatus',
	   async (
			   { id, statusFlowId, observation, rejectionAndReturnReasonsId }: TUpdateStatus,
			   { rejectWithValue }
	   ) => {
			   try {
					   let response;
					   rejectionAndReturnReasonsId === 0 || rejectionAndReturnReasonsId === undefined ? response = await api.updateStatus(id, statusFlowId, observation) :
					   response = await api.updateStatus(id, statusFlowId, observation, Number(rejectionAndReturnReasonsId));
					  
					   return response.data;
			   } catch (err: any) {
					   return rejectWithValue(err.response.data);
			   }
	   }
);

export const getPaymentAccounting = createAsyncThunk(
	'paymentRequest/getAccounting',
	async (id: number) => {
		const response = await api.getAccounting(id);

		return response?.data?.items;
	}
);

export const updateBankAndJudicial = createAsyncThunk(
	"paymentRequest/updateBankAndJudicial",
	async (data: TUpdateBankAndJudicial, { rejectWithValue }) => {
		try {
			if (data.files) {
				await api.uploadFiles(data.id, data.files, true)
			}

			if (data.bankId){
				const response = await api.updateBankAndJudicial(data)
					return response.data
}

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getRatValues = createAsyncThunk(
	"paymentRequest/getRatValues",
	async (data: TGetRatValues, { rejectWithValue }) => {
		try {
			const response = await api.getRatValues(data.processId, data.paymentDate)
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const getPaymentBanks = createAsyncThunk(
	"paymentRequest/getPaymentBanks",
	async (cpfCnpj: string, { rejectWithValue }) => {
		try {
			const response = await api.getBanks(cpfCnpj)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);


export const getPaymentsToEsocialLink = createAsyncThunk(
	"paymentRequest/getPaymentsToEsocialLink",
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const { data } = await api.getPaymentToEsocialLink(folderNumber)
			return data
		} catch (err: any) {
			return rejectWithValue(err.data)
		}
	}
);

const getValueByorderRatingProbababilityId = (values: TPayment, OrderRatingDescriptions: number): number => {
	switch (OrderRatingDescriptions) {
		case 1:
			return Number(values.valorPrincipal) + Number(values.valorOutrasEntidades)
		case 2:
			return Number(values.valorMulta)
		case 3:
			return Number(values.valorJuros) + Number(values.valorJurosHistorico)
		case 4:
			return Number(values.encargo)
		case 5:
			return Number(values.sucumbencia)
		default:
			return 0;
	}
};

function doPaymentOrders(list: TPaymentType[], values: TPayment, orders: TProvisionOrder[], paymentOrders: TpaymentOrders[]) {
	const payType = list.find((item) => values.tipoPagamentoId === item.id);

	let finalPaymentOrders: any[] = [];
	const filteredOrders = orders.filter(({ isActive, orderRatings, orderExpectationId, orderDescription }) => {
		if (!isActive) return false;
		if (orderExpectationId !== 1) return false;
		if (!orderDescription?.sumProvision) return false
		return orderRatings.some(({ orderRatingProbababilityId, value }) => orderRatingProbababilityId === 1 && value !== 0)
	});
	if (payType?.abaterSaldoProvisao === 1) {

		if (filteredOrders.length === 1) {
			const [{ orderRatings }] = filteredOrders;
			const filteredOrderRatings = orderRatings.filter((item) => item.orderRatingProbabability.account && item.orderRatingProbabability.id === 1 && item.value);

			finalPaymentOrders = filteredOrderRatings.map((item) => {
				const valueByorderRatingProbababilityId = getValueByorderRatingProbababilityId(values, Number(item.orderRatingDescriptionId)) as number
				const valueItem = item.value as number
				return ({
					id: 0,
					paymentId: 0,
					orderRatingId: item.id,
					value: Math.min(valueByorderRatingProbababilityId, valueItem)
				})
			}
			);
		} else {
			finalPaymentOrders = paymentOrders;
		}
	}

	if (payType && payType.abaterSaldoProvisao === 2) {
		if (filteredOrders.length !== 0) {
			filteredOrders.map((finalOrders) => {
				const { orderRatings } = finalOrders;
				const filtredOrderRatings = orderRatings.filter((item) => item.orderRatingProbabability.account);

				const tmpOrderRatings = filtredOrderRatings.map((item) => ({
					id: 0,
					paymentId: 0,
					orderRatingId: item.id,
					value: item.value
				}));
				finalPaymentOrders.push(tmpOrderRatings);
				return null;
			});
		} else finalPaymentOrders = paymentOrders;
	}
	return finalPaymentOrders;
};

export const addGuaranteeCreditReceipReverse = createAsyncThunk(
	'paymentRequest/Reverse',
	async ({...values }: TPaymentGenerateReversalRecords, { rejectWithValue, getState }) => {
		try {
			const response = await api.sendGenerateReversalRecords({...values }) 
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const costCenterReclassification = createAsyncThunk(
	"paymentRequest/costCenterReclassification",
	async (paymentId: number, { rejectWithValue }) => {
		try {
			const response = await api.costCenterReclassification(paymentId)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);