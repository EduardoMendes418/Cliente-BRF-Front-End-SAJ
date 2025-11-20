import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
import { Formik } from "formik";
import FileSaver from "file-saver";

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import ContactField from "src/components/ContactField";
import {
	SelectField,
	DateField,
	TOptionsSelect,
	TextField,
	AutocompleteField,
} from "src/components/form";

import { Clean, Submit } from "src/components/button";

import { useTranslation } from "src/locale/i18n";

import { CONTACT_SEARCH, CONTACT_TYPE, statusApprovalsOptions, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";

import {
	FOLDER_OPTIONS,

	TDataImportMultipleFilesForm,
} from "src/core/models/data-import";

import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import {
	useGroupedAreas,
	usePaymentType,
	useUsersActives,
} from "src/hooks/fetchLists";

import {
	generateRequestCsv2,
	generateRequestFilter,
} from "src/core/store/modules/data-import/thunk";
import { getDataImportList } from "src/core/store/modules/data-import/selectors";
import Form from "src/screen/data-import/components/FormImportMultipleAttachments";

import { TDataImport } from "src/core/models/data-import";
import { importMultipleFiles } from "src/core/store/modules/data-import/thunk";

import { TProps } from "./types";
import { optionsFolderStatus } from "src/screen/settings/constants";
import { Modulos } from "src/core/models/modules";
import DataImportMultipleFilesList from "./DataImportMultipleFilesList";
import { usePagination } from "src/hooks/pagination";
import { statusOptions } from "src/screen/credit-receipt/constants";
import { convertToBlob, convertToBlobCSV } from "src/core/utils/func";
import { actions, AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import * as yup from 'yup';
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const folderOption = [
	{ label: "Principal", value: FOLDER_OPTIONS.MAIN },
	{ label: "Todas", value: FOLDER_OPTIONS.ALL },
	{ label: "Vinculada", value: FOLDER_OPTIONS.LINKED },
];

const validationSchema = yup.object({
	ids: yup.string().matches(
		/^\d+(?:;?\d+)*$/, "A pesquisa deve seguir o padrão de ID's separados por ponto-e-vírgula").notRequired()});

const validate = ({ folderNumber }: any) => {
	if (folderNumber === "" || !!folderNumber.match(/^\d{7}(\/\d{3})?$/))
		return {};
	return { folderNumber: "Deve seguir esse padrão {9999999/999} ou {9999999}"};

};

const DataImportMultipleFilesForm = ({ type, ...props }: TProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	
	const options = useProcessFilterOptions();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	const { areasDEJUROptions } = options;

	const { groupedAreasAsOptions } = useGroupedAreas();

	const { usersActivesAsOptionsById } = useUsersActives();

	const inputFileRef = useRef<HTMLInputElement>(null);
	const {
		location: { pathname },
	} = useHistory();
	const [data, setData] = useState<TDataImportMultipleFilesForm>();

	const [isLoading, setLoading] = useState<boolean>(false);
	const [filters, setFilters] = useState<TDataImportMultipleFilesForm>();

	const { page, pageSize } = usePagination();
	const list = useSelector(getDataImportList);

	const { contingenciesOptions, groupedAreasByIdAsOptions } =
		useProcessFilterOptions();
	
	const onSubmit = useCallback(
		(values: TDataImportMultipleFilesForm, { setSubmitting }) => {
			if(values.ids.length > 0){
				const valuesToSend = {
					...values,
					ids: values.ids.split(";")
				}
				setLoading(true);
				setFilters(valuesToSend);
				setSubmitting(false);
				return
			}
			if (values !== filters) {
				setLoading(true);
				setFilters(values);
				setSubmitting(false);
			}
		},
		[filters]
	);

	const onGenerateCsv2 = async (values: any) => {

		setLoading(true);
		const { payload } = (await dispatch(generateRequestCsv2(values))) as any;

		FileSaver.saveAs(
			convertToBlob(payload),
			"relatório-de-recebimento-de-crédito"
		);
		setLoading(false);
	};

	const handleClearImportFile = useCallback(() => {
		if (inputFileRef.current) inputFileRef.current.value = "";
		dispatch(actions.dataImport.clear());
		setFilters(undefined);
		setLoading(false);
	}, [dispatch]);

	const onFormSubmit = async (values: TDataImport) => {
		const { payload, meta } = await dispatch(
			importMultipleFiles({ type, ...values })
		);

		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.detail, { variant: "error" });
			values.formFile = [];
			values.formFileAnexos = [];

		} else {
			enqueueSnackbar(t("dataImport:importErrors.importSuccess"), {
				variant: "success",
			});
			values.formFile = [];
			values.formFileAnexos = [];
			history.push(`/carga-de-dados/monitor-de-execucao`);
		}
	};

	const initialValues: any = useMemo(
		() => ({
			originAreaIds: [],
			RequestDateBegin: null,
			RequestDateEnd: null,
			EvaluatorDateBegin: null,
			EvaluatorDateEnd: null,
			evaluatorWriteOffDateBegin: null,
			evaluatorWriteOffDateEnd: null,
			Id: "",
			Contingencies: [],
			LegalDepartmentAreaIds: [],
			RequesterIds: [],
			PaymentTypeIds: [],
			StatusFlowId: [],
			AdministrativeControlResponsiblesIds: [],
			folderNumber: "",
			LitigationRelationship: 0,
			StatusIds: [],
			LegalOfficerIds: [],
			InternalLawyerIds: "",
			EvaluatorAccount: "",
			AgentIds: [],
			ResponsibleAreaIds: [],
			ProcessNumber: "",
			ResponsibleOfficeIds: [],
			OtherPartyIds: [],
			responsibleUsers: [],
			notPaginate: true,
			sapRequestDateBegin: null,
			sapRequestDateEnd: null,
			statusApprovalId: "",
			ids: "",
			page: 1,
			pageSize: 30,
		}),
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			dispatch(generateRequestFilter({ ...filters, page, pageSize }));
			setLoading(false);
		};

		if (filters !== undefined) fetchData();
	}, [dispatch, filters, page, pageSize]);

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				validationSchema={validationSchema}
				enableReinitialize
			>
				{({ handleSubmit, isValid, values }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						{setData(values)}
						<Panel
							title={t("dataImport:requestCtgFolder.filter.title") + ""}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("dataImport:processSheet.form.originArea")}
										name="originAreaIds"
										options={groupedAreasAsOptions}
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
										name="folderNumber"
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
								<Grid item xs={10} md={5} lg={3}>
									<ContactField
										name="OtherPartyIds"
										label={t("calculations:filter.oppositePart")}
										setInvalidValueWhenTyping
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										name="ProcessNumber"
										label={t("dataImport:officeManager.filters.requestId")}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t(
											"dataImport:requestCtgFolder.filter.contingencyType"
										)}
										name="Contingencies"
										options={contingenciesOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.internalLawyer")}
										name="InternalLawyerIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.InternalLawyer}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.agent")}
										name="AgentIds"
										contactSearch={CONTACT_SEARCH.Agent}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.legalResponsible")}
										name="LegalOfficerIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.LegalResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={t("dataImport:requestCtgFolder.filter.responsibleArea")}
										name="ResponsibleAreaIds"
										options={groupedAreasByIdAsOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.responsibleAreaResponsible")}
										name="ResponsibleOfficeIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.OfficeResponsible}
									/>
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
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("reports:guarantees.evaluator.form.valuationDateInitial")}
												name="EvaluatorDateBegin"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("reports:common.form.until")}
												name="EvaluatorDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("reports:guarantees.form.writeOffDateInitial")}
												name="evaluatorWriteOffDateBegin"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("reports:common.form.until")}
												name="evaluatorWriteOffDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<AutocompleteField
										name="RequesterIds"
										label={t("dataImport:officeManager.filters.createdBy")}
										options={usersActivesAsOptionsById}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										options={paymentTypeAsOptions}
										label={"Tipo pagamento"}
										name="PaymentTypeIds"
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Status do recebimento"}
										name="StatusFlowId"
										options={statusOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField name="EvaluatorAccount" label={"Conta banco"} />
								</Grid>								
								<Grid item xs={12} md={3}>
									<SelectField
										name='statusApprovalId'
										label={t('creditReceipt:form.statusApprovalId')}
										options={statusApprovalsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:creditReceipt.sapRequestDateBegin")}
												name="sapRequestDateBegin"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("reports:common.form.until")}
												name="sapRequestDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name="ids"
										label={"ID do recebimento de crédito"}
										helperText={t("dataImport:goodsAndGuarantees.search.idHelperText")}
									/>
								</Grid>
								<Grid container item justifyContent="flex-start">
									<Clean action="dataImport" onClick={handleClearImportFile} />
								</Grid>
							</Grid>
						</Panel>

						<Box display="flex" justifyContent="flex-end" mt={3}>
							{pathname !== "/carga-de-dados/requisicoes" ? (
								<>
									<Grid
										item
										md={6}
										xs={6}
										style={{ textAlign: "right", marginRight: "1%" }}
									>
										<Submit
											type="search"
											disabled={!isValid}
											submitting={isLoading}
										/>
									</Grid>
								</>
							) : null}
						</Box>

						<DataImportMultipleFilesList loading={isLoading} list={list} />
					</form>
				)}
			</Formik>
			{isLoading === true ? <Box display='flex' justifyContent='flex-end' paddingTop={3}>
			<CircularProgress/>
			</Box>  :
			<Form
			{...props}
			filters={filters}
			onSubmit={onFormSubmit}
			accept=".xlsx"
			button={
				<Button
					color="primary"
					variant="contained"
					onClick={() => onGenerateCsv2(data)}
				>
					{t("dataImport:common.generateSpreadsheet")}
				</Button>
			}
		/>
			}
			
		</ScreenTemplate>
	);
};

export default DataImportMultipleFilesForm;
