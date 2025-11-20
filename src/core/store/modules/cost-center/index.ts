import { createSlice } from "@reduxjs/toolkit";
import { fetchCostCenter, fetchCostCenterWithLike } from "./thunks";
import { TCostCenter } from "src/core/models/cost-center";
import { TState } from "src/core/models";
import { caseDefault, clears } from "..";

export type State = {
  filter: string;
  multipleList: { [field: string]: TCostCenter[] };
  list: TCostCenter[];
};

const initialState: TState & State = {
  status: "initial",
  filter: "",
  multipleList: {} as { [field: string]: TCostCenter[] },
  list: [],
};

const slice = createSlice({
  name: "costCenter",
  initialState,
  reducers: {
    ...clears(initialState),

    clearList(state, action) {
      if (action.payload)
        state.multipleList[action.payload] = [] as TCostCenter[];
      state.list = [];
    },

    changeFilter(state, action) {
      state.filter = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    caseDefault(addCase, fetchCostCenterWithLike, (state, action) => {
      const { field, items } = action.payload ?? {};
      state.multipleList[field] = items ?? [];
    });
    caseDefault(addCase, fetchCostCenter);
  },
});

export default slice;
