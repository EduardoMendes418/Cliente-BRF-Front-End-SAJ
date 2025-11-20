import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as yup from "yup";
import { Grid } from "@material-ui/core";

import Attachments from "src/components/Attachments";
import FieldColumn from "src/components/FieldColumn";
import Form, {
	DateField,
	SelectField,
	TextField,
	TOptionsSelect,
	CurrencyField,
	NumericField,
	RadioGroup,
} from "src/components/form";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";
import JustificationDisplay from "src/components/JustificationDisplay";

import {
	dateValidator,
	numberValidator,
	textValidator,
} from "src/core/utils/yup-validations";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import {
	addGoodsGuaranteesRequest,
	deleteGoodsGuaranteesRequestFile,
	editGoodsGuaranteesRequest,
	fetchGoodsGuaranteesRequestListSimplify,
} from "src/core/store/modules/goods-guarantee/thunks";
import { t, useTranslation } from "src/locale/i18n";

import {
	requestTypesOptions,
	requestTypesOptionsAll,
	updateTypesOptions,
	REQUEST_TYPE,
	STATUS_FLOW,
	RECORD_TYPE,
	TYPE_FLOW,
	UPDATE_TYPE,
} from "../constants";
import {
	useGuaranteeMethod,
	useGuaranteeModality,
	useGuaranteeType,
} from "src/hooks/fetchLists";
import { useActivePolicies } from "src/hooks/goodsAndGuarantees";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { numberToCurrency, valuesToNumber } from "src/core/utils/func";
import { getListGoodsGuaranteesRequest, getSavingGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { AppDispatch } from "src/core/store";
import ProssibleApprovals from "src/components/ProssibleApprovals";
import { useSnackbar } from "notistack";
import { TBudgetFile } from "src/core/models/goods-guarantee-estimates";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";
import { fetchESocialAreasGridList } from "src/core/store/modules/e-social-areas/thunks";

type TForm = {
	readOnly: boolean;
	isNew: boolean;
	item: TGoodsGuaranteesRequest;
	folderNumber: string;
	processId?: number;
	areaId?: number | string;
};

const isNotANewGuarantee = (requestTypeId: number | "") =>
	requestTypeId && requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE;
const isTermRenewal = (requestTypeId: number | "") =>
	requestTypeId === REQUEST_TYPE.TERM_RENEWAL;

const validationSchema = yup.object({
	requestTypeId: numberValidator,
	updateTypeId: yup
		.number()
		.nullable()
		.when("requestTypeId", { is: isNotANewGuarantee, then: numberValidator }),
	goodGuaranteeLinked: yup
		.number()
		.nullable()
		.when("requestTypeId", { is: isNotANewGuarantee, then: numberValidator }),
	guaranteeTypeId: yup
		.number()
		.moreThan(0, t("required"))
		.required(t("required"))
		.typeError(t("required")),
	guaranteeModalityId: numberValidator,
	guaranteeMethodId: numberValidator,
	finalDate: dateValidator,
	startEffective: yup
		.date()
		.nullable()
		.when("requestTypeId", { is: isTermRenewal, then: dateValidator }),
	endEffective: yup
		.date()
		.nullable()
		.when("requestTypeId", { is: isTermRenewal, then: dateValidator }),
	requestDate: textValidator,
	description: textValidator.notRequired(),
	files: yup.mixed(),
	endorsementStartDate: yup.date().nullable(),
	endorsementEndDate: yup.date().nullable(),
	endorsementNumber: yup.number().nullable(),
});

const defaultRequestTypeOptions = requestTypesOptions.filter(
	({ value }) => value === REQUEST_TYPE.NEW_GUARANTEE
);

const replacementGoodGuaranteeAsOption = [
	{label: "Sim", value: true}, 
	{label: "Não", value: false}
]

const RequestForm = ({
	readOnly,
	item,
	isNew,
	folderNumber,
	processId,
	areaId
}: TForm) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const listGoodsGuaranteesRequest = useSelector(getListGoodsGuaranteesRequest);
	const dejurAreaName = useSelector(getListESocialAreas);
	const [validGuaranteeMethodOptions, setValidGuaranteeMethodOptions] = useState<TOptionsSelect[]>([]);
	const [validRequestTypeOptions, setValidRequestTypeOptions] = useState<TOptionsSelect[]>([...defaultRequestTypeOptions]);

	const isSaving = useSelector(getSavingGoodsGuaranteesRequest);
	const isRequired = dejurAreaName?.length === 0;
	
	let initialValues: TGoodsGuaranteesRequest = {
		folderNumber,
		requestTypeId: "",
		updateTypeId: "",
		policyNumber: "",
		guaranteeTypeId: 0,
		guaranteeModalityId: "",
		guaranteeMethodId: "",
		goodLocation: "",
		finalDate: null,
		dateOfAcknowledgment: null,
		safeDate: null,
		startEffective: null,
		endEffective: null,
		valueGuarantee: 0,
		requestDate: moment().format("YYYY-MM-DD"),
		description: "",
		statusApprovalId: STATUS_APPROVALS_FLOW.NONE,
		statusFlowId: STATUS_FLOW.NONE,
		files: [] as any,
		recordType: RECORD_TYPE.REQUEST,
		endorsementStartDate: null,
		endorsementEndDate: null,
		goodGuaranteeLinked: "",
		endorsementNumber: "",
		processId,
		replacementGoodGuarantee: false,
		goodsGuaranteesRequestId: undefined
	};

	if (item && Object.keys(item).length > 0) {
		const { isDeleted, ...data } = item;
		const filesFromItem = item.files?.filter(({ isMainFile }) => isMainFile) ?? [];
		let filesFromEstimates: TBudgetFile[] = [];
		if (Array.isArray(item.estimates)) {
			filesFromEstimates = item.estimates
				.flatMap(est =>
					Array.isArray(est.files)
						? est.files.map((f: any) => ({
							...f.file,
							isMainFile: f.isMainFile,
						}))
						: []
				);
		}
		initialValues = {
			...initialValues,
			...data,
			files: [...filesFromItem, ...filesFromEstimates],
		};
	}

	const {
		guaranteeModalityAsOptionsNoJudicialDeposit,
		guaranteeModality,
		guaranteeModalityTypeFlowAsObject,
		guaranteeModalityAsOptions
	} = useGuaranteeModality();
	const { guaranteeMethodAsOptions } = useGuaranteeMethod();
	const { guaranteeTypeAsOptions } = useGuaranteeType();
	const {
		searchActivePolicies,
		filtredactivePoliciesAsOptions,
		activePoliciesList,
	} = useActivePolicies(folderNumber, item.goodGuaranteeLinked, readOnly);

	const goodGuaranteesListAsOptions = listGoodsGuaranteesRequest?.map((x: any) => ({
		label: `Id Garantia: ${x.id}; Modalidade: ${guaranteeModalityAsOptions?.filter((guarantee: any) => guarantee.value === x?.guaranteeModalityId).map((x: any) => x.label)[0]}; Valor: ${numberToCurrency(x.valueGuarantee)}; Saldo contábil: ${numberToCurrency(x.accountingBalance)}`,
		value: x.id,
	}))

	const handleGuaranteeModalityChange = useCallback(
		(guaranteeModalityId: number | "") => {
			const selectedGuaranteeModality = guaranteeModality.find(
				({ id }) => id === guaranteeModalityId
			);

			if (selectedGuaranteeModality) {
				const { guaranteeMethodIds, typeFlow } = selectedGuaranteeModality;

				const optionsGuaranteeMethod = guaranteeMethodAsOptions.filter(
					({ value }) => guaranteeMethodIds.includes(Number(value))
				);
				setValidGuaranteeMethodOptions(optionsGuaranteeMethod);

				const optionsRequestType =
					typeFlow === TYPE_FLOW.INSURANCE
						? requestTypesOptions
						: defaultRequestTypeOptions;
				setValidRequestTypeOptions(optionsRequestType);
			} else setValidGuaranteeMethodOptions([]);
		},
		[guaranteeModality, guaranteeMethodAsOptions]
	);

	useEffect(() => {
		if (item && Object.keys(item).length > 0)
			handleGuaranteeModalityChange(item.guaranteeModalityId);
	}, [item, handleGuaranteeModalityChange]);

	useEffect(() => {
		if (initialValues.folderNumber){
			dispatch(fetchGoodsGuaranteesRequestListSimplify({statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE, recordType: RECORD_TYPE.EFFECTIVE, folderNumber: initialValues.folderNumber, isActive: true}));
		}
			
	}, [initialValues.folderNumber, dispatch]);

	const onSubmit = async (values: TGoodsGuaranteesRequest) => {
		const payload = {
			...valuesToNumber(["valueGuarantee"], values),
		} as TGoodsGuaranteesRequest;
		if (isNew) {
			const arrayOfFilesLength: number[] = [];
			if(payload?.files.length === 0){
				enqueueSnackbar(
					"O anexo de um arquivo é obrigatório.",
					{ variant: "error" }
				);
				return
			} else if (payload?.files.length > 0){
				payload?.files.forEach((file) => {
					arrayOfFilesLength.push(file?.name.length)
				})
				if(arrayOfFilesLength.some(number => number > 119)){
					return enqueueSnackbar(
						t("goodsAndGuarantees:characterLimiterWarningMessage"),
						{ variant: "error" }
					);
				} else {
					 dispatch(addGoodsGuaranteesRequest({
						...payload,
						statusFlowId: STATUS_FLOW.REQUESTED
					})) 
				}
			}  
			} else {
			const newStatusFlow =
				item.statusFlowId === STATUS_FLOW.RETURNED
					? STATUS_FLOW.REQUESTED
					: item.statusFlowId;
				const filteredFiles = payload.files.filter((file) => !file.id)
				const normalizeFiles = Array.from(filteredFiles || [])

			 await dispatch(
				editGoodsGuaranteesRequest({
					...payload,
					files: normalizeFiles,
					statusFlowId: newStatusFlow,
				} as TGoodsGuaranteesRequest & { id: number })
			); 
		} 
	};

	const handleRequestTypeChange = (setFieldValue: Function) => (event: any) => {
		const selectedRequestType = event.target.value;
		setFieldValue("requestTypeId", selectedRequestType);

		if (selectedRequestType !== REQUEST_TYPE.NEW_GUARANTEE) {
			searchActivePolicies();
		} else {
			setFieldValue("policyNumber", "");
			setFieldValue("updateTypeId", "");
			setFieldValue("endEffective", null);
			setFieldValue("startEffective", null);
			setFieldValue("goodGuaranteeLinked", null);
		}

		if (selectedRequestType !== REQUEST_TYPE.UPDATE_ENDORSEMENT) {
			setFieldValue("endorsementStartDate", null);
			setFieldValue("endorsementEndDate", null);
		}

		if (selectedRequestType === REQUEST_TYPE.TERM_RENEWAL) {
			setFieldValue("updateTypeId", UPDATE_TYPE.DEADLINE);
		}

		setFieldValue("status", selectedRequestType !== REQUEST_TYPE.TERM_RENEWAL);
	};

	const handlePolicyNumberChange =
		(values: TGoodsGuaranteesRequest, setFieldValue: Function) =>
		(event: any) => {
			const selectedPolicy = event.target.value;
			setFieldValue("goodGuaranteeLinked", selectedPolicy);

			const activePolicy = activePoliciesList.find(
				({ id }) => id === selectedPolicy
			);
			setFieldValue("policyNumber", activePolicy?.policyNumber);

			if (!activePolicy) return;

			setFieldValue("guaranteeTypeId", activePolicy.guaranteeTypeId);
			setFieldValue(
				"valueGuarantee",
				numberToCurrency(Number(activePolicy.valueGuarantee))
			);
			setFieldValue("goodLocation", activePolicy.goodLocation);

			if (values.requestTypeId === REQUEST_TYPE.UPDATE_ENDORSEMENT) {
				setFieldValue("startEffective", activePolicy.startEffective);
				setFieldValue("endEffective", activePolicy.endEffective);
			}
		};

	const handleDelete = (file: any) => {
		if (file && file.id) {
			dispatch(deleteGoodsGuaranteesRequestFile(file.id));
		}
	};

	const showJustificationFlow =
		item &&
		[STATUS_APPROVALS_FLOW.CANCELLED, STATUS_APPROVALS_FLOW.RETURNED].includes(
			item?.statusFlowId
		);

		useEffect(() => {	
				dispatch(fetchESocialAreasGridList({areaId: areaId}));
			},[]);

	return (
		<Form
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			permission={readOnly ? false : undefined}
		>
			{({
				values,
				handleSubmit,
				setFieldValue,
				isSubmitting,
				dirty,
				status: statusForm,
				setSubmitting,
			}) => (
				<form onSubmit={handleSubmit} noValidate>
					<Panel
						title={t("goodsAndGuarantees:form.goodsAndGuaranteesData")}
						withPadding
					>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("goodsAndGuarantees:form.guaranteeModality")}
									name="guaranteeModalityId"
									options={guaranteeModalityAsOptionsNoJudicialDeposit}
									required
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										handleGuaranteeModalityChange(Number(e.target.value) ?? "");
										if (Number(e.target.value) !== 2)
											setFieldValue("requestTypeId", 1);
										setFieldValue("guaranteeModalityId", e.target.value);
									}}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("goodsAndGuarantees:form.requestType")}
									name="requestTypeId"
									options={
										statusForm === "readOnly"
											? requestTypesOptionsAll
											: validRequestTypeOptions
									}
									required
									onChange={handleRequestTypeChange(setFieldValue)}
								/>
							</Grid>
							{values.requestTypeId &&
								values.requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE && (
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("goodsAndGuarantees:form.initialPolicyNumber")}
											name="goodGuaranteeLinked"
											options={filtredactivePoliciesAsOptions}
											onChange={handlePolicyNumberChange(values, setFieldValue)}
										/>
									</Grid>
								)}
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("goodsAndGuarantees:form.guaranteeType")}
									name="guaranteeTypeId"
									options={guaranteeTypeAsOptions}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("goodsAndGuarantees:form.formOfGuarantee")}
									name="guaranteeMethodId"
									options={validGuaranteeMethodOptions}
									required
								/>
							</Grid>
							{values.requestTypeId &&
								values.requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE && (
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("goodsAndGuarantees:form.updateType")}
											name="updateTypeId"
											options={updateTypesOptions}
										/>
									</Grid>
								)}
								<Grid item md={3} xs={12}>
								<DateField
									label={t("goodsAndGuarantees:form.dateOfAcknowledgment")}
									name="dateOfAcknowledgment"
									required={!isRequired}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									label={t("goodsAndGuarantees:form.safeDate")}
									name="safeDate"
									required={!isRequired}

								/>
							</Grid>
								<Grid item md={3} xs={12}>
								<DateField
									label={t("goodsAndGuarantees:form.finalDate")}
									name="finalDate"
									required={!isRequired}
									
								/>
							</Grid>
							{values.requestTypeId &&
								values.requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE && (
									<>
										<Grid item md={3} xs={12}>
											<DateField
												label={t("goodsAndGuarantees:form.startDate")}
												name="startEffective"
												readOnly={
													values.requestTypeId ===
													REQUEST_TYPE.UPDATE_ENDORSEMENT
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<DateField
												label={t("goodsAndGuarantees:form.finishDate")}
												name="endEffective"
												readOnly={
													values.requestTypeId ===
													REQUEST_TYPE.UPDATE_ENDORSEMENT
												}
											/>
										</Grid>
									</>
								)}
							<Grid item md={3} xs={12}>
								<CurrencyField
									label={t("goodsAndGuarantees:form.guaranteeAmount")}
									name="valueGuarantee"
									required
									min={0.01}
								/>
							</Grid>
							{guaranteeModalityTypeFlowAsObject &&
								(guaranteeModalityTypeFlowAsObject as any)[
									values.guaranteeModalityId
								] === TYPE_FLOW.PROPERTY && (
									<Grid item md={3} xs={12}>
										<TextField
											label={t("goodsAndGuarantees:form.locationOfProperty")}
											name="goodLocation"
										/>
									</Grid>
								)}
							{values.requestTypeId === REQUEST_TYPE.UPDATE_ENDORSEMENT && (
								<>
									<Grid item md={3} xs={12}>
										<NumericField
											label={t("goodsAndGuarantees:formFlow.endorsementNumber")}
											name="endorsementNumber"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											label={t("goodsAndGuarantees:form.endorsementStartDate")}
											name="endorsementStartDate"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											label={t("goodsAndGuarantees:form.endorsementEndDate")}
											name="endorsementEndDate"
										/>
									</Grid>
								</>
							)}
							<Grid item md={3} xs={12}>
								<FieldColumn
									label={t("goodsAndGuarantees:form.requestDate")}
									value={values.requestDate}
									type="date"
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<TextField
									label={t("goodsAndGuarantees:form.description")}
									name="description"
									rows={5}
									maxLength={10000}
									multiline
								/>
							</Grid>
						</Grid>
					</Panel>
					 {
						values.requestTypeId === REQUEST_TYPE.NEW_GUARANTEE ? 
						<Panel
						title={"Dados de Bens e Garantias - Substituição de Garantia"}
						withPadding
					>
							<Grid container spacing={2}>
								<Grid item md={2} xs={12} style={{ display: "flex" }}>
									<RadioGroup
										name='replacementGoodGuarantee'
										label={t('goodsAndGuarantees:management.replacementGoodGuarantee')}
										options={replacementGoodGuaranteeAsOption}
									/>
								</Grid>
								{	values?.replacementGoodGuarantee === true ?
									<Grid item md={3} xs={12} style={{marginTop: '6px'}}>
									<SelectField
										label={t('goodsAndGuarantees:management.goodsGuaranteesRequestId')}
										name='goodGuaranteeLinked'
										options={goodGuaranteesListAsOptions}
										required
									/> 
								</Grid> : null}
								</Grid>
					</Panel> : null
					}	
					<Attachments name="files" onDelete={handleDelete} />

					{showJustificationFlow && (
						<JustificationDisplay
							type={
								item.statusFlowId === STATUS_APPROVALS_FLOW.RETURNED
									? "returned"
									: "cancelled"
							}
							logs={item.logs}
							status={item.statusFlowId}
							moduloId={5}
						/>
					)}

					<ProssibleApprovals items={item.approvals} />

					{statusForm !== "readOnly" && (
						<Grid
							container
							direction="row"
							justifyContent="flex-end"
							className="margin-top-24"
						>
							<Submit
								isNew={isNew}
								submitting={isSubmitting || isSaving}
								disabled={!dirty}
							/>
						</Grid>
					)}
					{!isSaving && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Form>
	);
};

export default RequestForm;