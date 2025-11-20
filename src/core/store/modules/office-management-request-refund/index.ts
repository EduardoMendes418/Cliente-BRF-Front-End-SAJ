import { createSlice } from "@reduxjs/toolkit";

import {
	TOfficeManagementRequestRefundParams,
	TOfficeManagementRequestRefund as TOfficeManagementRequestRefundOBJ
} from "src/core/models/office-management-request-refund";
import { TState } from "src/core/models";
import {
	fetchOfficeManagementRequestRefund,
	addfficeManagementRequestRefund,
	getOfficeManagementRequestRefund
} from "./thunks";

import { clears, caseDefault, caseDefaultRegister } from "..";

export type TError = {
  id?: number;
  error: { detail: string };
};

export type TOfficeManagementRequestRefund = {
  list: [];
  listFilters: TOfficeManagementRequestRefundParams;
  preRequestRefund: TOfficeManagementRequestRefundOBJ[];
  preRequestRefundItem: TOfficeManagementRequestRefundOBJ;
  item: any;
  index: number;
};

const initialState: TState & TOfficeManagementRequestRefund = {
  status: "initial",
  list: [],
  error: {} as TError,
  item: {},
  listFilters: {} as TOfficeManagementRequestRefundParams,
  preRequestRefund: [] as TOfficeManagementRequestRefundOBJ[],
  preRequestRefundItem: {} as TOfficeManagementRequestRefundOBJ,
  index: -1
};

const slice = createSlice({
  name: "officeManagementRequestRefund",
  initialState,
  reducers: {
    ...clears(initialState),
    setFilters: (state, { payload }: { payload:TOfficeManagementRequestRefundParams}) => {
      state.listFilters = payload;
    },
    setStatusInitial: (state) => {
      state.status = "initial";
    },
	setAllPreRequestRefund: (state, { payload }: { payload:TOfficeManagementRequestRefundOBJ[]}) => {
		state.preRequestRefund = payload;
	},
	addPreRequestRefund: (state, { payload }: { payload:TOfficeManagementRequestRefundOBJ}) => {
		state.preRequestRefund.push(payload)
	},
	editPreRequestRefund: (state, { payload: {value, index} }: { payload:{ value: TOfficeManagementRequestRefundOBJ, index:number}}) => {
		state.preRequestRefund[index] = {...value}
	},
	removeIndexPreRequestRefund: (state, { payload: {index} }: { payload:{index:number}}) => {
		state.preRequestRefund.splice(index, 1)
	},
	setPreRequestRefundItem: (state, { payload: {value, index} }: { payload:{ value: TOfficeManagementRequestRefundOBJ, index:number}}) => {
		state.preRequestRefundItem = value;
		state.index = index
	},
	setIndex: (state, {payload} : {payload: number}) => {
		state.index = payload
	}

  },
  extraReducers: ({ addCase }) => {
    caseDefault(addCase, fetchOfficeManagementRequestRefund);
    caseDefault(addCase, getOfficeManagementRequestRefund, "item");
    caseDefaultRegister(addCase, addfficeManagementRequestRefund, "added");
  },
});

export default slice;
