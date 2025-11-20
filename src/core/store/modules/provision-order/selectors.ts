import { createSelector } from '@reduxjs/toolkit'
import { ChangableOrder } from 'src/core/models/provision-order'
import { RootState } from 'src/core/store'
import { orderChangableProperties } from 'src/screen/provisions/utils/constantes'
import { checkOrderChanged, createNewObjectWithSelectedProperties } from 'src/screen/provisions/utils/func'

import { State } from '.'
import { getLoadingOrderConfronting } from '../order-confronting-parameters/selectors'

const state = (state: RootState) => state.provisionOrder

export const getProvisionsProcess = createSelector(
	[state],
	({ process }: State) => process
)

export const getErrorProcess = createSelector(
	[state],
	({ error }: State) => error
)

export const getProvisionsProcesses = createSelector(
	[state],
	({ processes }: State) => processes
)

export const getPaymentOrders = createSelector(
	[state],
	({ paymentOrders }: State) => paymentOrders
)

export const getProvisionsProcessLoading = createSelector(
	[state],
	({ processStatus }: State) => processStatus === 'fetching'
)

export const getProvisionsProcessRequestScreenLoading = createSelector(
	[state, getLoadingOrderConfronting],
	({ processStatus, hasDepositPendingStatus, hasPaymentPendingStatus, hasBlockAndTransferPendingStatus }: State, isConfrontingOrderLoading) =>
		processStatus === 'fetching' || hasDepositPendingStatus === 'fetching' || hasBlockAndTransferPendingStatus === 'fetching'
		|| hasPaymentPendingStatus=== 'fetching' || isConfrontingOrderLoading
)

export const getProvisionsProcessChecks = createSelector(
	[state],
	({ hasDepositPending, hasPaymentPending, hasBlockAndTransferPendingBool }: State) => ({ hasDepositPending, hasPaymentPending, hasBlockAndTransferPendingBool })
)

export const getOrders = createSelector(
	[state],
	({ orders }: State) => orders
)
export const getOrdersFiltred = createSelector(
	[state],
	({ orders }: State) => orders.filter(({ isActive, orderRatings, orderExpectationId, orderDescription }) => {
		if (!isActive) return false;
		if (orderExpectationId !== 1) return false;
		if (!orderDescription?.sumProvision) return false
		const orderRatingProbabability = orderRatings
			.filter(
				({ orderRatingProbababilityId, value }) =>
					orderRatingProbababilityId === 1 && value !== 0 && value !== null
			)
			.pop();
		if (orderRatingProbabability?.value === undefined) return false;
		return true;
	})
)

export const getRatings = createSelector(
	[state],
	({ ratings }: State) => ratings
)

export const getIsOrdersChanged = createSelector(
	[getOrders, getProvisionsProcess],
	(formOrders, { orders }) => {
		if (formOrders.length !== orders.length)
			return true
		let index = 0
		while (index < orders.length) {
			const originalOrder = createNewObjectWithSelectedProperties(orders[index], orderChangableProperties) as ChangableOrder
			const derivedOrder = createNewObjectWithSelectedProperties(formOrders[index], orderChangableProperties) as ChangableOrder
			if (checkOrderChanged(originalOrder, derivedOrder))
				return true
			index++
		}
		return false
	}
)

export const getOrderOnEdit = createSelector(
	[state],
	({ orderOnEdition }: State) => orderOnEdition
)

export const getBlockedData = createSelector(
	[state],
	({ isExpectationBlocked, isFormBlocked }: State) => ({ isExpectationBlocked, isFormBlocked })
)
