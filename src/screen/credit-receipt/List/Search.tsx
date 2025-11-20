import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import moment from 'moment';
import { Grid } from '@material-ui/core';

import { Clean, Submit } from 'src/components/button';
import Panel from 'src/components/Panel';
import { DateField, NumericField, SelectField } from 'src/components/form';

import { t } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { getFiltersCreditReceipt } from 'src/core/store/modules/credit-receipt/selectors';
import { TCreditReceiptFilters } from 'src/core/models/credit-receipt';
import { rejectNoValues } from 'src/core/utils/func';
import { usePaymentType } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
import ContactField from 'src/components/ContactField';

import { statusOptions } from '../constants';
import { CONTACT_SEARCH, CONTACT_TYPE, accountabilityStatusOptions } from 'src/core/utils/constants';

const validate = ({ startDate, endDate }: TCreditReceiptFilters) =>
	moment(endDate).isBefore(moment(startDate))
		? { to: t('validations.invalidDate') }
		: {}

const Search = ({ loading, pathname }: { loading: boolean, pathname: string }) => {
	const dispatch = useDispatch();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	const savedFilters = useSelector(getFiltersCreditReceipt);

	const onSubmit = (values: TCreditReceiptFilters, { setSubmitting }: any) => {
		if(values.intLawIds?.length !== 0){
		values = {...values,
		intLawIds: [values.intLawIds]
		}
		}
		const result = rejectNoValues(values);
		dispatch(actions.creditReceipt.setFilters({ filters: result, page: pathname }))
		setSubmitting(false);
	};

	const initialValues: TCreditReceiptFilters = {
		startDate: null,
		endDate: null,
		statusFlowId: '',
		folderNumber: '',
		paymentTypeId: '',
		statusApprovalId: '',
		intLawIds: [],
		...(savedFilters[pathname] ?? {})
	}

	return (
		<Panel title={t('creditReceipt:list.titleSearch')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				enableReinitialize
			>
				{({ handleSubmit, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={12} md={3}>
								<NumericField
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name='id'
									label={t('form.id')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name='startDate'
									label={t('form.from')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name='endDate'
									label={t('form.to')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									name='statusFlowId'
									label={t('status')}
									options={statusOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									name='paymentTypeId'
									label={t('creditReceipt:form.paymentType')}
									options={paymentTypeAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									name='statusApprovalId'
									label={t('creditReceipt:form.statusApprovalId')}
									options={accountabilityStatusOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("creditReceipt:list.evaluatorDateStart")}
											name="evaluatorDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("creditReceipt:list.end")}
											name="evaluatorDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("creditReceipt:list.sapRequestDateStart")}
											name="sapRequestDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("creditReceipt:list.end")}
											name="sapRequestDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.internalLawyer')}
										name="intLawIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.InternalLawyer}
									/>
								</Grid>
							<Grid item xs={2} lg={1}>
								<Submit type="search" disabled={!isValid || loading} />
							</Grid>
						</Grid>
						<Clean action='creditReceipt' page={pathname} />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
