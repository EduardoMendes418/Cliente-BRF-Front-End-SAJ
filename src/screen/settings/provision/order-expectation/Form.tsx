import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField, SwitchField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { useRegisterDefault } from 'src/hooks';
import { getOrderExpectation, editOrderExpectation, addOrderExpectation } from 'src/core/store/modules/order-expectation/thunks'
import {
	getErrorMessageOrderExpectation,
	getItemOrderExpectation,
	getLoadingOrderExpectation,
	getStatusOrderExpectation
} from 'src/core/store/modules/order-expectation/selectors'
import { TOrderExpectation } from 'src/core/models/order-expectation'
import { actions } from 'src/core/store'
import { StyledP } from './styled';

const defaultValues = {
	isActive: true,
	provision: false
}

const OrderExpectationForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>()

	const isNew = id === 'novo';

	const orderExpectationItem = useSelector(getItemOrderExpectation)
	const isLoading = useSelector(getLoadingOrderExpectation)

	useRegisterDefault({
		action: 'orderExpectation',
		getStatus: getStatusOrderExpectation,
		getErrorMessage: getErrorMessageOrderExpectation
	})

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!orderExpectationItem && !isNaN(idNumber)) {
			dispatch(getOrderExpectation(idNumber))
		}
	}, [dispatch, orderExpectationItem, id])

	useEffect(() => () => dispatch(actions.orderExpectation.setItem(undefined)), [dispatch])

	const onSubmit = useCallback(async (orderExpectation: TOrderExpectation, { setSubmitting }: FormikHelpers<TOrderExpectation>) => {
		const { name, isActive, provision } = orderExpectation
		if (orderExpectationItem) {
			await dispatch(editOrderExpectation({ ...orderExpectationItem, name, isActive, provision }))
			setSubmitting(false)
			return
		}

		await dispatch(addOrderExpectation(orderExpectation))
		setSubmitting(false);
	}, [dispatch, orderExpectationItem])

	const initialValues = orderExpectationItem ? orderExpectationItem : defaultValues as TOrderExpectation
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderExpectation.title')} withPadding
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('provisions:orderExpectation.title')}
											name='name'
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name={'provision'}
											/>
											{t('provisions:orderExpectation.provision')}
										</StyledP>
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

export default OrderExpectationForm
