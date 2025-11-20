import { createSlice } from "@reduxjs/toolkit";
import { TState } from "src/core/models";
import { TInspectionType } from "src/core/models/inspection-type";
import { clears } from "..";

export type State = {
    list: TInspectionType[];
    item: TInspectionType;
};

const initialState: TState & State = {
    status: "initial",
    list: [],
    item: {} as TInspectionType,
};

const slice = createSlice({
    name: "inspectionType",
    initialState,
    reducers: {
        ...clears(initialState),
        setItem: (state, action) => {
            state.item = action.payload;
        },
    },
});

export default slice;
