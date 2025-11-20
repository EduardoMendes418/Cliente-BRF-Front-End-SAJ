import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/legal-document-swap";
import { LegalDocumentSwapStatusEnum, TLegalDocumentSwapEdit, TLegalDocumentSwapFilter } from "src/core/models/legal-document-swap";
import { rejectNoValues } from "src/core/utils/func";
import { actions } from "../..";

export const fetchLegalDocumentSwap = createAsyncThunk(
	"legalDocSwap/fetch",
	async (filter: TLegalDocumentSwapFilter, { rejectWithValue, dispatch }) => {
		try {
			if (filter.requestStatus?.length === 0) {
				filter.requestStatus = [
					LegalDocumentSwapStatusEnum.InSignature,
					LegalDocumentSwapStatusEnum.InTreatment,
					LegalDocumentSwapStatusEnum.InformationPending,
					LegalDocumentSwapStatusEnum.LegalValidation,
					LegalDocumentSwapStatusEnum.Requested,
					LegalDocumentSwapStatusEnum.ReturnedService
				]
			}
			const normilized = rejectNoValues(filter)
			const response = await api.get(normilized)
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data.items
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const updateLegalDocumentSwap = createAsyncThunk(
	"legalDocSwap/update",
	async (update: TLegalDocumentSwapEdit, { rejectWithValue }) => {
		try {
			if (!update.serviceUserId) {
				return
			}

			if (update.filter?.requestStatus?.length === 0) {
				update.filter.requestStatus = [
					LegalDocumentSwapStatusEnum.InSignature,
					LegalDocumentSwapStatusEnum.InTreatment,
					LegalDocumentSwapStatusEnum.InformationPending,
					LegalDocumentSwapStatusEnum.LegalValidation,
					LegalDocumentSwapStatusEnum.Requested,
					LegalDocumentSwapStatusEnum.ReturnedService
				]
			}
			
			const normilized = rejectNoValues(update.filter ?? {})
			await api.update(update.serviceUserId, normilized)
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)