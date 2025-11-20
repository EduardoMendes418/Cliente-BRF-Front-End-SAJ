import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress, Grid } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField, SwitchField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { getOrderDescription, editOrderDescription, addOrderDescription } from 'src/core/store/modules/order-description/thunks'
import {
	getItemOrderDescription,
	getLoadingOrderDescription,
} from 'src/core/store/modules/order-description/selectors'
import { TOrderDescription } from 'src/core/models/order-description'
import { actions, AppDispatch } from 'src/core/store'
import { useGroupedAreas } from "src/hooks/fetchLists";
import { useSnackbar } from 'notistack';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const defaultValues = {
	name: '',
	areaId: 0,
	isActive: false,
	sumProvision: true
}

const OrderDescriptionForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { groupedAreasAsOptions} = useGroupedAreas();
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const isNew = id === 'novo';

	const orderDescriptionItem = useSelector(getItemOrderDescription)
	const isLoading = useSelector(getLoadingOrderDescription)

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!orderDescriptionItem && !isNaN(idNumber)) {
			dispatch(getOrderDescription(idNumber))
		}
	}, [dispatch, orderDescriptionItem, id])

	useEffect(() => () => dispatch(actions.orderDescription.setItem(undefined)), [dispatch])

	const onSubmit = useCallback(async (orderDescription: TOrderDescription, { setSubmitting }: FormikHelpers<TOrderDescription>) => {
		if (orderDescriptionItem) {
			const { name, areaId, sumProvision } = orderDescription
			const { meta, payload } = await dispatch(editOrderDescription({ ...orderDescriptionItem, name, areaId, sumProvision }))

			if (meta.requestStatus === "rejected") {
				enqueueSnackbar(payload.error.detail ?? t('anErrorHasOcurred'), { variant: "error" })
				setSubmitting(false)
			} else {
				setSubmitting(false)
				history.goBack()
			}
			return
		}

		const { meta, payload } = await dispatch(addOrderDescription(orderDescription))
		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.error.detail ?? t('anErrorHasOcurred'), { variant: "error" })
		} else {
			setSubmitting(false);
			history.goBack()
		}
	}, [dispatch, enqueueSnackbar, history, orderDescriptionItem, t])

	const initialValues = orderDescriptionItem ? orderDescriptionItem : defaultValues as TOrderDescription
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderDescription.formTitle')}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											label={t('settings:defaultOrderValue.form.dejurArea')}
											name='areaId'
											options={groupedAreasAsOptions}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('provisions:orderDescription.title')}
											name='name'
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<Box margin={0}>
											<SwitchField
												name='sumProvision'
											/>
											{t("provisions:orderDescription.sumProvision")}
										</Box>
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

export default OrderDescriptionForm
