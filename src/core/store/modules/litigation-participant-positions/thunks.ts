import {createAsyncThunk} from "@reduxjs/toolkit";
import {TLitigationParticipantSituationEnum} from "../../../models/litigation-participant-positions";
import api from "../../../api/litigation-participant-positions";
import {getAxiosError} from "../../../utils/func";

export const fetchLitigationParticipantPositions = createAsyncThunk(
	"litigationParticipantPositions/list", 
	async (situation: TLitigationParticipantSituationEnum, {rejectWithValue}) => {
		try {
			const response = await api.get(situation);
			return {items: response.data};
		} catch (e: any) {
			return rejectWithValue(getAxiosError(e)?.response?.data)
		}
})