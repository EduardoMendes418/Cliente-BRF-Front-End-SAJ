import { createAsyncThunk } from "@reduxjs/toolkit";
import { ParamsGet } from "src/core/models";
import api from "src/core/api/inspection-method";
import { actions } from "../..";
import { TInspectionMethod } from "src/core/models/inspection-method";

export const fetchInspectionMethod = createAsyncThunk(
    "inspectionMethod/fetch",
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

export const addInspectionMethod = createAsyncThunk(
    "inspectionMethod/add",
    async (value: TInspectionMethod, { rejectWithValue }) => {
        try {
            const response = await api.add(value);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data });
        }
    }
);
