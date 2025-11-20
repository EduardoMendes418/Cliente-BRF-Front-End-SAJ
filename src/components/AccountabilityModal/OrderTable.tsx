import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'

import AccordionPanel from 'src/components/AccordionPanel'
import Table, { ColumnData } from 'src/components/Table'
import { setOrderToEditPaymentOrders } from 'src/core/store/modules/provision-order';
import { getOrders } from 'src/core/store/modules/provision-order/selectors'
import { TProvisionOrder, TProvisionOrderForm, TpaymentOrders } from 'src/core/models/provision-order'
import { t } from 'src/locale/i18n'

import { getOrderForm } from 'src/screen/provisions/utils/func'
import { initialValuesPayment } from "./ProvisionForm";


type OrderTableProps = {
	process: TProvisionOrder[]
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void
	isEditable: boolean
	isLoading: boolean
	paymentOrders: TpaymentOrders[]

}

export const associatePaymentOrdersWithOrder = (paymentOrders: TpaymentOrders[], orders: TProvisionOrder[]) => {
	const flatenOrder = [...orders.map((item) => item.orderRatings.map((orderRating) => ({...orderRating, idOrder: item.id}))).flat(1)]
	const paymentOrdersWithOrder = [...paymentOrders.map(item => {
		const order = flatenOrder.find((order) => order.id === item.orderRatingId)
		return {...order, valueOrder: order?.value, ...item}
	})]
	return paymentOrdersWithOrder
}

export default function OrderTable({ process, setFormValues, isEditable, isLoading, paymentOrders = [] }: OrderTableProps) {
	const dispatch = useDispatch();

	const orders = useSelector(getOrders)


	const handleEdit = useCallback((row: TProvisionOrder) => {
		dispatch(setOrderToEditPaymentOrders({
			...row,
			isFormBlocked: !(isEditable && row?.orderStatus?.id === 2 && row?.orderExpectation?.id === 1 && row?.orderDescription?.sumProvision && row.isActive && row?.totalProvisionValue !== 0  )
		}))
		const orderFormValues = getOrderForm(row)
		setFormValues({ ...initialValuesPayment, ...orderFormValues})

	}, [dispatch, setFormValues, isEditable])


	const requestTableColumns: ColumnData[] = useMemo(() => [
		{
			label: 'Ações',
			field: 'action',
			component: (row: any) => {
				const {orderDescription: {sumProvision} } = row
				return (
					<>
						<IconButton aria-label='edit' onClick={() => handleEdit(row)}>
							{!isEditable || !(row?.orderStatus?.id === 2) || !(row?.orderExpectation?.id === 1) || !row.isActive || !sumProvision || row?.totalProvisionValue === 0 ? <VisibilityIcon /> : <EditIcon />}
						</IconButton>
					</>
				)
			},
			type: 'custom'
		},
		{
			label: t('provisions:request.table.requestDescription'),
			field: 'description',
			component: (row: TProvisionOrder) => row.orderDescription?.name,
			type: 'custom'
		},
		{
			label: t('provisions:request.table.requestDate'),
			field: 'createdDate',
			type: 'date'
		},
		{
			label: t('provisions:request.table.expectation'),
			field: 'description',
			component: (row: TProvisionOrder) => row.orderExpectation?.name,
			type: 'custom'
		},
		{
			label: t('provisions:request.table.probability'),
			field: 'description',
			component: (row: TProvisionOrder) => row.orderProbability?.name,
			type: 'custom'
		},
		{
			label: t('provisions:request.table.requestStatus'),
			field: 'description',
			component: (row: TProvisionOrder) => row.orderStatus?.name,
			type: 'custom'
		},
		{
			label: t("provisions:request.table.forecastValue"),
			field: 'totalProvisionValue',
			type: "currency",
		},
		{
			label: 'Valor total do pedido',
			field: 'riskValue',
			type: 'currency'
		},
		{
			label: 'Valor pagamento',
			field: 'paymentAmount',
			type: 'currency'
		},
		{
			label: t('provisions:request.table.enableDisable'),
			field: 'isActive',
			type: "switch-button-yn",


		},
	], [handleEdit, isEditable])

	const ordersWithSummedRisk = useMemo(() => process.map((item) => {

		const summedProvisionValue = item.orderRatings.reduce((sum, or) => {
				sum += or.value ?? 0
				return sum
			}, 0)

		const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(paymentOrders, orders)
		const itempaymentOrder = paymentOrdersWithOrder.filter(itemP => itemP.orderId === item.id)
		const paymentAmount = itempaymentOrder.reduce((sum, {value})=> sum + Number(value), 0)


		let totalProvisionValue = 0;
		for (let i = 0; i < item.orderRatings.length; i++) {
			if (item.orderRatings[i].orderRatingProbababilityId === 1)
			totalProvisionValue += item.orderRatings[i].value;
		}


		return { ...item, riskValue: summedProvisionValue, paymentAmount, totalProvisionValue }
	}), [orders, paymentOrders, process])


	return (
		<AccordionPanel title={t('provisions:request.requestListTitle')} startExpanded noContentMargin>
			<Table
				columns={requestTableColumns}
				rows={ordersWithSummedRisk}
				isLoading={isLoading}
				numItemsLoading={3}
			/>
		</AccordionPanel>
	)
}