import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { useSnackbar } from "notistack";
import { rejectNoValues } from 'src/core/utils/func';

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import {
	SelectField,
	DateField,
	TextField,
	TOptionsSelect,
	CurrencyField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import {
	useFormulaCorrectionRule,
	useAreasResponsible,
	useGroupedAreas,
	useGroupedAreasById,
} from "src/hooks/fetchLists";
import { generateProvisionReportRequest } from "src/core/store/modules/report/thunks";
import {
	useActionClassesOptions,
	useClosingOptions,
	useContingencyTypeOptions,
	useProvisionClassesOptions,
	useSpheresOptions,
	useStatusProcessOptions,
} from "src/hooks/useProcessFilterOptions";
import { processTypeOptions } from "../utils/constantes";
import {
	ProvisionRequestReportFilter,
	ProvisionRequestReportFilterForm,
} from "src/core/models/provision";
import { AppDispatch } from "src/core/store";
import { t } from "src/locale/i18n";
import CostCenterField from "../components/CostCenterField";
import useProvisionFilterOptions from "src/hooks/useProvisionFilterOptions";
import { toNumber } from "src/core/utils/func";
import { valuesToNumber } from "src/core/utils/func";
import { actions } from 'src/core/store/index';
import { useParams } from 'react-router-dom';
import { getStatusReports, getErrorReports } from "src/core/store/modules/report/selectors"
import { useHandleRequestError } from 'src/hooks';
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";
import ContactFieldMultiple from "src/components/ContactFieldMultiple";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const initialValues: ProvisionRequestReportFilterForm = {
	originAreaId: [],
	legalDepartmentAreaId: [],
	folderNumber: "",
	createdDateStart: null,
	createdDateEnd: null,
	dataComplementoCadastroStart: null,
	dataComplementoCadastroEnd: null,
	contingency: "",
	statusId: [],
	type: "",
	prepostoIds: [],
	internalLawyerIds: [],
	mainResponsibleIds: [],
	responsibleAreaIds: [],
	officeResponsibleIds: [],
	actionTypeId: [],
	provisionClass: [],
	closure: [],
	costCenter: "",
	sphere: [],
	orderDescriptionId: [],
	orderExpectationId: [],
	orderProbabilityId: [],
	orderStatusId: [],
	orderRatingDescription: [],
	riskValueStart: undefined,
	riskValueEnd: undefined,
	baseDateStart: null,
	baseDateEnd: null,
	correctionIndex: [],
	sumProvisionTable: "",
	active: "",
	orderRatingsValueStart: undefined,
	orderRatingsValueEnd: undefined,
	hasAttachment: "",
	probableValueStart: "",
	probableValueEnd: "",
	possibleValueStart: "",
	possibleValueEnd: "",
	remoteValueStart: "",
	remoteValueEnd: "",
};

const provisionTableSumOptions = [
	{ label: "Sim", value: "true" },
	{ label: "Não", value: "false" },
];

const EnableDisableOptions = [
	{ label: "Ativo", value: "true" },
	{ label: "Inativo", value: "false" },
];

const validate = ({ folderNumber }: ProvisionRequestReportFilterForm) => {
	if (folderNumber === "" || !!folderNumber.match(/(^\d)+(;?\d)+$/)) return {};
	return { folderNumber: "Deve seguir esse padrão {999;999}" };
};

export default function ProvisionRequestReport() {
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const filterId = Number(useParams<{ id: string }>().id)

	const [selectedAreaDeujurIds, setSelectedAreaDejurIds] = useState<(number | 'all' | 'nil')[]>([])

	const [startRisk, setStartRisk] = useState('');
	const [endRisk, setEndRisk] = useState('');

	const [orderRatingsValueStart, setOrderRatingsValueStart] = useState('');
	const [orderRatingsValueEnd, setOrderRatingsValueEnd] = useState('');

	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const actionClassesOptions = useActionClassesOptions();
	const closingOptions = useClosingOptions();
	const contingenciesOptions = useContingencyTypeOptions();
	const provisionClassesOptions = useProvisionClassesOptions();
	const spheresOptions = useSpheresOptions();
	const statusesOptions = useStatusProcessOptions();
	const { groupedAreasAsOptions } = useGroupedAreas();
	
	const {
		orderDescriptionOptions,
		orderExpectationOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions,
		orderStatusOptions,
	} = useProvisionFilterOptions();
	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();
	const { showRequestError } = useHandleRequestError();

	const status = useSelector(getStatusReports);
	const error = useSelector(getErrorReports) as any;

	const provisionClassesOptionsSelect = useMemo(
		() =>
			provisionClassesOptions.map(
				(x) =>
					({
						...x,
						value: x.label,
					} as TOptionsSelect)
			),
		[provisionClassesOptions]
	);

	const orderItems = (arr: TOptionsSelect[]) =>
		arr.slice().sort((a, b) => a.label.localeCompare(b.label));
	const statusOrdered = useMemo(
		() => orderItems(statusesOptions),
		[statusesOptions]
	);
	const closeOptionsSorted = useMemo(
		() => orderItems(closingOptions),
		[closingOptions]
	);

	const filteredOrderDescriptionOptions = useMemo(
		() => {
			if (selectedAreaDeujurIds.length === 0
				|| selectedAreaDeujurIds.includes('nil')
				|| selectedAreaDeujurIds.includes('all')
			)
				return orderDescriptionOptions
			return orderDescriptionOptions.filter(option => selectedAreaDeujurIds.includes(option.areaId as number))
	}, [selectedAreaDeujurIds, orderDescriptionOptions])

	const onSubmit = async (
		values: ProvisionRequestReportFilterForm,
		{ setSubmitting }: FormikHelpers<any>
	) => {
		const normalizeValues = {
			...(valuesToNumber(
				[
					"probableValueStart",
					"probableValueEnd",
					"possibleValueStart",
					"possibleValueEnd",
					"remoteValueStart",
					"remoteValueEnd",
				],
				rejectNoValues(values)
			) as any),
		};
		normalizeValues.riskValueStart = startRisk
			? toNumber(startRisk)
			: undefined;
		normalizeValues.riskValueEnd = endRisk ? toNumber(endRisk) : undefined;

		normalizeValues.orderRatingsValueStart = orderRatingsValueStart
			? toNumber(orderRatingsValueStart)
			: undefined;
		normalizeValues.orderRatingsValueEnd = orderRatingsValueEnd
			? toNumber(orderRatingsValueEnd)
			: undefined;

		if (values.active === "") {
			normalizeValues.active = null;
		}

		const filter = {
			...normalizeValues,
		} as unknown as ProvisionRequestReportFilter;

		if (normalizeValues.folderNumber && normalizeValues.folderNumber !== "") {
			filter.folderNumber = normalizeValues.folderNumber.split(";");
		}

		await dispatch(generateProvisionReportRequest({...filter, filterId: isNaN(filterId)? null : filterId}));
		if (status === "added" || "initial") {
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		}
		if (status === "failure") {
			showRequestError(error)
		}

		// if (type === "provision/generateProvisionReportRequest/rejected") {
		// 	setSubmitting(false);
		// 	enqueueSnackbar(
		// 		"O filtro aplicado excedeu o limite do tempo de carregamento do servidor. Favor aplicar um filtro mais específico.",
		// 		{ variant: "error" }
		// 	);
		// 	return;
		// }

		// FileSaver.saveAs(payload as Blob, "relatório_pedido_provisão.xlsx");
		// setSubmitting(false);
	};

	const handleCleanOnClick =  () => {
		setStartRisk('');
		setEndRisk('');
		setOrderRatingsValueStart('');
		setOrderRatingsValueEnd('');
		dispatch(actions.reportItemsCount.setTotalItems(0))
		setSelectedAreaDejurIds([]);
	};

	const handleChange = (setElement: Dispatch<SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setElement(event.target.value);
	}

	const handleAreaDejurChange = (event: ChangeEvent<{ value: number[] }>) => {
		setSelectedAreaDejurIds(event.target.value)
	}

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				enableReinitialize
			>
				{({ values, handleSubmit, isSubmitting, resetForm }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t("provisions:report.searchTitle")} withPadding>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("provisions:fields.originArea")}
										name="originAreaId"
										options={groupedAreasAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										multiple
										label={t("provisions:fields.areaDejur")}
										name="legalDepartmentAreaId"
										options={groupedAreasAsOptions}
										onChange={handleAreaDejurChange}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										label={t("provisions:fields.ctg")}
										name="folderNumber"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.compDate")}
												name="dataComplementoCadastroStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.to")}
												name="dataComplementoCadastroEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.contingencyType")}
										name="contingency"
										options={contingenciesOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.statusProcess")}
										name="statusId"
										options={statusOrdered}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.type")}
										name="type"
										options={processTypeOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("provisions:fields.agent")}
										name="prepostoIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("provisions:fields.internalLawyer")}
										name="internalLawyerIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("provisions:fields.legalResponsible")}
										name="mainResponsibleIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
									/>
								</Grid>
								<Grid item  xs={12} md={3}>
									<GroupedSelectFiledMultiple
										name='responsibleAreaIds'
										label={t('reports:main.form.responsibleAreaId')}
										options={groupedAreasByIdAsOptions}
										multiple
									/>
								</Grid>
								<Grid item  xs={12} md={3}>
									<ContactFieldMultiple
										disabled={values?.responsibleAreaIds?.length === 0}
										label={t('provisions:fields.officeResponsible')}
										name="officeResponsibleIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.OfficeResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.actionClass")}
										name="actionTypeId"
										options={actionClassesOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.provisionClass")}
										name="provisionClass"
										options={provisionClassesOptionsSelect}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.closing")}
										name="closure"
										options={closeOptionsSorted}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CostCenterField
										label={t("provisions:fields.costCenter")}
										name="costCenter"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.sphere")}
										name="sphere"
										options={spheresOptions}
										multiple
									/>
								</Grid>
							</Grid>
						</Panel>

						<Panel
							title={t("provisions:report.section.provisionRequestsFilter")}
							withPadding
						>
							<Grid container spacing={2}>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.requestDescription")}
										name="orderDescriptionId"
										multiple
										options={filteredOrderDescriptionOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.orderDateFrom")}
												name="createdDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.to")}
												name="createdDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.expectation")}
										multiple
										name="orderExpectationId"
										options={orderExpectationOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.status")}
										name="orderStatusId"
										multiple
										options={orderStatusOptions}
									/>
								</Grid>
								 <Grid item xs={12} md={4}>
									<SelectField
										label={t("provisions:fields.probability")}
										name="orderProbabilityId"
										multiple 
										options={orderProbabilityOptions}
									/>
								</Grid> 
								<Grid item xs={12} md={4}>
									<SelectField
										label={t("provisions:fields.openingDescription")}
										name="orderRatingDescription"
										multiple
										options={orderRatingDescriptionOptions}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("provisions:fields.forecastValueFrom")}
												name="riskValueStart"
												value={startRisk}
												onChange={handleChange(setStartRisk)}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("provisions:fields.to")}
												name="riskValueEnd"
												value={endRisk}
												onChange={handleChange(setEndRisk)}
											/>
										</Grid>
									</Grid>
								</Grid>
								{/* <Grid item xs={12} md={3}>
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
								</Grid> */}
								{/* <Grid item xs={12} md={3}>
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
								</Grid> */}
								{/* <Grid item xs={12} md={3}>
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
								</Grid> */}
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("provisions:fields.orderRatingsValue")}
												name="orderRatingsValueStart"
												value={orderRatingsValueStart}
												onChange={handleChange(setOrderRatingsValueStart)}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<CurrencyField
												label={t("provisions:fields.to")}
												name="orderRatingsValueEnd"
												value={orderRatingsValueEnd}
												onChange={handleChange(setOrderRatingsValueEnd)}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} md={3}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.baseDateFrom")}
												name="baseDateStart"
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												label={t("provisions:fields.to")}
												name="baseDateEnd"
											/>
										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.correctionIndex")}
										name="correctionIndex"
										multiple
										options={formulaCorrectionRuleAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.sumProvisionTable")}
										name="sumProvisionTable"
										options={provisionTableSumOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t("provisions:fields.enableDisable")}
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
							</Grid>
						</Panel>

						<Box
							display="flex"
							justifyContent="flex-end"
							alignItems="center"
							mt={2}
						>
							<Clean
								action="provision"
								onClick={() => {
									resetForm()
									handleCleanOnClick()
								}}
							/>
							<Submit
								style={{ marginLeft: "30px" }}
								text={t("provisions:report.button")}
								submitting={isSubmitting}
							/>
						</Box>
					</form>
				)}
			</Formik>
		</ScreenTemplate>
	);
}
