import { createAsyncThunk } from "@reduxjs/toolkit";
import { ParamsGet } from "src/core/models";
import { actions } from "../..";
import api from "src/core/api/inspection-type";
import { TInspectionType } from "src/core/models/inspection-type";

export const fetchInspectionType = createAsyncThunk(
    "inspectionType/fetch",
    async (
        { page, pageSize, notPaginate }: ParamsGet,
        { rejectWithValue, dispatch }
    ) => {
        try {
            const response = await api.list({
                page,
                pageSize,
            });
            !notPaginate &&
                dispatch(
                    actions.pagination.setPageCount(response.data.pageCount)
                );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data });
        }
    }
);

export const addInspectionType = createAsyncThunk(
    "inspectionType/add",
    async (value: TInspectionType, { rejectWithValue }) => {
        try {
            const response = await api.add(value);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data });
        }
    }
);
