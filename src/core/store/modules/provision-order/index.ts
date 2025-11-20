import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
	TProvisionProcess,
	TProvisionOrder,
	TOrderRating,
	TOrderRatingForm,
	TpaymentOrders
} from 'src/core/models/provision-order'

import { caseDefaultRegister } from '..'
import {
	checkHasJudicialDepositPending,
	checkHasPaymentPending,
	fetchProvisionsProcess,
	fetchProvisionsProcessByProcessNumber,
	updateProvisionsProcess,
	checkProcessHasBlockAndTransferPending
} from './thunks'
export type TError = { detail: string };

type Status = 'initial' | 'fetching' | 'failure'

export type State = {
	process: TProvisionProcess
	processes: TProvisionProcess[]
	processStatus: Status
	hasDepositPending?: boolean
	hasDepositPendingStatus: Status
	hasPaymentPending?: boolean
	hasPaymentPendingStatus: Status
	hasBlockAndTransferPendingBool?: boolean
	hasBlockAndTransferPendingStatus: Status
	orders: TProvisionOrder[]
	ratings: TOrderRating[]
	orderOnEdition?: TProvisionOrder
	isExpectationBlocked: boolean
	isFormBlocked: boolean
	paymentOrders: TpaymentOrders[]
	error: TError;
}

const initialState: State = {
	process: {} as TProvisionProcess,
	processes: [],
	processStatus: 'initial',
	hasDepositPendingStatus: 'initial',
	hasPaymentPendingStatus: 'initial',
	hasBlockAndTransferPendingStatus: 'initial',
	hasBlockAndTransferPendingBool: false,
	paymentOrders: [],
	orders: [],
	ratings: [],
	isExpectationBlocked: false,
	isFormBlocked: false,
	error: {} as TError,
}

