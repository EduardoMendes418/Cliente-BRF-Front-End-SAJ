import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TInspectionMethod } from "src/core/models/inspection-method";
import { clears } from "..";

export type TError = {
    id?: number;
    error: { detail: string };
};

export type State = {
    list: TInspectionMethod[];
    item: TInspectionMethod;
};

const initialState: TState & State = {
    status: "initial",
    list: [] as TInspectionMethod[],
    item: {} as TInspectionMethod,
    error: {} as TError,
};

const slice = createSlice({
    name: "inspectionMethod",
    initialState,
    reducers: {
        ...clears(initialState),
        setItem: (state, action) => {
            state.item = action.payload;
        },
    },
});

export default slice;
