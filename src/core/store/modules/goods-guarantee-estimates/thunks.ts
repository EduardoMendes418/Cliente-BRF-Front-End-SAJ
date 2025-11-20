import { createAsyncThunk } from '@reduxjs/toolkit';

import goodsGuaranteesRequestApi from 'src/core/api/goods-guarantee';
import goodsGuaranteesEstimatesApi from 'src/core/api/goods-guarantee-estimates';
import { TAddBudget, TAddFiles, TEditBudget } from 'src/core/models/goods-guarantee-estimates';
import { RootState } from "../..";


export const addGoodsGuaranteesEstimates = createAsyncThunk(
	'goodsGuaranteesEstimates/addGoodsGuaranteesEstimates',
	async (value: TAddBudget, { rejectWithValue, getState }) => {
		try {
			const {goodsGuaranteesRequest: {emails}} = getState() as RootState

			const budgetsToAdd = value.estimates.map(({ files, id, ...data }) => {
				return { ...data, goodsGuaranteesRequestId: value.goodsGuaranteesRequestId } as any;
			});
	
			let response;

			if(value.statusFlowId === 3 && value.guaranteeModalityId === 2 && value?.observation.length > 0){
				 response = await goodsGuaranteesRequestApi.updateStatusFlow({
					id: value.goodsGuaranteesRequestId,
					statusFlowId: value.statusFlowId,
					observation: value?.observation[0].observation
			}, emails);
			} else {
				response = await goodsGuaranteesRequestApi.updateStatusFlow({
					id: value.goodsGuaranteesRequestId,
					statusFlowId: value.statusFlowId
				}, emails);
			}
		
			await goodsGuaranteesEstimatesApi.add(budgetsToAdd);

			return response?.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editGoodsGuaranteesEstimates = createAsyncThunk(
	'goodsGuaranteesEstimates/editGoodsGuaranteesEstimates',
	async (value: TEditBudget, { rejectWithValue }) => {
		try {
			const { files, ...data } = value.budget;

			await goodsGuaranteesEstimatesApi.edit(data as any);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addGoodsGuaranteesEstimatesFiles = createAsyncThunk(
	'goodsGuaranteesEstimates/addGoodsGuaranteesEstimatesFiles',
	async ({budgetsFiles, id, isSkippable}:{budgetsFiles: TAddFiles[], id: number, isSkippable: boolean}, { rejectWithValue }) => {
		try {
			const response =  await Promise.all(budgetsFiles.map(({ id, isMainFile, files }) =>
				goodsGuaranteesEstimatesApi.uploadFiles(id, isMainFile, files)
			));
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteGoodsGuaranteesEstimatesFile = createAsyncThunk(
	'goodsGuaranteesEstimates/deleteGoodsGuaranteesEstimatesFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await goodsGuaranteesEstimatesApi.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);