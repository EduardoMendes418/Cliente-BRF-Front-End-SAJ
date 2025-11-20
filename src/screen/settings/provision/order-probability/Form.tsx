import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField, NumericField, SwitchField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { useRegisterDefault } from 'src/hooks';
import {
	getOrderProbability,
	editOrderProbability,
	addOrderProbability
} from 'src/core/store/modules/order-probability/thunks'
import {
	getErrorMessageOrderProbability,
	getItemOrderProbability,
	getLoadingOrderProbability,
	getStatusOrderProbability
} from 'src/core/store/modules/order-probability/selectors'
import { TOrderProbability } from 'src/core/models/order-probability'
import { actions } from 'src/core/store'
import { StyledP } from '../order-expectation/styled';

const defaultValues = {
	id: 0,
	name: '',
	orderById: 0,
	isActive: true,
	account: false,
}

const OrderProbabilityForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>()

	const isNew = id === 'novo';

	const orderProbabilityItem = useSelector(getItemOrderProbability)
	const isLoading = useSelector(getLoadingOrderProbability)

	useRegisterDefault({
		action: 'orderProbability',
		getStatus: getStatusOrderProbability,
		getErrorMessage: getErrorMessageOrderProbability
	})

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!orderProbabilityItem && !isNaN(idNumber)) {
			dispatch(getOrderProbability(idNumber))
		}
	}, [dispatch, orderProbabilityItem, id])

	useEffect(() => () => dispatch(actions.orderProbability.setItem()), [dispatch])

	const onSubmit = useCallback(async (values: TOrderProbability, { setSubmitting }: FormikHelpers<TOrderProbability>) => {
		if (orderProbabilityItem) {
			await dispatch(editOrderProbability({ ...orderProbabilityItem, ...values }))
			setSubmitting(false)
			return
		}

		await dispatch(addOrderProbability(values))
		setSubmitting(false);
	}, [dispatch, orderProbabilityItem])

	const initialValues = orderProbabilityItem ? orderProbabilityItem : defaultValues as TOrderProbability
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderProbability.title')}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'} withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('provisions:orderProbability.title')}
											name='name'
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<NumericField
											label={t('provisions:orderProbability.orderById')}
											name='orderById'
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name={'account'}
											/>
											{t('provisions:orderProbability.accountFor')}
										</StyledP>
									</Grid>
								</Grid>
							)}
						</Panel>

					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}

export default OrderProbabilityForm
