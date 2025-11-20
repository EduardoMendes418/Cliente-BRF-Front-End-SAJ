import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { generateGrid, simulateFormulaAndGenerateGrid, simulateFormulaByOrders } from "src/core/store/modules/provision/thunks";
import { getListOrderDescription } from "src/core/store/modules/order-description/selectors";
import { TOrderRating, TProvisionOrder } from "src/core/models/provision-order";
import { GridRow } from 'src/screen/provisions/utils/totalize-grid'
import { AppDispatch } from "src/core/store";
import { t } from "src/locale/i18n";

import { SUCCESS_FEE_DESCRIPTION, TABLE_OPTION } from "../components/TotalOrderRatingTable";
import { ORDER_EXPECTATIONS } from "../utils/constantes";

type Props = {
	orders: TProvisionOrder[]
	folderNumber: string
	tableOption: TABLE_OPTION
	isShowingSimulation: boolean
}

export default function useFetchGridAndSimulation({ orders, folderNumber, isShowingSimulation, tableOption }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()

	const [gridRows, setGridRows] = useState<GridRow[]>([])
	const [simulatedSuccessFeeOrderRatings, setSimulatedSuccessFeeOrderRatings] = useState<TOrderRating[]>([])
	const [isFetching, setIsFetching] = useState(false)

	const ordersDescriptions = useSelector(getListOrderDescription)

	useEffect(() => {
		if (folderNumber && tableOption !== TABLE_OPTION.NONE) {
			const fetch = async () => {
				const promises: Promise<any>[] = []
				const orderExpectationId =
					tableOption === TABLE_OPTION.ALL ? null :
						tableOption === TABLE_OPTION.PERDA ? ORDER_EXPECTATIONS.PERDA : ORDER_EXPECTATIONS.GANHO

				if (isShowingSimulation) {
					const successFeeOrder = orders.filter(item => item.orderDescription.name.trim() === SUCCESS_FEE_DESCRIPTION)
					const summableOrdersIds = ordersDescriptions.filter(od => od.sumProvision).map(od => od.id)
					const summableOrders = orders.filter(
						order => order.isActive && summableOrdersIds.includes(order.orderDescriptionId as number)
					)

					promises.push(dispatch(simulateFormulaAndGenerateGrid({
						orders: summableOrders.length === 0 ? orders : summableOrders,
						orderExpectationId,
						folderNumber,
					})))
					if (successFeeOrder.length)
						promises.push(dispatch(simulateFormulaByOrders(successFeeOrder)))
				} else {
					promises.push(dispatch(generateGrid({ folderNumber, orderExpectationId })))
				}

				try {
					setIsFetching(true)
					const [resp1, resp2] = await Promise.all(promises)

					setGridRows(resp1?.payload ?? [])
					setSimulatedSuccessFeeOrderRatings(resp2?.payload[0]?.orderRatings ?? [])
					setIsFetching(false)
				} catch (err: any) {
					enqueueSnackbar(err?.detail || t('anErrorHasOcurred'), { variant: 'error' })
					setIsFetching(false)
				}
			}

			fetch()
		}
	}, [dispatch, enqueueSnackbar, folderNumber, isShowingSimulation, orders, ordersDescriptions, tableOption]);

	return {
		gridRows,
		simulatedSuccessFeeOrderRatings,
		isFetching,
	}
}