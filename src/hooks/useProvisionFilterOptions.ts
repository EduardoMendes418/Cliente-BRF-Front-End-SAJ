import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getListAsOptionsOrderDescription } from "src/core/store/modules/order-description/selectors"
import { getListAsOptionsOrderExpectation } from "src/core/store/modules/order-expectation/selectors"
import { getListAsOptionsOrderProbability } from "src/core/store/modules/order-probability/selectors"
import { getListAsOptionsOrderRatingDescription } from "src/core/store/modules/order-rating-description/selectors"
import { getListAsOptionsOrderStatus } from "src/core/store/modules/order-status/selectors"
import { fetchOrderDescriptions } from "src/core/store/modules/order-description/thunks"
import { fetchOrderExpectations } from "src/core/store/modules/order-expectation/thunks"
import { fetchOrderProbabilities } from "src/core/store/modules/order-probability/thunks"
import { fetchOrderRatingDescriptions } from "src/core/store/modules/order-rating-description/thunks"
import { fetchOrderStatuses } from "src/core/store/modules/order-status/thunks"

export function useOrderDescriptionOptions() {
	const dispatch = useDispatch()
	const didMount = useRef(false)

	const orderDescriptionOptions = useSelector(getListAsOptionsOrderDescription)

	useEffect(() => {
		if (didMount.current) return
			didMount.current = true
		dispatch(fetchOrderDescriptions({ notPaginate: true }));
	}, [dispatch])

	return orderDescriptionOptions
}

export function useExpectationOptions(isActive?: boolean) {
	const dispatch = useDispatch()
	const didMount = useRef(false)

	const orderExpectationOptions = useSelector(getListAsOptionsOrderExpectation)

	useEffect(() => {
		if (didMount.current) return
		didMount.current = true

		dispatch(fetchOrderExpectations({ notPaginate: true, isActive }));
	}, [dispatch, isActive])

	return orderExpectationOptions
}

export function useOrderProbabilityOptions(isActive?: boolean) {
	const dispatch = useDispatch()
	const didMount = useRef(false)

	const orderProbabilityOptions = useSelector(getListAsOptionsOrderProbability)

	useEffect(() => {
		if (didMount.current) return
		didMount.current = true

		dispatch(fetchOrderProbabilities({ notPaginate: true, isActive }));
	}, [dispatch, isActive])

	return orderProbabilityOptions
}

export function useOrderRatingDescriptionOptions(isActive?: boolean) {
	const dispatch = useDispatch()
	const didMount = useRef(false)

	const orderRatingDescriptionOptions = useSelector(getListAsOptionsOrderRatingDescription)

	useEffect(() => {
		if (didMount.current) return
		didMount.current = true

		dispatch(fetchOrderRatingDescriptions({ notPaginate: true, isActive }));
	}, [dispatch, isActive])

	return orderRatingDescriptionOptions
}


export default function useProvisionFilterOptions(dejurAreaId?: number, isActive?: boolean) {
	const dispatch = useDispatch()
	const didMount = useRef(false)

	const orderExpectationOptions = useExpectationOptions(isActive)
	const orderProbabilityOptions = useOrderProbabilityOptions(isActive)
	const orderRatingDescriptionOptions = useOrderRatingDescriptionOptions(isActive)

	const orderDescriptionOptions = useSelector(getListAsOptionsOrderDescription)
	const orderStatusOptions = useSelector(getListAsOptionsOrderStatus)

	useEffect(() => {
		if (didMount.current) return
		didMount.current = true

		if (!orderStatusOptions.length) dispatch(fetchOrderStatuses({ notPaginate: true }));
		dispatch(fetchOrderDescriptions({ notPaginate: true, isActive }));
	}, [
		dispatch,
		isActive,
		orderStatusOptions.length
	])

	const filteredOrderDescriptions = useMemo(() =>
		dejurAreaId ? orderDescriptionOptions.filter(od => od.areaId === dejurAreaId) : orderDescriptionOptions
	, [dejurAreaId, orderDescriptionOptions])

	return {
		orderDescriptionOptions: filteredOrderDescriptions,
		orderExpectationOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions,
		orderStatusOptions,
	}

}