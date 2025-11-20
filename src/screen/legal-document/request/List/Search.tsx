import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { DateField, SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
	getLoadingLegalDocRequest,
} from "src/core/store/modules/legal-document-request/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { LegalDocumentRequestStatusEnum, TLegalDocFilter } from "src/core/models/legal-document-request";
import { useEffect, useMemo } from "react";
import { useGroupedAreas, useGroupedAreasById, useLegalDocOptions } from "src/hooks/fetchLists";
import ContactField from "src/components/ContactField";
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants";
import { useCoverage } from "src/hooks/legalDocuments";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { page, pageSize } = usePagination();
	const loading = useSelector(getLoadingLegalDocRequest);

	const { groupedAreasAsOptions} = useGroupedAreas();
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const { legalDocsRequestTypesOptions } = useLegalDocOptions();
	
	const { coveragesAsOptions } = useCoverage();

	const onSubmit = (
		{ ...values }: TLegalDocFilter,
		{ setSubmitting }: FormikHelpers<TLegalDocFilter>
	) => {
		const filter = rejectNoValues({ ...values, page, pageSize });

		dispatch(actions.legalDocRequest.setFilters({
			...filter,
		}));

		setSubmitting(false);
	};

	useEffect(() => {
		dispatch(actions.legalDocRequest.setFilters());
	}, [dispatch]);

	const initialValues: TLegalDocFilter = useMemo(() => ({
		id: "",
		folderNumber: '',
		legalDocumentRequestTypeId: null,
		requestDateStart: null,
		requestDateEnd: null,
		requestUserName: "",
		dejurAreaId: null,
		processNumber: "",
		coverage: null,
		requestStatus: LegalDocumentRequestStatusEnum.ALL,
		internalLawyerId: undefined,
		legalResponsibleId: undefined,
		office: "",
		serviceUserId: undefined,
		expectedServiceDateStart: null,
		expectedServiceDateEnd: null,
		conclusionDate: null,
		mandatoryCorrespondentData: undefined,
	}), []);

	return (
		<Panel title={t("officeManagement:search")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<DateField
											name="requestDateStart"
											label={t("legalDocs:request.search.date.from")}
											placeholder={t("legalDocs:request.placeholder.select")}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<DateField
											name="requestDateEnd"
											label={t("legalDocs:request.search.date.to")}
											placeholder={t("legalDocs:request.placeholder.select")}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									type="number"
									label={t("legalDocs:request.search.requestNumber")}
									name="id"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name='requestUserName'
									label={t('legalDocs:request.search.requester')}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t("legalDocs:request.search.dejurArea")}
									name="dejurAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									type="number"
									label={t("legalDocs:request.search.CTGFolder")}
									name="folderNumber"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									type="number"
									label={t("legalDocs:request.search.processNumber")}
									name="processNumber"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("legalDocs:request.search.requestType")}
									name="legalDocumentRequestTypeId"
									options={legalDocsRequestTypesOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("legalDocs:request.search.coverage")}
									name="coverage"
									options={coveragesAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("legalDocs:request.search.status")}
									name="requestStatus"
									options={[
										{ label: t('legalDocs:requestStatus.allRequestLegalDocuments'), value: -1 },
										{ label: t('legalDocs:requestStatus.cancelled'), value: LegalDocumentRequestStatusEnum.Cancelled },
										{ label: t('legalDocs:requestStatus.finished'), value: LegalDocumentRequestStatusEnum.Finished },
										{ label: t('legalDocs:requestStatus.disapproved'), value: LegalDocumentRequestStatusEnum.Disapproved },
									]}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name='internalLawyerId'
									label={t('solicitacaoPagamento:dadosPagamento.advogadoInterno')}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									label={t('provisions:fields.legalResponsible')}
									name="legalResponsibleId"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.LegalResponsible}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('provisions:fields.office')}
									name="office"
									options={groupedAreasByIdAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name='serviceUserId'
									label={t('legalDocs:request.search.attendant')}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<DateField
											name="expectedServiceDateStart"
											label={t("legalDocs:request.search.termOfService.from")}
											placeholder={t("legalDocs:request.placeholder.select")}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<DateField
											name="expectedServiceDateEnd"
											label={t("legalDocs:request.search.termOfService.to")}
											placeholder={t("legalDocs:request.placeholder.select")}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name="conclusionDate"
									label={t("legalDocs:request.search.seviceDate")}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit
									type="search"
									submitting={loading || isSubmitting}
									disabled={!dirty}
								/>
							</Grid>
						</Grid>
						<Clean action="officeManagementPayment" />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
