import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { useRegisterDefault } from 'src/hooks';
import {
	getOrderStatus,
	editOrderStatus,
	addOrderStatus
} from 'src/core/store/modules/order-status/thunks'
import {
	getErrorMessageOrderStatus,
	getItemOrderStatus,
	getLoadingOrderStatus,
	getStatusOrderStatus
} from 'src/core/store/modules/order-status/selectors'
import { TOrderStatus } from 'src/core/models/order-status'
import { actions } from 'src/core/store'

const defaultValues = {
	isActive: true,
}

const OrderStatusForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>()

	const isNew = id === 'novo'

	const orderStatusItem = useSelector(getItemOrderStatus)
	const isLoading = useSelector(getLoadingOrderStatus)

	useRegisterDefault({
		action: 'orderStatus',
		getStatus: getStatusOrderStatus,
		getErrorMessage: getErrorMessageOrderStatus
	})

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!orderStatusItem && !isNaN(idNumber)) {
			dispatch(getOrderStatus(idNumber))
		}
	}, [dispatch, orderStatusItem, id])

	useEffect(() => () => dispatch(actions.orderStatus.setItem(undefined)), [dispatch])

	const onSubmit = useCallback(async (orderStatus: TOrderStatus, { setSubmitting }: FormikHelpers<TOrderStatus>) => {
		const { name, isActive } = orderStatus
		if (orderStatusItem) {
			await dispatch(editOrderStatus({ ...orderStatusItem, name, isActive }))
			setSubmitting(false)
			return
		}

		await dispatch(addOrderStatus(orderStatus))
		setSubmitting(false);
	}, [dispatch, orderStatusItem])

	const initialValues = orderStatusItem ? orderStatusItem : defaultValues as TOrderStatus
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderStatus.title')}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('provisions:orderStatus.title')}
											name='name'
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>

					</form>
				)}
			</Form>
		</ScreenTemplate>
	)
}

export default OrderStatusForm
