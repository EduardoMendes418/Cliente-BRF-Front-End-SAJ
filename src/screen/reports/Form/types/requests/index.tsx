import { MULTIPLE_FILES_TYPE } from "src/core/models/data-import";
import { useHistory } from "react-router-dom";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import FileSaver from "file-saver";
import { Button } from "@material-ui/core";

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import {
	SelectField,
	DateField,
	TOptionsSelect,
	NumericField,
	TextField,
} from "src/components/form";
import { FormLabel } from "@mui/material";

import { Clean } from "src/components/button";

import { useTranslation } from "src/locale/i18n";

import { CONTACT_SEARCH, CONTACT_TYPE, ENVOLVED_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";

import {
	FOLDER_OPTIONS,
	TDataImportMultipleFilesForm,
} from "src/core/models/data-import";

import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { useGroupedAreas, useGroupedAreasById, useUsersActives } from "src/hooks/fetchLists";
import { useSnackbar } from 'notistack';

import { generateRequestXlsx } from "src/core/store/modules/data-import/thunk";

import { actions, AppDispatch } from "src/core/store";

import { TProps } from "src/screen/data-import/components/types";
import { optionsFolderStatus } from "src/screen/settings/constants";
import { statusTextAsOptions } from "src/screen/requisitions/constants";
import { getRequestParametersAsOptions } from "src/core/store/modules/request-parameters/selectors";
import { fetchRequestParameters } from "src/core/store/modules/request-parameters/thunks";
import Form from "src/screen/data-import/components/FormImportMultipleAttachments";

import { TDataImport } from "src/core/models/data-import";
import { importMultipleFiles } from "src/core/store/modules/data-import/thunk";

import { generateRequestCsv } from "src/core/store/modules/data-import/thunk";
import UserSearchComponent from "src/screen/requisitions/components/UserSearchComponent";
import AutocompleteMultipleField from "src/components/form/AutocompleteMultipleField";
import ContactFieldMultiple from "src/components/ContactFieldMultiple";
import { envolvedTypeEnumOptions } from "src/core/models/contacts";
import { exportRequestReportExcelFile } from "src/core/store/modules/report/thunks"
import { getStatusReports, getErrorReports } from "src/core/store/modules/report/selectors"
import { useHandleRequestError } from 'src/hooks';
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

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

const ReportRequisitions = ({
	type = MULTIPLE_FILES_TYPE.REQUISITIONS,
}: TProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory();

	const [itemCount, setItemCount] = useState<number>(0);
	const { usersActivesAsOptionsById } = useUsersActives();
	const inputFileRef = useRef<HTMLInputElement>(null);
	const {
		location: { pathname },
	} = useHistory();
	const isRequests = pathname === "/relatorios/requisicoes" 

	const [data, setData] = useState<TDataImportMultipleFilesForm>();

	const [isLoading, setLoading] = useState<boolean>(false);

	const { contingenciesOptions } = useProcessFilterOptions();

	const { groupedAreasByIdAsOptions } = useGroupedAreasById();

	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions);

	const { groupedAreasAsOptions } = useGroupedAreas();
	const { showRequestError } = useHandleRequestError()

	const status = useSelector(getStatusReports);
	const error = useSelector(getErrorReports) as any;

	const sortAlphabetic = (input: TOptionsSelect[]) =>
		[...input].sort((a, b) => a.label?.localeCompare(b.label));

	

	useEffect(() => {
		dispatch(fetchRequestParameters({ notPaginate: true, OrderById: true}));
	}, [dispatch]);

	useEffect(() => {
		if(isRequests === true) return;
		if (status === "failure") {
			showRequestError(error)
		}
		if (status === "added") {
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		}
	}, [status, error, enqueueSnackbar, history, showRequestError])

	const onSubmit = useCallback(
		async (values: TDataImportMultipleFilesForm, { setSubmitting }) => {
			if (values.folderNumbers && typeof values.folderNumbers === "string") {
				const folder = values.folderNumbers as string;
				values.folderNumbers = folder.split(";");
			}
			setLoading(true);
		
			const { payload } = (await dispatch(generateRequestXlsx(values))) as any;
			setItemCount(payload.itemCount)
			setLoading(false);

			FileSaver.saveAs(payload.data as Blob, "relatório-de-requisições.xlsx");
			setSubmitting(false);
		},

		[dispatch]
	);

	const initialValues: any = useMemo(
		() => ({
			RequestDateBegin: null,
			RequestDateEnd: null,
			ConclusionDateBegin: null,
			ConclusionDateEnd: null,
			ExpectedServiceDate: null,
			Id: "",
			RequestStatusIds: [],
			RequestParameterIds: [],
			Contingencies: [],
			LegalDepartmentAreaIds: [],
			RequesterIds: [],
			AdministrativeControlResponsiblesIds: [],
			ServiceUserIds: [],
			folderNumbers: "",
			LitigationRelationship: pathname === "/carga-de-dados/requisicoes/new" ? 1 : null,
			StatusIds: [],
			LegalOfficerIds: [],
			InternalLawyerIds: [],
			AgentIds: [],
			responsibleAreaIds: [],
			responsibleOfficeIds: [],
			OtherPartyIds: [],
			otherPartyInvolved: ENVOLVED_TYPE.MAIN,
			notPaginate: true,
			page: 1,
			pageSize: 30,
		}),
		[pathname]
	);

	const handleClearImportFile = useCallback(() => {
		if (inputFileRef.current) inputFileRef.current.value = "";
		setItemCount(0);
		setLoading(false);
	}, [inputFileRef]);

	const onGenerateCsv = async (values: TDataImportMultipleFilesForm) => {
		if (values.folderNumbers && typeof values.folderNumbers === "string") {
			const folder = values.folderNumbers as string;
			values.folderNumbers = folder.split(";");
		}
		setLoading(true);
		
		if (isRequests) {
			await dispatch(exportRequestReportExcelFile(values))
			window.open("/relatorios/gerados", "_blank")?.focus();
			setLoading(false)
			return null
		}
		try {
			const { payload, type } = (await dispatch(generateRequestCsv({
				...values, 
			}))) as any;
			setLoading(false);
			setItemCount(payload.itemCount)
			
			if (type === "data-import/request-get-report/rejected") throw new Error("");

			FileSaver.saveAs(payload.data as Blob, 
				"carga-requisicoes-template.csv"
			);
		} catch (error) {
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
		}
		
	};

	const onFormSubmit = async (values: TDataImport) => {
		const { payload, meta } = await dispatch(importMultipleFiles({ type, ...values }));

		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.detail, { variant: 'error' })
		} else {
			enqueueSnackbar(t("dataImport:importErrors.importSuccess", { variant: 'error' }))
		}
	};

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				enableReinitialize
			>
				{({ handleSubmit, values }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						{setData(values)}
						<Panel title={"Filtro dados de Requisição"} withPadding>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<NumericField name="Id" label={"Id da Requisição"} />
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:officeManager.filters.startSolicitationDate")}
												name="RequestDateBegin"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("default:form.to")}
												name="RequestDateEnd"
											/>
										</Grid>
									</Grid>
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
												name="ConclusionDateBegin"
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
										name="RequestParameterIds"
										options={requisitionTypesOptions ?? []}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.status")}
										name="RequestStatusIds"
										options={statusTextAsOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<AutocompleteMultipleField
										label={t("requisitions:form.requester")}
										name="RequesterIds"
										options={usersActivesAsOptionsById}
										limitTags={1}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<UserSearchComponent
										label={"Nome responsável atendimento"}
										name="AdministrativeControlResponsiblesIds"
										isMultiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<UserSearchComponent
										label={t("reports:legalDocument.service.attendant")}
										name="ServiceUserIds"
										isMultiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("dataImport:requestCtgFolder.filter.dejurArea")}
										name="LegalDepartmentAreaIds"
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
										label={t("dataImport:documents.form.folderOptions")}
										name="LitigationRelationship"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("settings:equalizationParameters.form.folderStatus")}
										name="StatusIds"
										options={optionsFolderStatus}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.contingencyType")}
										name="Contingencies"
										options={contingenciesOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										name="OtherPartyIds"
										label={t("calculations:filter.oppositePart")}
										setInvalidValueWhenTyping
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART} 
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField 
										name="otherPartyInvolved"
										label={t('reports:main.form.oppositePartInvolved')}
										options={envolvedTypeEnumOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("dataImport:requestCtgFolder.filter.internalLawyer")}
										name="InternalLawyerIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER} 
									/>
								</Grid>
								
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("dataImport:requestCtgFolder.filter.legalResponsible")}
										name="LegalOfficerIds"
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
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("dataImport:requestCtgFolder.filter.agent")}
										name="AgentIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT} 
									/>
								</Grid>
								<Grid container item justifyContent="flex-start">
									<Clean action="dataImport" onClick={handleClearImportFile} />
								</Grid>
								{pathname !== "/relatorios/requisicoes" && (
									<FormLabel style={{fontWeight:'bold', display:'flex', margin:'0% 0% 0 1.5%'}}>
										{t('dataImport:common.itemListCount')} {itemCount}
									</FormLabel>
								)}
								<Grid container item justifyContent="flex-end">

									{!isLoading ? <Button
										color="primary"
										variant="contained"
										disabled={isLoading}
										onClick={() => onGenerateCsv(data!)}
									>
										{"Gerar Planilha"}
									</Button> : <CircularProgress />}
								</Grid>
							</Grid>
						</Panel>
					</form>
				)}
			</Formik>

			{pathname !== "/relatorios/requisicoes" ? (
				<>
					<Form
						accept=".csv"
						fileName={"carga-requisicoes-template.csv"}
						labelFormFile={t("dataImport:requisitions.panelImport")}
						labelFileAttachments={t("dataImport:requisitions.panelReceipt")}
						onSubmit={onFormSubmit}
						// button={
						// 	<Button
						// 		color="primary"
						// 		variant="contained"
						// 		onClick={() => onGenerateCsv(data!)}
						// 	>
						// 		{t("dataImport:common.generateSpreadsheet")}
						// 	</Button>
						// }
					/>
				</>
			) : null}
		</ScreenTemplate>
	);
};

export default ReportRequisitions;
