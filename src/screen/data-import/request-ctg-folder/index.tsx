import {
	ChangeEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Box, Grid } from "@material-ui/core";
import { FormLabel } from "@mui/material";
import FileSaver from "file-saver";
import { useSnackbar } from "notistack";
import { convertToBlob, rejectNoValues } from 'src/core/utils/func';

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import {
	SelectField,
	DateField,
	TOptionsSelect,
	CostCenterField,
	CurrencyField,
	RadioGroup,
} from "src/components/form";
import UploadFileButton from "src/components/form/Upload/UploadButton";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { useTranslation } from "src/locale/i18n";
import { Clean, Submit } from "src/components/button";
import ContactField from "src/components/ContactField";
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";
import {
	generateRequestCTGFolderCsv,
	importSingleFileRequestCtg,
} from "src/core/store/modules/data-import/thunk";
import { processTypeOptions } from "src/core/utils/constants";
import {
	TRequestCTGFolderFilterForm,
	SINGLE_FILE_TYPE,
} from "src/core/models/data-import";
import { convertToBlobCSV, convertToJson, toNumber } from "src/core/utils/func";
import CTGOption from "src/screen/data-import/components/CTGOption";

import useEmitSnackbarStatus from "../hooks/useEmitSnackbarStatus";
import ImportErrorsList from "../components/ImportErrors";
import {
	useFormulaCorrectionRule,
	useGroupedAreas,
} from "src/hooks/fetchLists";
import useProvisionFilterOptions from "src/hooks/useProvisionFilterOptions";
import { valuesToNumber } from "src/core/utils/func";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";
import { useHistory } from "react-router-dom";


const initialValues: TRequestCTGFolderFilterForm = {
	folders: "",
	originAreaIds: [],
	legalDepartmentAreaIds: [],
	litigationRelationship: 1,
	mainCompany: "",
	distributionDateStart: null,
	distributionDateEnd: null,
	creationDateStart: null,
	creationDateEnd: null,
	complementaryRegistrationStart: null,
	complementaryRegistrationEnd: null,
	terminationDateStart: null,
	terminationDateEnd: null,
	closingDateStart: null,
	closingDateEnd: null,
	contingency: "",
	statusIds: [1],
	type: "",
	agent: "",
	internalLawyer: "",
	legalOfficer: "",
	responsibleAreaIds: [],
	responsibleOfficer: "",
	actionTypeIds: "",
	spheres: [],
	forecastClasses: [],
	closures: "",
	natureId: "",
	costCenter: "",
	orderDescriptionId: [],
	orderExpectationId: [],
	orderStatusId: [],
	/* orderProbabilityId: [], */
	orderRatingDescription: [],
	correctionIndex: [],
	createdDateStart: null,
	createdDateEnd: null,
	riskValueStart: undefined,
	riskValueEnd: undefined,
	orderRatingsValueStart: undefined,
	orderRatingsValueEnd: undefined,
	baseDateStart: null,
	baseDateEnd: null,
	sumProvisionTable: "",
	active: "",
	hasAttachment: "",
	probableValueStart: "",
	probableValueEnd: "",
	possibleValueStart: "",
	possibleValueEnd: "",
	remoteValueStart: "",
	remoteValueEnd: "",
	skipAccounting: false
};

const validate = ({ folders }: any) => {
	if (folders === "" || !!folders.match(/^\d{7}(\/\d{3})?$/))
	return {};
	return { folders: "Deve seguir esse padrão {9999999/999} ou {9999999}"};
};

