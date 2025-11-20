import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid, Typography } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom';
import Form, { SelectField, SwitchField } from 'src/components/form';


import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n'

import FlowApprovalForm from './Components/FlowApproval';
import { TOrderConfrontingType } from 'src/core/models/confronting-parameters';

import {
	getOrderConfronting,
	editOrderConfronting,
	addOrderConfronting
} from 'src/core/store/modules/order-confronting-parameters/thunks'

import {
	getItemOrderConfronting,
	getLoadingOrderConfronting,
} from 'src/core/store/modules/order-confronting-parameters/selectors'

import { actions, AppDispatch } from 'src/core/store'
import { useSnackbar } from 'notistack';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { StyledP } from './styled';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const defaultValues = {
	areaDejurId: '',
	indDescriptionOrder: false,
	indExpectation: false,
	indProbability: false,
	isActive: false,
	indProbableValue: false,
	indPossibleValue: false,
	indRemoteValue: false,
	indDatabase: false,
	indCorrectionIndex: false,
}

const OrderConfrontingParametersForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const { id } = useParams<{ id: string }>()
	const router = useHistory();

	const orderConfrontingItem = useSelector(getItemOrderConfronting)
	const isLoading = useSelector(getLoadingOrderConfronting)

	const { groupedAreasAsOptions } = useGroupedAreas();

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!isNaN(idNumber)) {
			dispatch(getOrderConfronting(idNumber))
		}
	}, [dispatch, id])

	useEffect(() => () => dispatch(actions.orderConfrontingParameters.setItem(undefined)), [dispatch])

	const isNew = id === 'novo';

	const onSubmit = async (values: TOrderConfrontingType) => {
		if (isNew) {
			const { type, payload } = await dispatch(addOrderConfronting({ ...values, isActive: true }))
			if (type === "orderConfrontingParameters/add/rejected") {
				enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
			} else {
				router.goBack()
			}
		} else {
			const { type, payload } = await dispatch(editOrderConfronting(
				{
					...values,
					id: Number(id)
				}
			))
			if (type === "orderConfrontingParameters/add/rejected") {
				enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
			} else {
				enqueueSnackbar(t('successfulOperation'), { variant: 'success' })
				router.goBack()
			}
		};
	};

	const initialValues = (orderConfrontingItem ? orderConfrontingItem : defaultValues) as TOrderConfrontingType
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t('provisions:orderConfrontingParameters.formTitle')} withPadding>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											label={t('closure:runEqualization.list.dejurArea')}
											name="areaDejurId"
											options={groupedAreasAsOptions}
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>

						<Panel title={t('provisions:orderConfrontingParameters.formTitleregistration')} withPadding>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name="indDescriptionOrder"
											/>
											{t('provisions:orderConfrontingParameters.formDescriptionOrder')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indExpectation'
											/>
											{t('provisions:orderConfrontingParameters.formExpectation')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indProbability'
											/>
											{t('provisions:orderConfrontingParameters.formProbability')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indStatus'
											/>
											{t('provisions:orderConfrontingParameters.formAtivoInativo')}
										</StyledP>
									</Grid>

									<Grid item md={12} xs={12}>
										<Typography variant='h3'>
											{t('provisions:orderConfrontingParameters.formOpening')}
										</Typography>
									</Grid>

									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indProbableValue'
											/>
											{t('provisions:orderConfrontingParameters.formProbabelValue')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indPossibleValue'
											/>
											{t('provisions:orderConfrontingParameters.formPossibleValue')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indRemoteValue'
											/>
											{t('provisions:orderConfrontingParameters.formRemoteValue')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indDatabase'
											/>
											{t('provisions:orderConfrontingParameters.formDataBase')}
										</StyledP>
									</Grid>
									<Grid item md={3} xs={12}>
										<StyledP>
											<SwitchField
												name='indCorrectionIndex'
											/>
											{t('provisions:orderConfrontingParameters.formCorrectionIndex')}
										</StyledP>
									</Grid>
								</Grid>
							)}
						</Panel>
						{
							!isLoading && (
								<FlowApprovalForm
									title={t('provisions:orderConfrontingParameters.formTitleFlow')}
									isNew={isNew}
									disabled={!dirty}
									submitting={isSubmitting}
								/>
							)
						}
					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}

export default OrderConfrontingParametersForm