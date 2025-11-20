import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { fetchConfrontingOrders, fetchConfrontingOrdersByLogs } from './thunks'
import { TConfrontingOrder, TConfrontingOrdersFilters, TableRow, TConfrontingOrderLog } from 'src/core/models/confronting-orders'
import { checkIsPending } from 'src/screen/confronter/utils/confronter-status-functions'
import { ParamsGet, TState } from 'src/core/models'

import { caseDefault, clears } from '..'

export type TError = { detail: string }

export type State = {
	list: TConfrontingOrder[]
	tableList: TableRow[]
	filters: TConfrontingOrdersFilters & ParamsGet
	error: TError
	logList: TConfrontingOrderLog[],
}

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TConfrontingOrder[],
	tableList: [],
	filters: {} as TConfrontingOrdersFilters & ParamsGet,
	logList: [],
}

const slice = createSlice({
	name: 'confrontingOrders',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, action: PayloadAction<TConfrontingOrdersFilters & ParamsGet>) {
			state.filters = action.payload
		},
		setTableList(state, action: PayloadAction<TableRow[]>) {
			state.tableList = action.payload
		},
		selectRow(state, action: PayloadAction<number>) {
			const id = action.payload
			state.tableList = state.tableList.map((order) => order.id !== id ? order : {
				...order,
				check: !order.check
			})
		},
		selectAll(state, action: PayloadAction<boolean>) {
			state.tableList = state.tableList.map((order) => (checkIsPending(order.statusFlowId) && order.approver)
				? { ...order, check: action.payload } : order)
		},
		startTableLoading(state) {
			state.status = 'fetching'
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchConfrontingOrders)
		caseDefault(addCase, fetchConfrontingOrdersByLogs, { logList: 'items'})
	}
})

export default slice

export const {
	setFilters,
	setTableList,
	selectAll,
	selectRow,
	startTableLoading,
} = slice.actions
