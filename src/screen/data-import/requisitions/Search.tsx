import { Grid } from "@material-ui/core";
import { Formik } from "formik";
import { MutableRefObject, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ContactFieldMultiple from "src/components/ContactFieldMultiple";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";
import Panel from "src/components/Panel";
import { Clean, Submit } from "src/components/button";
import {
	DateField,
	NumericField,
	SelectField,
	TOptionsSelect,
	TextField,
} from "src/components/form";
import AutocompleteMultipleField from "src/components/form/AutocompleteMultipleField";
import {
	FOLDER_OPTIONS,
	TDataImportRequestFilter,
} from "src/core/models/data-import";
import { actions } from "src/core/store";
import { getRequestParametersAsOptions } from "src/core/store/modules/request-parameters/selectors";
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";
import { useGroupedAreas, useUsersActives } from "src/hooks/fetchLists";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { useTranslation } from "src/locale/i18n";
import UserSearchComponent from "src/screen/requisitions/components/UserSearchComponent";
import { statusTextAsOptions } from "src/screen/requisitions/constants";
import { optionsFolderStatus } from "src/screen/settings/constants";

type TRequestForm = {
	loading?: boolean;
	formRef: MutableRefObject<any>;
	firstLoad?: any;
};

const folderOption = [
	{ label: "Principal", value: FOLDER_OPTIONS.MAIN },
	{ label: "Todas", value: FOLDER_OPTIONS.ALL },
	{ label: "Vinculada", value: FOLDER_OPTIONS.LINKED },
];

const validate = ({ folderNumbers }: any) => {
	if (folderNumbers === "" || !!folderNumbers.match(/^\d{7}(\/\d{3})?$/))
		return {};
	return { folderNumbers: "Deve seguir esse padrão {9999999/999} ou {9999999}"};
};

const Search = ({ formRef, loading, firstLoad }: TRequestForm) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		location: { pathname },
	} = useHistory();

	const sortAlphabetic = (input: TOptionsSelect[]) =>
		[...input].sort((a, b) => a.label?.localeCompare(b.label));

	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions);
	const { usersActivesAsOptionsById } = useUsersActives();

	const { groupedAreasAsOptions } = useGroupedAreas();
	
	const { contingenciesOptions, groupedAreasByIdAsOptions } =
		useProcessFilterOptions();
	

	const statusTextOptions = useMemo(
		() =>
			statusTextAsOptions
				.slice()
				.sort((x, y) => x.label.localeCompare(y.label)),
		[]
	);

	const clearList = () => {
		dispatch(actions.dataImport.clear());
	};

	const onSubmit = useCallback(
		(values, { setSubmitting }) => {
			firstLoad(false)
			const normalize = {
				...values,
				folderNumbers: values.folderNumbers
					? [values.folderNumbers]
					: null,
			};

			dispatch(
				actions.dataImport.setFilters({
					filters: normalize,
					page: pathname,
				})
			);
			setSubmitting(false);
		},
		[dispatch, firstLoad, pathname]
	);

	const initialValues = useMemo<TDataImportRequestFilter>(
		() => ({
			id: "",
			requestDateBegin: null,
			requestDateEnd: null,
			expectedServiceDate: null,
			conclusionDateBegin: null,
			conclusionDateEnd: null,
			requestParameterIds: [],
			requestStatusIds: [],
			requesterIds: [],
			administrativeControlResponsiblesIds: [],
			serviceUserIds: [],
			legalDepartmentAreaIds: [],
			folderNumbers: "",
			litigationRelationship: "",
			statusIds: [],
			contingencies: [],
			otherPartyIds: [],
			internalLawyerIds: [],
			agentIds: [],
			legalOfficerIds: [],
			responsibleAreaIds: [],
			responsibleOfficeIds: [],
		}),
		[]
	);

	return (
		<Panel title={t("dataImport:requisitions.title")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				innerRef={formRef}
				validate={validate}
				enableReinitialize
			>
				{({ values, handleSubmit, dirty, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={3}>
								<NumericField name="id" label={"Id da Requisição"} />
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("dataImport:officeManager.filters.startSolicitationDate")}
											name="requestDateBegin"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("default:form.to")}
											name="requestDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name="expectedServiceDate"
									label={t("requisitions:form.expectedServiceDate")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("dataImport:officeManager.filters.startConclusionDate")}
											name="conclusionDateBegin"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("default:form.to")}
											name="conclusionDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("requisitions:form.requisitionType")}
									name="requestParameterIds"
									options={requisitionTypesOptions ?? []}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("dataImport:requestCtgFolder.filter.status")}
									name="requestStatusIds"
									options={statusTextOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<AutocompleteMultipleField
									label={t("requisitions:form.requester")}
									name="requesterIds"
									options={usersActivesAsOptionsById}
									limitTags={1}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent
									label={"Nome responsável atendimento"}
									name="administrativeControlResponsiblesIds"
									isMultiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent
									label={t("reports:legalDocument.service.attendant")}
									name="serviceUserIds"
									isMultiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t("dataImport:requestCtgFolder.filter.dejurArea")}
									name="legalDepartmentAreaIds"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									name="folderNumbers"
									label={t("dataImport:documents.form.foldersNumber")}
									maxLength={11}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									options={folderOption}
									label={"Tipo da pasta"}
									name="litigationRelationship"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:equalizationParameters.form.folderStatus")}
									name="statusIds"
									options={optionsFolderStatus}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("dataImport:requestCtgFolder.filter.contingencyType")}
									name="contingencies"
									options={contingenciesOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={10} md={5} lg={3}>
								<ContactFieldMultiple
									name="otherPartyIds"
									label={t("calculations:filter.oppositePart")}
									setInvalidValueWhenTyping
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactFieldMultiple
									label={t("dataImport:requestCtgFolder.filter.internalLawyer")}
									name="internalLawyerIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactFieldMultiple
									label={t("dataImport:requestCtgFolder.filter.agent")}
									name="agentIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactFieldMultiple
									label={t("dataImport:requestCtgFolder.filter.legalResponsible")}
									name="legalOfficerIds"
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={"Escritório"}
									name="responsibleAreaIds"
									options={groupedAreasByIdAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactFieldMultiple
									disabled={values?.responsibleAreaIds?.length === 0}
									label={t("dataImport:requestCtgFolder.filter.responsibleAreaResponsible")}
									name="responsibleOfficeIds"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.OfficeResponsible}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean
									onClick={clearList}
									action="dataImport"
									page={pathname}
								/>
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit
									type="search"
									disabled={!dirty || loading}
									submitting={loading || isSubmitting}
								/>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