const slice = createSlice({
	name: 'provisionOrder',
	initialState,
	reducers: {
		setPaymentOrders(state, action: PayloadAction<TpaymentOrders>) {
			const indexPayment = state.paymentOrders.findIndex(({ orderRatingId }) => orderRatingId === action.payload.orderRatingId);
			if (indexPayment !== -1) {
				state.paymentOrders[indexPayment] = { ...action.payload }
			} else
				state.paymentOrders = [{ ...action.payload }, ...state.paymentOrders]
		},
		setAllPaymentOrders(state, action: PayloadAction<TpaymentOrders[]>) {
			state.paymentOrders = [...action.payload]
		},
		addOrder(state, action: PayloadAction<TProvisionOrder>) {
			state.orders = [...state.orders, action.payload]
			state.ratings = []
		},
		editOrder(state, action: PayloadAction<TProvisionOrder>) {
			const order = action.payload
			const idProperty = order.transientId ? 'transientId' : 'id'
			state.orders = state.orders.map((o) => o[idProperty] !== order[idProperty] ? o : order)
		},
		deleteOrder(state, action: PayloadAction<TProvisionOrder>) {
			const idProperty = action.payload.transientId ? 'transientId' : 'id'
			state.orders = state.orders.filter((item) => item[idProperty] !== action.payload[idProperty])
		},
		setOrderToEdit(state, action: PayloadAction<TProvisionOrder>) {
			const selectedOrder = { ...action.payload }
			const uneditedOrder = state.process.orders?.find(o => o.orderDescriptionId === selectedOrder.orderDescriptionId)

			let orderToEdit = selectedOrder
			let ratings = selectedOrder.orderRatings || []
			let isExpectationBlocked = false
			let isFormBlocked = false

			if (uneditedOrder?.isActive === false && selectedOrder.isActive) {
				isExpectationBlocked = true
				isFormBlocked = false
			}

			if (uneditedOrder?.isActive === true && !selectedOrder.isActive) {
				isFormBlocked = true
				orderToEdit = { ...uneditedOrder, isActive: false }
				ratings = uneditedOrder.orderRatings || []
			}

			state.orderOnEdition = orderToEdit
			state.ratings = ratings
			state.isExpectationBlocked = isExpectationBlocked
			state.isFormBlocked = orderToEdit.isActive ? isFormBlocked : true
		},
		setOrderToEditPaymentOrders(state, action: PayloadAction<TProvisionOrder>) {
			const selectedOrder = { ...action.payload }
			const uneditedOrder = state.process.orders?.find(o => o.orderDescriptionId === selectedOrder.orderDescriptionId)

			let orderToEdit = selectedOrder
			let ratings = selectedOrder.orderRatings || []
			let isExpectationBlocked = false

			if (uneditedOrder?.isActive === false && selectedOrder.isActive) {
				isExpectationBlocked = true
			}

			if (uneditedOrder?.isActive === true && !selectedOrder.isActive) {
				orderToEdit = { ...uneditedOrder, isActive: false }
				ratings = uneditedOrder.orderRatings || []
			}

			state.orderOnEdition = orderToEdit
			state.ratings = ratings
			state.isExpectationBlocked = isExpectationBlocked
			state.isFormBlocked = selectedOrder.isFormBlocked ?? true
		},
		clearOrderToEdit(state) {
			state.orderOnEdition = undefined
			state.ratings = []
			state.isExpectationBlocked = false
			state.isFormBlocked = false
		},

		addOrderRating(state, action: PayloadAction<TOrderRating[]>) {
			state.ratings = [...state.ratings, ...action.payload]
		},
		editOrderRating(state, action: PayloadAction<TOrderRatingForm>) {
			const { ratings } = state
			const { probableValue, possibleValue, remoteValue, ...restNewRating } = action.payload
			const probabilityValues = [probableValue, possibleValue, remoteValue]

			const editedRatings = ratings.map((oldRating) => {
				if (oldRating.orderRatingDescriptionId === restNewRating.orderRatingDescriptionId) {
					const value = probabilityValues[oldRating.orderRatingProbababilityId - 1]
					return { ...oldRating, ...restNewRating, value } as TOrderRating
				}

				return oldRating
			})


			state.ratings = editedRatings
		},

		deleteOrderRating(state, action: PayloadAction<TOrderRating>) {
			const idProperty = action.payload.transientId ? 'transientId' : 'id'
			state.ratings = state.ratings.filter((item) => item[idProperty] !== action.payload[idProperty])
		},


		clearProvisionProcess(state) {
			state.process = {} as TProvisionProcess
			state.orders = []
			state.ratings = []
			state.orderOnEdition = undefined
			state.paymentOrders = []
		},
	},
	extraReducers: ({ addCase }) => {
		addCase(fetchProvisionsProcess.pending, (state) => {
			state.processStatus = 'fetching'
			state.error = {} as TError
		})
		addCase(fetchProvisionsProcess.fulfilled, (state, action) => {
			state.process = action.payload
			state.orders = action.payload?.orders || []
			state.processStatus = 'initial'
			state.error = {} as TError
		})
		addCase(fetchProvisionsProcess.rejected, (state, action) => {
			state.error = action.payload as TError
			state.process = {} as TProvisionProcess
			state.orders = []
			state.processStatus = 'failure'
		})

		addCase(fetchProvisionsProcessByProcessNumber.pending, (state) => {
			state.processStatus = 'fetching'
		})
		addCase(fetchProvisionsProcessByProcessNumber.fulfilled, (state, action) => {
			state.processes = action.payload
			state.processStatus = 'initial'
		})
		addCase(fetchProvisionsProcessByProcessNumber.rejected, (state, action) => {
			state.processes = []
			state.processStatus = 'failure'
		})

		addCase(checkHasJudicialDepositPending.pending, (state) => {
			state.hasDepositPendingStatus = 'fetching'
		})
		addCase(checkHasJudicialDepositPending.fulfilled, (state, action) => {
			state.hasDepositPending = action.payload as boolean
			state.hasDepositPendingStatus = 'initial'
		})
		addCase(checkHasJudicialDepositPending.rejected, (state, action) => {
			state.hasDepositPending = undefined
			state.hasDepositPendingStatus = 'failure'
		})


		addCase(checkHasPaymentPending.pending, (state) => {
			state.hasPaymentPendingStatus = 'fetching'
		})
		addCase(checkHasPaymentPending.fulfilled, (state, action) => {
			state.hasPaymentPending = action.payload as boolean
			state.hasPaymentPendingStatus = 'initial'
		})
		addCase(checkHasPaymentPending.rejected, (state, action) => {
			state.hasPaymentPending = undefined
			state.hasPaymentPendingStatus = 'failure'
		})

		addCase(checkProcessHasBlockAndTransferPending.pending, (state) => {
			state.hasBlockAndTransferPendingStatus = 'fetching'
		})
		addCase(checkProcessHasBlockAndTransferPending.fulfilled, (state, action) => {
			state.hasBlockAndTransferPendingBool = action.payload as boolean
			state.hasBlockAndTransferPendingStatus = 'initial'
		})
		addCase(checkProcessHasBlockAndTransferPending.rejected, (state, action) => {
			state.hasBlockAndTransferPendingBool = undefined
			state.hasBlockAndTransferPendingStatus = 'failure'
		})

		caseDefaultRegister(addCase, updateProvisionsProcess, 'edited')
	},
})

export default slice

export const {
	addOrder,
	editOrder,
	deleteOrder,
	setOrderToEdit,
	setOrderToEditPaymentOrders,
	clearOrderToEdit,
	addOrderRating,
	editOrderRating,
	deleteOrderRating,
	clearProvisionProcess,
	setPaymentOrders,
	setAllPaymentOrders
} = slice.actions