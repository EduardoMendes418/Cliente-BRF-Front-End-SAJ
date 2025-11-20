import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import ScreenTemplate from 'src/components/Screen'
import Form, { DateField, SelectField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { t } from 'src/locale/i18n';
import { fetchItemInterestUpdate, editInterestUpdate, addInterestUpdate } from 'src/core/store/modules/interest-update/thunks'
import {
	getItemInterestUpdate,
	getLoadingInterestUpdate,
} from 'src/core/store/modules/interest-update/selectors'
import { useBanks, usePaymentType, useGroupedAreas } from 'src/hooks/fetchLists'
import { TInterestUpdate } from 'src/core/models/interest-update'
import { actions, AppDispatch } from 'src/core/store'
import { getListFormulaCorrectionRuleAsOptionsFromList } from 'src/core/store/modules/formula-correction-rule/selectors';
import { fetchFormulaCorrectionRuleList } from 'src/core/store/modules/formula-correction-rule/thunks';
import { depositStatusAsOptions } from './constants'
import { Modulos } from 'src/core/models/modules';
import { useSnackbar } from 'notistack'
import { useClosingOptions } from 'src/hooks/useProcessFilterOptions';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';


const defaultValues = {
	closureId: '',
	legalDepartmentAreaId: '',
	bankId: 0,
	currectionFormulaId: '',
	depositStatus: '',
	paymentDateStart: null,
	paymentDateEnd: null,
	paymentTypeDescription: '',
	paymentTypeId: 0,
}

const validationSchema = yup.object({
	closureId: yup.number().required(t('required')),
});

const DepositUpdateForm = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { banksAsOptions } = useBanks();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);
	const isNew = id === 'novo';
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const depositUpdateItem = useSelector(getItemInterestUpdate)
	const isLoading = useSelector(getLoadingInterestUpdate)
	const formulaCorrectionRulesAsOptions = useSelector(getListFormulaCorrectionRuleAsOptionsFromList);
	const closingOptions = useClosingOptions()

	const { groupedAreasAsOptions} = useGroupedAreas();

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!depositUpdateItem && !isNaN(idNumber)) {
			dispatch(fetchItemInterestUpdate(idNumber))
		}
	}, [dispatch, depositUpdateItem, id])

	useEffect(() => () => dispatch(actions.interestUpdate.setItem(undefined)), [dispatch])

	useEffect(() => {
		dispatch(fetchFormulaCorrectionRuleList({ pageSize: 100, notPaginate: true }));
		return () => dispatch(actions.formulaCorrectionRule.clear())
	}, [dispatch])

	const onSubmit = useCallback(async (depositUpdate: TInterestUpdate, { setSubmitting }: FormikHelpers<TInterestUpdate>) => {
		if (depositUpdateItem) {

			const { type, payload } = await dispatch(editInterestUpdate({ ...depositUpdateItem, ...depositUpdate }))
			if (type === "interestUpdate/edit/rejected") {
				enqueueSnackbar(payload?.detail, { variant: 'error' })
			} else {
				history.goBack()
			}

			setSubmitting(false)
			return
		}

		const { type, payload } = await dispatch(addInterestUpdate(depositUpdate))
		if (type === "interestUpdate/add/rejected") {
			enqueueSnackbar(payload?.detail, { variant: 'error' })
		} else {
			history.goBack()
		}

		setSubmitting(false);
	}, [depositUpdateItem, dispatch, enqueueSnackbar, history])

	const initialValues = depositUpdateItem ? depositUpdateItem : defaultValues as any

	const banks = useMemo(() => {
		return banksAsOptions.slice().sort((x, y) => {
			return x.label.localeCompare(y.label)
		})
	}, [banksAsOptions])

	const closingOptionsList = useMemo(() => closingOptions.slice().sort((x, y) => x.label.localeCompare(y.label)), [closingOptions])

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				validationSchema={validationSchema}
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							withPadding
							title={
								t(isNew
									? 'tituloFormularioNovo'
									: 'tituloFormularioEdicao', { title: t('goodsAndGuarantees:depositUpdate.title').toLowerCase() })
							}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							slotBottomRight={(
								<Submit
									isNew={isNew}
									disabled={!dirty || !isValid || isSubmitting || isLoading}
									submitting={isSubmitting}
								/>
							)}
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<SelectField
											options={closingOptionsList}
											label={t('goodsAndGuarantees:depositUpdate.fieldClosure')}
											name="closureId"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											required
											label={t('goodsAndGuarantees:depositUpdate.fieldAreaDejur')}
											name='legalDepartmentAreaId'
											options={groupedAreasAsOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											required
											label={t('goodsAndGuarantees:depositUpdate.fieldAccountType')}
											name="paymentTypeId"
											options={paymentTypeAsOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											required
											label={t('goodsAndGuarantees:depositUpdate.fieldBank')}
											name='bankId'
											options={banks}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											required
											label={t('goodsAndGuarantees:depositUpdate.fieldDepositStatus')}
											name='depositStatus'
											options={depositStatusAsOptions}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Grid container spacing={3}>
											<Grid item xs={6} md={6}>
												<DateField
													required
													label={t('goodsAndGuarantees:depositUpdate.fieldPaymentPeriodFrom')}
													name='paymentDateStart'
												/>

											</Grid>
											<Grid item xs={6} md={6}>
												<DateField
													required
													label={t('goodsAndGuarantees:depositUpdate.fieldPaymentPeriodTo')}
													name='paymentDateEnd'
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											required
											label={t('goodsAndGuarantees:depositUpdate.fieldInternalUpdateRule')}
											name='currectionFormulaId'
											options={formulaCorrectionRulesAsOptions}
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

export default DepositUpdateForm
