import { Formik, FormikHelpers } from 'formik'
import { Box, Grid } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import Panel from 'src/components/Panel'
import { SelectField } from 'src/components/form'
import { Submit, Clean } from 'src/components/button'
import { usePaymentType, useBanks, useGroupedAreas } from 'src/hooks/fetchLists'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { actions } from 'src/core/store'
import { TInterestUpdateFilterForm } from 'src/core/models/interest-update'
import { rejectNoValues } from 'src/core/utils/func'
import { Modulos } from 'src/core/models/modules';
import { useClosingOptions } from 'src/hooks/useProcessFilterOptions'
import { useEffect, useMemo } from 'react'
import { getListFormulaCorrectionRuleAsOptionsFromList } from 'src/core/store/modules/formula-correction-rule/selectors'
import { fetchFormulaCorrectionRuleList } from 'src/core/store/modules/formula-correction-rule/thunks'
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple'

const initialValues: TInterestUpdateFilterForm = {
	closureId: [],
	legalDepartmentAreaId: [],
	accountTypeId: [],
	bankId: [],
	currectionFormulaId: [],
	status: []
}

const Search = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const { banksAsOptions } = useBanks();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);
	const closingOptions = useClosingOptions();
	const { groupedAreasAsOptions } = useGroupedAreas();
	const formulaCorrectionRulesAsOptions = useSelector(getListFormulaCorrectionRuleAsOptionsFromList);

	useEffect(() => {
		dispatch(fetchFormulaCorrectionRuleList({ pageSize: 100, notPaginate: true }));
		return () => dispatch(actions.formulaCorrectionRule.clear())
	}, [dispatch])

	const onSubmit = (values: TInterestUpdateFilterForm, { setSubmitting }: FormikHelpers<TInterestUpdateFilterForm>) => {
		const filter = rejectNoValues({ page, pageSize, ...values })
		dispatch(actions.interestUpdate.setFilters(filter))
		setSubmitting(false)
	}

	const closingOptionsList = useMemo(() => closingOptions.slice().sort((x, y) => x.label.localeCompare(y.label)), [closingOptions]);

	return (
		<Panel title={t('goodsAndGuarantees:depositUpdate.filterTitle')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField 
									options={closingOptionsList}
									label={t('goodsAndGuarantees:depositUpdate.fieldClosure')}
									name="closureId"
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('goodsAndGuarantees:depositUpdate.fieldAreaDejur')}
									name='legalDepartmentAreaId'
									options={groupedAreasAsOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('goodsAndGuarantees:depositUpdate.fieldAccountType')}
									name='accountTypeId'
									options={paymentTypeAsOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('goodsAndGuarantees:depositUpdate.fieldBank')}
									name='bankId'
									options={banksAsOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('goodsAndGuarantees:depositUpdate.fieldInternalUpdateRule')}
									name='currectionFormulaId'
									options={formulaCorrectionRulesAsOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={"Status"}
									name='status'
									options={[
										{value: 1, label: "Ativo"},
										{value: 0, label: "Inativo"},
									]}
									multiple
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Clean onClick={handleSubmit} />
									<Submit
										type='search'
										disabled={isSubmitting}
										submitting={isSubmitting}
									/>
								</Box>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search
