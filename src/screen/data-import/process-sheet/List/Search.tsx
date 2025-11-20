import { useEffect, MutableRefObject, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik'
import { Grid } from '@material-ui/core'

import { SelectField, DateField, TextField } from 'src/components/form'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { Clean, Submit } from 'src/components/button'
import ContactField from 'src/components/ContactField';
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";
import { usePagination } from 'src/hooks/pagination';
import { useGroupedAreas } from "src/hooks/fetchLists";
import CTGOptionProcess from 'src/screen/data-import/components/CTGOptionProcess'
import { fetchProcessSheet } from 'src/core/store/modules/data-import/thunk';
import { actions } from 'src/core/store';
import { getDataImportFilters } from 'src/core/store/modules/data-import/selectors';
import { processTypeOptions } from 'src/core/utils/constants';
import { useLitigationNatures } from 'src/hooks/fetchLists';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const initialValues: any = {
	folderNumber: '',
	litigationRelationship: 1,
	originAreaId: [],
	legalDepartmentAreaId: [],
	mainCompanyId: '',
	distributionDateStart: null,
	distributionDateEnd: null,
	creationDateStart: null,
	creationDateEnd: null,
	registrationComplementDateStart: null,
	registrationComplementDateEnd: null,
	terminationDateStart: null,
	terminationDateEnd: null,
	closingDateStart: null,
	closingDateEnd: null,
	contingency: '',
	statusId: [],
	type: '',
	AgentIds: '',
	InternalLawyerIds: '',
	LegalResponsibleIds: '',
	responsibleAreaId: '',
	ResponsibleOfficeIds: '',
	actionClassId: '',
	sphere: '',
	provisionClassId: [],
	closureId: '',
	natureId: '',
	result: [],
	locationIds: '',
};

const validate = ({ folderNumber }: any) => {
	if (folderNumber === "" || !!folderNumber.match(/^\d{7}(\/\d{3})?$/))
		return {};
	return { folderNumber: "Deve seguir esse padrão {9999999/999} ou {9999999}"};
};

type TProcessSheetForm = {
	loading?: boolean;
	formRef: MutableRefObject<any>;
	options: any;
}

const ProcessSheetForm = ({ loading, formRef, options }: TProcessSheetForm) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const { location: { pathname } } = useHistory();

	const filters = useSelector(getDataImportFilters);

	const { litigationNaturesAsOptions } = useLitigationNatures()

	const {
		spheresOptions,
		closingOptions,
		statusesOptions,
		actionClassesOptions,
		contingenciesOptions,
		provisionClassesOptions,
		resultsAsOptions,
		groupedAreasByIdAsOptions
	} = options;

	const { groupedAreasAsOptions } = useGroupedAreas();


	const onSubmit = useCallback((values, { setSubmitting }) => {
		const normalizeValues = { 
			...values,
			AgentIds: values?.AgentIds === "" || Number.isNaN(values?.AgentIds) ? [] : [Number(values?.AgentIds) ?? 0],
			InternalLawyerIds: values?.InternalLawyerIds !== "" ? [Number(values?.InternalLawyerIds) ?? 0] : [],
			ResponsibleOfficeIds: values?.ResponsibleOfficeIds !== "" ? [Number(values?.ResponsibleOfficeIds) ?? 0] : [],
			LegalResponsibleIds: values?.LegalResponsibleIds !== "" ? [Number(values?.LegalResponsibleIds) ?? 0] : [],
			locationIds: values?.locationIds !== "" ? [Number(values?.locationIds) ?? 0] : []
		} 

		if (values.folderNumber !== "") normalizeValues.folderNumber = values.folderNumber.split(";")
		dispatch(actions.dataImport.setFilters({ filters: normalizeValues, page: pathname }));
		setSubmitting(false)
	}, [dispatch, pathname]);

	const clearList = () => {
	  dispatch(actions.dataImport.clear());
	};

	useEffect(() => {
		if (Object.keys((filters as any)[pathname] || {}).length > 0)
			dispatch(fetchProcessSheet({ ...(filters as any)[pathname], pageSize, page }));
	}, [dispatch, filters, page, pageSize, pathname]);

	return (
		<Formik
			innerRef={formRef}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, dirty}) => (
				<form noValidate onSubmit={handleSubmit} autoComplete="off">
					<Panel title={t('dataImport:processSheet.filterTitle')} withPadding>
						<Grid container spacing={3}>
							<Grid item xs={12} md={3}>
								<TextField
									label={t('dataImport:processSheet.form.ctgFolder')}
									name="folderNumber"
									maxLength={11}
								/>
							</Grid>
							<CTGOptionProcess />
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t('dataImport:processSheet.form.originArea')}
									name="originAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t('dataImport:processSheet.form.dejurArea')}
									name="legalDepartmentAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:processSheet.form.mainCompany')}
									name="mainCompanyId"
									contactType={CONTACT_TYPE.COMPANY}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.judgmentDate')}
											name="distributionDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.to')}
											name="distributionDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.registrationDate')}
											name="creationDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.to')}
											name="creationDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.compDate')}
											name="registrationComplementDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.to')}
											name="registrationComplementDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.dischargeDate')}
											name="terminationDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.to')}
											name="terminationDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.closingDate')}
											name="closingDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:processSheet.form.to')}
											name="closingDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.contingencyType')}
									name="contingency"
									options={contingenciesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.status')}
									name="statusId"
									options={statusesOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.type')}
									name="type"
									options={processTypeOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:processSheet.form.agent')}
									name="AgentIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:processSheet.form.inhouseLawyer')}
									name="internalLawyerIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:processSheet.form.legalResponsible')}
									name="LegalResponsibleIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={t('dataImport:processSheet.form.lawFirm')}
									name="responsibleAreaId"
									options={groupedAreasByIdAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:processSheet.form.lawFirmResponsible')}
									name="ResponsibleOfficeIds"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.OfficeResponsible}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.actionClass')}
									name="actionClassId"
									options={actionClassesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.sphere')}
									name="sphere"
									options={spheresOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
                                    multiple
									label={t('dataImport:processSheet.form.provisionClass')}
									name="provisionClassId"
									options={provisionClassesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.closing')}
									name="closureId"
									options={closingOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:processSheet.form.nature')}
									name="natureId"
									options={litigationNaturesAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
						        <SelectField
							        label={t('dataImport:smartswap.filter.result')}
							        name="result"
							        options={resultsAsOptions}
									multiple
						        />
					        </Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:smartswap.filter.location')}
									name="locationIds"/>
								</Grid>

							<Grid container spacing={2} alignItems='center'>
								<Grid item md={6} xs={6}>
									<Clean onClick={clearList} action='dataImport' page={pathname} />
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
									<Submit
										type="search"
										disabled={!dirty || loading}
										submitting={loading || isSubmitting}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Panel>
				</form >
			)}
		</Formik>
	)
};

export default ProcessSheetForm;
