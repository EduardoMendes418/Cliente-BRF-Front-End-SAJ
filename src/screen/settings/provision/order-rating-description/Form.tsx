import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField, NumericField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { useRegisterDefault } from 'src/hooks';
import {
	getOrderRatingDescription,
	editOrderRatingDescription,
	addOrderRatingDescription
} from 'src/core/store/modules/order-rating-description/thunks'
import {
	getErrorMessageOrderRatingDescription,
	getItemOrderRatingDescription,
	getLoadingOrderRatingDescription,
	getStatusOrderRatingDescription
} from 'src/core/store/modules/order-rating-description/selectors'
import { TOrderRatingDescription } from 'src/core/models/order-rating-description'
import { actions } from 'src/core/store'

const defaultValues = {
	name: '',
}

const OrderRatingDescriptionForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>()

	const isNew = id === 'novo';

	const orderRatingDescriptionItem = useSelector(getItemOrderRatingDescription)
	const isLoading = useSelector(getLoadingOrderRatingDescription)

	useRegisterDefault({
		action: 'orderRatingDescription',
		getStatus: getStatusOrderRatingDescription,
		getErrorMessage: getErrorMessageOrderRatingDescription
	})

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!orderRatingDescriptionItem && !isNaN(idNumber)) {
			dispatch(getOrderRatingDescription(idNumber))
		}
	}, [dispatch, orderRatingDescriptionItem, id])

	useEffect(() => () => dispatch(actions.orderRatingDescription.setItem(undefined)), [dispatch])

	const onSubmit = useCallback(async (orderRatingDescription: TOrderRatingDescription, { setSubmitting }: FormikHelpers<TOrderRatingDescription>) => {
		const { ...values } = orderRatingDescription
		if (orderRatingDescriptionItem) {
			await dispatch(editOrderRatingDescription({ ...orderRatingDescriptionItem, ...values }))
			setSubmitting(false)
			return
		}

		await dispatch(addOrderRatingDescription(orderRatingDescription))
		setSubmitting(false);
	}, [dispatch, orderRatingDescriptionItem])

	const initialValues = orderRatingDescriptionItem ? orderRatingDescriptionItem : defaultValues as TOrderRatingDescription
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderRatingDescription.formTitle')}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('provisions:orderRatingDescription.title')}
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
								</Grid>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	)
}

export default OrderRatingDescriptionForm
