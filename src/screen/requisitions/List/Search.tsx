import { useEffect} from "react";
import { useHistory } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import {
	DateField,
	SelectField,
	NumericField,
	TextField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";

import { getRequestParametersAsOptions } from "src/core/store/modules/request-parameters/selectors";
import { fetchRequestParameters } from "src/core/store/modules/request-parameters/thunks";

import {
	getLoadingRequisitions,
} from "src/core/store/modules/requisitions/selectors";
import { actions } from "src/core/store";
import { TRequisitionsFiltersMultiple } from "src/core/models/requisitions";
import { fetchAreasWitchGroups } from "src/core/store/modules/areas/thunks";
import { useGroupedAreas } from "src/hooks/fetchLists";
import { optionsFolderStatus } from "src/screen/settings/constants";
import UserSearchComponent, {TOptions} from "../components/UserSearchComponent";
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants";
import ContactField from "src/components/ContactField";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const folderOption = [
	{ label: "Todos", value: 0 },
	{ label: "Principal", value: 1 },
	{ label: "Vinculadas", value: 2 },
];

const statusTextAsOptions = [
	{ label: "Atendido", value: 1 },
	{ label: "Cancelado", value: 6 },
	{ label: "Em atendimento", value: 4 },
	{ label: "Pendente", value: 3 },
	{ label: "Reprovado", value: 0 },
	{ label: "Devolvido", value: 7}
];

const validate = ({ folderNumber }: any) => {
	if (folderNumber === "" || !!folderNumber.match(/^\d{7}(\/\d{3})?$/))
		return {};
	return { folderNumber: "Deve seguir esse padrão {9999999/999} ou {9999999}"};
};

export type Props = {
	isService: boolean;
};

const Search = ({ isService }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		location: { pathname },
	} = useHistory();

	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions);

	const loading = useSelector(getLoadingRequisitions);
	const { groupedAreasAsOptions } = useGroupedAreas();
	
	const nameSelectOptions = (values: TOptions) => values.map(x => ({...x, value: x.label}))

	useEffect(() => {
		dispatch(fetchRequestParameters({ notPaginate: true }));
		dispatch(fetchAreasWitchGroups());
	}, [dispatch]);

	const onSubmit = (
		values: TRequisitionsFiltersMultiple,
		{ setSubmitting }: FormikHelpers<TRequisitionsFiltersMultiple>
	) => {
		if (values.responsibleUserId === -1) {
			values.responsibleUserId = [];
			values.filterServiceTeam = true;
		}

		dispatch(
			actions.requisitions.setFilters({ filters: values, page: pathname})
		);
		dispatch(actions.pagination.clear());
		setSubmitting(false);
	};

	const initialValues: TRequisitionsFiltersMultiple = {
		requestDateBegin: null,
		requestDateEnd: null,
		requestDate: null,
		requestUserName: [],
		serviceUserId: [],
		areaId: [],
		id: "",
		requestParameterId: [],
		ExpectedServiceDate: null,
		ConclusionDate: null,
		ConclusionDateEnd: null,
		folderNumber: "",
		status: !isService ? [] : [3, 4],
		responsibleUserId: [],
		filterServiceTeam: false,
		RequestParameterIds: [],
		RequestStatusIds: [],
		AdministrativeControlResponsiblesIds: [],
		LegalDepartmentAreaIds: [],
		folderNumbers: [],
		litigationRelationship: null,
		statusId: [],
		internalLawyer: ""
	};

	useEffect(()=> {
		dispatch(actions.pagination.clear());
	
	}, [])

	return (
		<Panel title={t("requisitions:filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<NumericField
									name="id"
									label={t("dataImport:documents.form.requestId")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name="requestDateBegin"
									label={t("requisitions:form.requestDateBegin")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name="requestDateEnd"
									label={t("requisitions:form.requestDateEnd")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name="ExpectedServiceDate"
									label={t("requisitions:form.expectedServiceDate")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("dataImport:officeManager.filters.startConclusionDate")}
											name="ConclusionDate"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("default:form.to")}
											name="ConclusionDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("requisitions:form.requisitionType")}
									name="requestParameterId"
									options={requisitionTypesOptions ?? []}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("dataImport:requestCtgFolder.filter.status")}
									name="status"
									options={statusTextAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent 
								name="requestUserName" 
								label={t("requisitions:form.requester")} 
								remapping={nameSelectOptions} 
								isMultiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent 
									name="responsibleUserId" 
									label={"Nome responsável atendimento"}
									isMultiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent
									name="serviceUserId" 
									label={t("requisitions:list.serviceUserName")}
									isMultiple 
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t("dataImport:requestCtgFolder.filter.dejurArea")}
									name="areaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									name="folderNumber"
									label={t("dataImport:documents.form.foldersNumber")}
									maxLength={11}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									options={folderOption}
									label={t("dataImport:documents.form.litigationRelationship")}
									name="litigationRelationship"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:equalizationParameters.form.folderStatus")}
									name="statusId"
									options={optionsFolderStatus}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name="internalLawyer"
									label={t(
										"solicitacaoPagamento:dadosPagamento.advogadoInterno"
									)}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean
									action="requisitions"
									page={pathname}
									onClick={() => {
										dispatch(
											actions.requisitions.setFilters({
												filters: { ...initialValues, page: 1 },
											})
										);
										dispatch(actions.pagination.clear());
									}}
								/>
							</Grid>
							
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit
									type="search"
									submitting={loading || isSubmitting}
									disabled={!dirty || loading}
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