const ProcessSheetForm = () => {

	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const inputFileRef = useRef<HTMLInputElement>(null);
	const { enqueueSnackbar } = useSnackbar();

	const [isLoading, setLoading] = useState<boolean>(false);
	const [itemCount, setItemCount] = useState<number>(0);
	const [data, setData] = useState<any>();

	const [selectedAreaDeujurIds, setSelectedAreaDejurIds] = useState<(number | "all" | "nil")[]>([]);
	const [startRisk, setStartRisk] = useState("");
	const [skipAccounting, setSkipAccounting] = useState(false)
	const [endRisk, setEndRisk] = useState("");
	const [orderRatingsValueStart, setOrderRatingsValueStart] = useState("");
	const [orderRatingsValueEnd, setOrderRatingsValueEnd] = useState("");

	const {
		spheresOptions,
		closingOptions,
		statusesOptions,
		areasDEJUROptions,
		actionClassesOptions,
		contingenciesOptions,
		areasResponsibleOptions,
		provisionClassesOptions,
		groupedAreasByIdAsOptions,
		natureOptions,
	} = useProcessFilterOptions();

	const { groupedAreasAsOptions } = useGroupedAreas();

	const sortAlphabetic = (input: TOptionsSelect[]) =>
		[...input].sort((a, b) => a.label?.localeCompare(b.label));
	
	const natureOptionsSorted = useMemo(
		() => sortAlphabetic(natureOptions),
		[natureOptions]
	);
	const statusesOptionsSorted = useMemo(
		() => sortAlphabetic(statusesOptions),
		[statusesOptions]
	);
	const processTypeOptionsSorted = useMemo(
		() => sortAlphabetic(processTypeOptions),
		[]
	);

	const actionClassesOptionsSorted = useMemo(
		() => sortAlphabetic(actionClassesOptions),
		[actionClassesOptions]
	);
	const spheresOptionsSorted = useMemo(
		() => sortAlphabetic(spheresOptions),
		[spheresOptions]
	).filter((sphere) => sphere.label !== "" && sphere.label !== null);
	const provisionClassesOptionsSorted = useMemo(
		() => sortAlphabetic(provisionClassesOptions),
		[provisionClassesOptions]
	);
	const closingOptionsSorted = useMemo(
		() => sortAlphabetic(closingOptions),
		[closingOptions]
	);

	useEmitSnackbarStatus(true);

	const handleAreaDejurChange = (event: ChangeEvent<{ value: number[] }>) => {
		setSelectedAreaDejurIds(event.target.value)
	}

	const onSubmit = useCallback(
		async (values, { setSubmitting }) => {
			const normalizeValues = {...(valuesToNumber(
				[
					"baseCalculo",
					"probableValueStart",
					"probableValueEnd",
					"possibleValueStart",
					"possibleValueEnd",
					"remoteValueStart",
					"remoteValueEnd"
				],
				rejectNoValues(values)
			) as any),}
			normalizeValues.riskValueStart = startRisk ? toNumber(startRisk) : undefined;
			normalizeValues.riskValueEnd = endRisk ? toNumber(endRisk) : undefined;

			normalizeValues.orderRatingsValueStart = orderRatingsValueStart
				? toNumber(orderRatingsValueStart)
				: undefined;
				normalizeValues.orderRatingsValueEnd = orderRatingsValueEnd
				? toNumber(orderRatingsValueEnd)
				: undefined;

			if (
				normalizeValues.folders &&
				normalizeValues.folders !== "" &&
				typeof normalizeValues.folders === "string"
			)
			normalizeValues.folders = normalizeValues.folders.split(";");
			delete normalizeValues.skipAccounting
			setLoading(true);

			const { payload, type } = (await dispatch(generateRequestCTGFolderCsv(normalizeValues))) as any;
			setLoading(false);
			//VERIFICAR
			/* setItemCount(convertToJson(payload).length - 1); */

			if (type === "data-import-request-ctg-folder/csv/rejected") {
				setSubmitting(false);
				enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
				return;
			}

			FileSaver.saveAs(convertToBlob(payload), 'pedidos_pasta_ctg_template')
			
	
			setSubmitting(false);
			/* history.push(`/carga-de-dados/monitor-de-execucao`); */
		},
		[
			dispatch,
			endRisk,
			enqueueSnackbar,
			orderRatingsValueEnd,
			orderRatingsValueStart,
			startRisk,
			t,
		]
	);

	const isValidFile = (files: FileList | null): boolean => {
		return !!files?.length && files[0].name.split(".").pop() === "csv";
	};

	const onRadioButtonChanged = (
		value: number | string | boolean,
		
	) => {
		setSkipAccounting(value as boolean)
	};

	const handleChange = async (event: ChangeEvent) => {
		const file = inputFileRef.current?.files;
		setLoading(true);

		if (file) {

			const {payload, meta} = await dispatch(
				importSingleFileRequestCtg({
					file: file,
					skipAccounting: skipAccounting,
				})
			) as any;
			
			setData(payload);

			if(meta?.requestStatus === "fulfilled"){
				enqueueSnackbar(
					`${payload}`,
					{ variant: "success" }
				)
				history.push("/carga-de-dados/monitor-de-execucao");
			}
		}
		handleClearImportFile();
	};

	const handleClearImportFile = useCallback(() => {
		if (inputFileRef.current) inputFileRef.current.value = "";
		setLoading(false);
		setItemCount(0);
		handleCleanOnClick();
		setSelectedAreaDejurIds([]);
	}, [inputFileRef]);

	const handleChangeCurrencyField =
		(setElement: Dispatch<SetStateAction<string>>) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setElement(event.target.value);
		};

	const {
		orderDescriptionOptions,
		orderExpectationOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions,
		orderStatusOptions,
	} = useProvisionFilterOptions();

	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();

	const filteredOrderDescriptionOptions = useMemo(
		() => {
			if (selectedAreaDeujurIds.length === 0
				|| selectedAreaDeujurIds.includes('nil')
				|| selectedAreaDeujurIds.includes('all')
			)
				return orderDescriptionOptions
			return orderDescriptionOptions.filter(option => selectedAreaDeujurIds.includes(option.areaId as number))
	}, [selectedAreaDeujurIds, orderDescriptionOptions])

	const handleCleanOnClick = () => {
		setStartRisk("");
		setEndRisk("");
		setOrderRatingsValueStart("");
		setOrderRatingsValueEnd("");
	};

	const provisionTableSumOptions = [
		{ label: "Sim", value: "true" },
		{ label: "Não", value: "false" },
	];

	const EnableDisableOptions = [
		{ label: "Ativo", value: "true" },
		{ label: "Inativo", value: "false" },
	];
	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				enableReinitialize
			>
				{({ values, handleSubmit, isValid }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<Panel
							title={t("dataImport:requestCtgFolder.filter.title")}
							withPadding
						>
							<Grid container spacing={3}>
								<CTGOption />
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.mainCompany")}
										name="mainCompany"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.COMPANY}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("dataImport:requestCtgFolder.filter.originArea")}
										name="originAreaIds"
										options={groupedAreasAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("dataImport:requestCtgFolder.filter.dejurArea")}
										name="legalDepartmentAreaIds"
										options={groupedAreasAsOptions}
										onChange={handleAreaDejurChange}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.nature")}
										name="natureId"
										options={natureOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.judgementDate")}
												name="distributionDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.to")}
												name="distributionDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.registrationDate")}
												name="creationDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.to")}
												name="creationDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.registerCompDate")}
												name="complementaryRegistrationStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.to")}
												name="complementaryRegistrationEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.dischargeDate")}
												name="closingDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.to")}
												name="closingDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.closingDate")}
												name="terminationDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.filter.to")}
												name="terminationDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.contingencyType")}
										name="contingency"
										options={contingenciesOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										multiple
										label={t("dataImport:requestCtgFolder.filter.processStatus")}
										name="statusIds"
										options={statusesOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.type")}
										name="type"
										options={processTypeOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.agent")}
										name="agent"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.internalLawyer")}
										name="internalLawyer"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t("dataImport:requestCtgFolder.filter.legalResponsible")}
										name="legalOfficer"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={t("dataImport:requestCtgFolder.filter.responsibleArea")}
										name="responsibleAreaIds"
										options={groupedAreasByIdAsOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										disabled={values?.responsibleAreaIds?.length === 0}
										label={t("dataImport:requestCtgFolder.filter.responsibleAreaResponsible")}
										name="responsibleOfficer"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.OfficeResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.actionClass")}
										name="actionTypeIds"
										options={actionClassesOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										multiple
										label={t("dataImport:requestCtgFolder.filter.sphere")}
										name="spheres"
										options={spheresOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										multiple
										label={t("dataImport:requestCtgFolder.filter.provisionClass")}
										name="forecastClasses"
										options={provisionClassesOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.filter.closing")}
										name="closures"
										options={closingOptionsSorted}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CostCenterField
										label={t("dataImport:requestCtgFolder.filter.costCenter")}
										name="costCenter"
									/>
								</Grid>
							</Grid>
							<FormLabel
								style={{
									fontWeight: "bold",
									display: "flex",
									margin: "3% 3% 0 1.5%",
								}}
							>
								{t("dataImport:common.itemListCount")} {itemCount}
							</FormLabel>
						</Panel>
						<Panel
							title={t("dataImport:requestCtgFolder.provisionRequestFilter.title")}
							withPadding
						>
							<Grid container spacing={2}>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.requestDescription")}
										name="orderDescriptionId"
										multiple
										options={filteredOrderDescriptionOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.orderDateFrom")}
												name="createdDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="createdDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.expectation")}
										multiple
										name="orderExpectationId"
										options={orderExpectationOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.status")}
										name="orderStatusId"
										multiple
										options={orderStatusOptions}
									/>
								</Grid>
								{/* <Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.probability")}
										name="orderProbabilityId"
										multiple
										options={orderProbabilityOptions}
									/>
								</Grid> */}
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.openingDescription")}
										name="orderRatingDescription"
										multiple
										options={orderRatingDescriptionOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.forecastValueFrom")}
												name="startRisk"
												value={startRisk}
												onChange={handleChangeCurrencyField(setStartRisk)}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="endRisk"
												value={endRisk}
												onChange={handleChangeCurrencyField(setEndRisk)}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={"Valor Provável de"}
												name="probableValueStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="probableValueEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={"Valor Possível de"}
												name="possibleValueStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="possibleValueEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={"Valor Remoto de"}
												name="remoteValueStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="remoteValueEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.baseDateFrom")}
												name="baseDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("dataImport:requestCtgFolder.provisionRequestFilter.to")}
												name="baseDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.correctionIndex")}
										name="correctionIndex"
										multiple
										options={formulaCorrectionRuleAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.sumProvisionTable")}
										name="sumProvisionTable"
										options={provisionTableSumOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("dataImport:requestCtgFolder.provisionRequestFilter.enableDisable")}
										name="active"
										options={EnableDisableOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Possui anexo?"}
										name="hasAttachment"
										options={provisionTableSumOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<RadioGroup
										isDeselectable
										label={"Pular contabilizar?"}
										name="skipAccounting"
										onChange={(value) =>
											onRadioButtonChanged(value)
										}
									/>
								</Grid>
								<Grid container item justifyContent="flex-start">
									<Clean action="dataImport" onClick={handleClearImportFile} />
								</Grid>
							</Grid>
						</Panel>
						<Box display="flex" justifyContent="flex-end" mt={3}>
							<UploadFileButton
								variant="contained"
								color="primary"
								text={t("dataImport:common.importSpreadsheet")}
								onChange={handleChange}
								inputRef={inputFileRef}
								disabled={isLoading}
								style={{ marginRight: "24px" }}
								clearInputFilesOnChange={false}
								accept=".xlsx"
							/>
							<Submit
								disabled={!isValid}
								submitting={isLoading}
								text={t("dataImport:common.generateSpreadsheet")}
							/>
						</Box>
					</form>
				)}
			</Formik>
			<ImportErrorsList response={data} />
		</ScreenTemplate>
	);
};

export default ProcessSheetForm;