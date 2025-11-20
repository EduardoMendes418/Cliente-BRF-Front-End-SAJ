import { Formik, FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { NumericField, SelectField, DateField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { useGuaranteeModality } from 'src/hooks/fetchLists';

import { useTranslation } from 'src/locale/i18n';
import { TGuaranteeAccountabilityFilters } from 'src/core/models/guarantee-accountability';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { getFiltersGuaranteeAccountability } from 'src/core/store/modules/guarantee-accountability/selectors';
import { bearishReasonsOptionsList } from '../../constants';
import { accountabilityStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants';
import { statusAccountabilityOptions } from "src/screen/goods-and-guarantees/constants"
import { CONTACT_SEARCH, CONTACT_TYPE, accountabilityStatusOptions as asOptions } from 'src/core/utils/constants';
import ContactField from 'src/components/ContactField';

const Search = ({ loading, pathname }: { loading: boolean, pathname: string }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { guaranteeModalityAsOptionsAll } = useGuaranteeModality()

	const savedFilters = useSelector(getFiltersGuaranteeAccountability);

	const onSubmit = (
		values: TGuaranteeAccountabilityFilters,
		{ setSubmitting }: FormikHelpers<TGuaranteeAccountabilityFilters>
	) => {
		const result = rejectNoValues(values);
		dispatch(actions.guaranteeAccountability.setFilters({ filters: result, page: pathname }));
		setSubmitting(false)
	}

	const initialValues: TGuaranteeAccountabilityFilters = {
		id: '',
		folderNumber: '',
		goodId: '',
		guaranteeModeId: '',
		statusFlowIds: [],
		accountabilityDateStart: null,
		accountabilityDateEnd: null,
		status: '',
		bearishReasons: [],
		statusApprovalId: '',
		valuationDateStart: '',
		valuationDateEnd: '',
		IntLawIds: null,
		...(savedFilters[pathname] ?? {})
	}

	const sortedBearishReasonsOptionsList = bearishReasonsOptionsList?.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    });

	return (
		<Panel title={t('goodsAndGuarantees:accountability.searchTitle')} withPadding>
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, dirty}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3} alignItems='flex-start'>
							<Grid item xs={12} md={3}>
								<NumericField
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name='goodId'
									label={t('goodsAndGuarantees:management.goodAndGuaranteeId')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name='id'
									label={t('goodsAndGuarantees:management.id')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Modalidade da garantia"}
									name='guaranteeModeId'
									options={guaranteeModalityAsOptionsAll}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Motivo da baixa"}
									name='bearishReasons'
									options={sortedBearishReasonsOptionsList}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status da prestação de conta"}
									name='statusFlowIds'
									options={accountabilityStatusOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Situação"}
									name='status'
									options={statusAccountabilityOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name='accountabilityDateStart'
											label={"Data da prestação de contas de"}
										/>

									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name='accountabilityDateEnd'
											label={"até"}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("goodsAndGuarantees:form.accountingStatusId")}
									name='statusApprovalId'
									options={asOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name='valuationDateStart'
											label={t("goodsAndGuarantees:accountability.valuationDateStart")}
										/>

									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name='valuationDateEnd'
											label={t("default:field.toCamelCase")}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.internalLawyer')}
										name="IntLawIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.InternalLawyer}
									/>
								</Grid>
							<Grid item xs={2}>
								<Submit type="search" disabled={!dirty} submitting={loading} />
							</Grid>
						</Grid>
						<Clean action='guaranteeAccountability' page={pathname} />
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search;
