import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { Grid } from "@material-ui/core";
import moment from "moment";
import { partition } from "ramda";
import { FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";

import api from "src/core/api/credit-receipt";
import Form from "src/components/form";
import { Submit } from "src/components/button";
import ScreenTemplate from "src/components/Screen";
import { modal } from "src/components/modals";
import JustificationModal, { TForm } from "src/components/JustificationModal";
import Logs from "src/components/Logs";
import Attachments from "src/components/Attachments";
import FieldColumn from "src/components/FieldColumn";
import AccordionPanel from "src/components/AccordionPanel";

import { TCreditReceipt } from "src/core/models/credit-receipt";
import {
	getHasCreditReceipt,
	getItemCreditReceipt,
	getStatusCreditReceipt as getStatus,
	getErrorMessageCreditReceipt as getErrorMessage,
	getCreditReceiptSearch,
} from "src/core/store/modules/credit-receipt/selectors";
import {
	addCreditReceipt,
	deleteCreditReceiptFile,
	editCreditReceipt,
	fetchCreditReceiptById,
	addGuaranteeCreditReceipReverse
} from "src/core/store/modules/credit-receipt/thunks";
import {
	getHasFolder,
	getProcessFolder,
	getProcessIsFetching,
} from "src/core/store/modules/process/selectors";
import { useCurrentUser } from "src/config/permissions";
import { fillIfValue, valuesToNumber } from "src/core/utils/func";
import { t } from "src/locale/i18n";
import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TUserDefault } from "src/core/models/users";
import { fetchGuaranteeAccountabilityDepositList } from "src/core/store/modules/guarantee-accountability/thunks";
import { numberValidator } from "src/core/utils/yup-validations";
import { fetchExplanatoryNote } from "src/core/store/modules/explanatory-note/thunks";

import AccountabilityList from "./AccountabilityList";
import CTGFolderSearch from "./CTGFolderSearch";
import RequesterForm from "./RequesterForm";
import EvaluatorForm from "./EvaluatorForm";
import PaymentList from "./PaymentList";
import {
	RETURNED_STATUS,
	statusText,
	STATUS_CREDIT_RECEIPT,
} from "../constants";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import ProcessFormData from "src/components/ProcessFormData";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { getListExplanatoryNote } from "src/core/store/modules/explanatory-note/selectors";

import JustificationDisplay from "src/components/JustificationDisplay";
import {
	getDataCurrentUser,
} from "src/core/store/modules/currentUser/selectors";
import { useSnackbar } from "notistack";
const NUMBER_VALUES = [
	"creditValue",
	"evaluatorCreditedAmount",
	"evaluatorIncomeTax",
	"evaluatorElectronicTransferRate",
	"evaluatorCovenantRate",
	"evaluatorUpdateValueCredited",
];

const justificationModalTitle = {
	rejected: t("creditReceipt:form.justificationForReturnCreditReceipt"),
	returned: t("creditReceipt:form.justificationForRejectCreditReceipt"),
	reversed: t("creditReceipt:form.justificationForReverseCreditReceipt"),
};
const CreditReceiptForm = () => {
	const {
		location: { pathname },
	} = useHistory();
	let { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const formRef = useRef<FormikProps<TCreditReceipt>>(null);
	const { enqueueSnackbar } = useSnackbar();
	const [accounting, setAccounting] = useState<any>([]);
	let isReversal = false
	if (id.includes(";")) {
		id = id.split(";")[0];
		isReversal = true
	}
	const { userId, currentScreenPermissions } = useCurrentUser(id);
	const { accounts } = useMsal();

	const item = useSelector(getItemCreditReceipt);
	const hasItem = useSelector(getHasCreditReceipt);
	const statusSubmit = useSelector(getStatus);
	const search = useSelector(getCreditReceiptSearch);
	const processForm = useSelector(getProcessFormData);
	const currentUser = useSelector(getDataCurrentUser)
	const noteTypes = useSelector(getListExplanatoryNote)
	const process = useSelector(getProcessFolder);
	const hasProcess = useSelector(getHasFolder);
	const isFetchingProcess = useSelector(getProcessIsFetching);

	const isLoading = isFetchingProcess || statusSubmit === "fetching";
	const isNew = id === "novo";
	const isRequest = pathname.includes("solicitacao");

	const isFormVisible = (!isLoading && hasProcess) || hasItem;

	const requested = item?.statusFlowId === STATUS_CREDIT_RECEIPT.REQUESTED;
	const returned = RETURNED_STATUS.includes(item?.statusFlowId);
	const rejected = item?.statusFlowId === STATUS_CREDIT_RECEIPT.REJECTED;

	const isEvaluatorFormVisible =
		!RETURNED_STATUS.includes(item.statusFlowId) &&
		((!isRequest && (!requested || currentScreenPermissions.edit)) ||
			(isRequest && !requested && !isNew));
	const isSaveButtonVisible =
		(isRequest &&
			((returned && currentScreenPermissions.edit) ||
				(isNew && currentScreenPermissions.add))) ||
		(!isRequest &&
			item &&
			item.statusFlowId !== STATUS_CREDIT_RECEIPT.REJECTED &&
			currentScreenPermissions.edit && 
			item.statusFlowId !== STATUS_CREDIT_RECEIPT.DEAD)

	const allow = currentScreenPermissions[isNew ? "add" : "edit"] && !rejected;

	const isEvaluatorFormReadonly =
		!allow ||
		isRequest ||
		item.statusApprovalId === -1 ||
		item.statusFlowId === STATUS_CREDIT_RECEIPT.REVERSED ||
		item.statusFlowId === STATUS_CREDIT_RECEIPT.DEAD;
	const isRequesterFormReadonly =
		!allow ||
		!isRequest ||
		(!returned && !isNew) ||
		item.statusApprovalId === -1;
	const showJustificationDisapproval =
		[
			...RETURNED_STATUS,
			STATUS_CREDIT_RECEIPT.REJECTED,
			STATUS_CREDIT_RECEIPT.REVERSED,
		].includes(item?.statusFlowId) &&
		item.logs &&
		item.logs.length > 0;

	useEffect(() => {
		if (item.folderNumber) {
			dispatch(fetchProcessFolder({ folderNumber: item.folderNumber }));
		}
	}, [dispatch, item.folderNumber]);

	useRegisterDefault({
		action: "creditReceipt",
		getStatus,
		getErrorMessage,
	});

	const creditReceiptFormSchema = yup.object({
		paymentTypeId: yup.number().when("willLinkAPayment", {
			is: true,
			then: numberValidator.required(
				"Por favor, selecione um pagamento da lista acima"
			),
			otherwise: numberValidator,
		}),
		requestFiles: isNew
			? yup.array().required().min(1, t("required"))
			: yup.array().notRequired(),
	});
	const initialValues: TCreditReceipt = useMemo(() => {
		const [requestFiles, evaluationFiles] = partition(
			({ isMainFile }) => isMainFile,
			item.files ?? []
		);

		const initialValues: TCreditReceipt = {
			id: 0,
			folderNumber: process?.folderNumber ?? "",
			requestDate: moment().format("YYYY-MM-DD"),
			statusFlowId: STATUS_CREDIT_RECEIPT.NONE,
			paymentTypeId: "",
			creditValue: 0,
			licenseNumber: "",
			creditJudicialAccount: "",
			restatementInterestAmount: false,
			observation: "",

			evaluatorUserId: null,
			evaluatorDate: null,
			evaluatorCompany: "",
			evaluatorExercise: "",
			evaluatorSapDocument: "",
			evaluatorDocumentDate: null,
			evaluatorCreditedAmount: 0,
			evaluatorIncomeTax: 0,
			evaluatorElectronicTransferRate: 0,
			evaluatorCovenantRate: 0,
			evaluatorWriteOffQuantity: "",
			evaluatorAccount: "",
			evaluatorUpdateValueCredited: 0,
			evaluatorWriteOffDate: null,
			evaluatorSendBankDate: null,
			evaluatorPendingTime: 0,
			evaluatorObservation: "",
			processId: process?.id ?? null,
			process,
			requestFiles,
			evaluationFiles,
			evaluatorUser: {} as TUserDefault,
			paymentId: undefined,
		};

		let currentItem = fillIfValue<TCreditReceipt>(item, initialValues);
		if (hasItem && item.statusFlowId === STATUS_CREDIT_RECEIPT.REQUESTED) {
			currentItem = {
				...currentItem,
				evaluatorUserId: Number(userId),
				evaluatorUser: { name: accounts[0]?.name } as TUserDefault,
				evaluatorDate: moment().format("YYYY-MM-DD"),
			};
		}
		if (isReversal) {
			currentItem = {
				...currentItem, 
				evaluatorDate: moment().format("YYYY-MM-DD"),
				evaluatorUser: {name: currentUser.name ?? ""} as TUserDefault
			}
		}

		return currentItem;
	}, [item, process, userId, hasItem, accounts, isReversal, currentUser.name]);



	const onSubmitReject = (
		{ justification, ...rest }: TForm,
		values: TCreditReceipt
	) => {
		if (isReversal) {
			dispatch(
				addGuaranteeCreditReceipReverse({
					files: values.requestFiles,
					creditReceiptIds: [Number(values.id)],
					accountabilityIds: [],
					note: noteTypes.find((item) => item.description === "REVERSÃO")?.id ?? 0,
					email: "",
					evaluationDescription: values.evaluatorObservation,
					justification,
					rejectionAndReturnReasonsId: rest.rejectionAndReturnReasonsId
				})
			);
			return
		}
		dispatch(
			editCreditReceipt({
				...values,
				updateStatusFlow: {
					id: item.id,
					observation: justification,
					statusFlowId: values.statusFlowId,
					...rest,
				},
			})
		);
	};
	const getReasonType = (statusFlowId: STATUS_CREDIT_RECEIPT) => {
		if (RETURNED_STATUS.includes(statusFlowId)) return "rejected";
		return statusFlowId === STATUS_CREDIT_RECEIPT.REJECTED
			? "returned"
			: "reversed";
	};
	const newgetReasonType = (reasonType: "rejected" | "returned" | "reversed" ) => {
		if (reasonType === "returned") return "rejected"
		if (reasonType === "rejected") return "returned"
		return reasonType
	}
	const onJustify = (values: TCreditReceipt) => {
		const reasonType = getReasonType(values.statusFlowId);
		const component = (
			<JustificationModal
				reason={isReversal ? "reversed" : newgetReasonType(reasonType)}
				moduloId={9}
				onSubmitJustification={(justificationValues: TForm) =>
					onSubmitReject(justificationValues, values)
				}
			/>
		);

		modal({
			title: justificationModalTitle[isReversal ? "reversed" : reasonType],
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const onSubmit = (
		values: TCreditReceipt,
		{ setSubmitting }: FormikHelpers<TCreditReceipt>
	) => {
		const arrayOfFilesLength: any[] = [];

		const { willLinkAPayment, process, evaluatorUser, ...payload } =
			valuesToNumber<TCreditReceipt>(NUMBER_VALUES, values);
		if (isReversal) {
			onJustify(payload);
			return
		}
		if (isNew) {
			payload?.requestFiles?.forEach((file: any) => {
						arrayOfFilesLength.push(file?.name.length)
					})
					if(arrayOfFilesLength.some(number => number > 119)){
						 enqueueSnackbar(
							t("goodsAndGuarantees:characterLimiterWarningMessage"),
							{ variant: "error" }
						);
						setSubmitting(false);
						return;
					} else{
						dispatch(
							addCreditReceipt({
								...payload,
								statusFlowId: STATUS_CREDIT_RECEIPT.REQUESTED,
							})
						);
						return;
					}
		}

		if (
			[
				...RETURNED_STATUS,
				STATUS_CREDIT_RECEIPT.REJECTED,
				STATUS_CREDIT_RECEIPT.REVERSED,
			].includes(values.statusFlowId) &&
			!isRequest
		) {
			onJustify(payload);
			setSubmitting(false);
		} else {
			const newStatusFlowId = isRequest
				? STATUS_CREDIT_RECEIPT.REQUESTED
				: payload.statusFlowId;
			dispatch(
				editCreditReceipt({ ...payload, statusFlowId: newStatusFlowId })
			);
		}
	};

	const handleDelete = (file: any) => {
		file?.id && dispatch(deleteCreditReceiptFile(file.id));
	};

	useEffect(() => {
		if (!hasItem) return;

		dispatch(actions.creditReceipt.setWillLinkAPayment(!!item.paymentId));
		dispatch(actions.creditReceipt.setFolderNumber(item.folderNumber));
		if (isReversal) 
			dispatch(fetchExplanatoryNote({ notPaginate: true }));

		if (item.statusFlowId === STATUS_CREDIT_RECEIPT.REQUESTED)
			dispatch(
				fetchGuaranteeAccountabilityDepositList({
					notPaginate: true,
					folderNumber: item.folderNumber,
				})
			);
	}, [hasItem, item, dispatch, isReversal]);
	
	const fetchData = useCallback(async () => {
		const { data } = await api.getSap(Number(id));
		const filtred = data?.items.filter(
			({ messageType }: any) => messageType === "S"
		);
		if (filtred && filtred.length !== 0) setAccounting(filtred);
	}, [id]);
	useEffect(() => {
		if (!isNew && id) {
			dispatch(fetchCreditReceiptById(Number(id)));
			fetchData();
		}

		return () => {
			dispatch(actions.creditReceipt.clear());
			dispatch(actions.process.clear());
			dispatch(actions.guaranteeAccountability.clear());
			dispatch(actions.paymentRequest.clear());
		};
		
	}, [dispatch, isNew, id]);

	useEffect(() => {
		if (!hasItem) {
			formRef.current?.setFieldValue("paymentTypeId", "");
			formRef.current?.setFieldValue("paymentId", undefined);
		}
	}, [hasItem, search.willLinkAPayment]);
	const filtredAccounting: any[] = accounting.filter(
		({ messageType, documentNumber, exercice }: any) =>
			messageType === "S" && documentNumber !== "" && exercice !== "" 
	);

	const filtredAccountingMain = useMemo(() => {
		if (filtredAccounting && filtredAccounting.length !== 0) {
			const data = filtredAccounting[0];

			if (data.documentNumber === "" || data.exercice === "") {
				return null;
			} else {
				return data;
			}
		} else {
			return null;
		}
	}, [filtredAccounting]);

	const filtredAccountingReversal = useMemo(() => {
		if (filtredAccounting && filtredAccounting.length !== 0) {
			const data = filtredAccounting[filtredAccounting.length - 1];

			if (data.documentNumber === "" || data.exercice === "") {
				return null;
			} else {
				return data;
			}
		} else {
			return null;
		}
	}, [filtredAccounting]);
	return (
		<ScreenTemplate>
			<CTGFolderSearch
				isLoading={isLoading}
				folderNumber={item?.folderNumber ?? ""}
				willLinkAPayment={!!item?.paymentId}
				readonly={!isNew}
				id={item?.id?.toString() ?? ""}
				parentCreditReceiptsId={item?.parentCreditReceiptsId}
			/>
			{isFormVisible && (
				<Form
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={creditReceiptFormSchema}
					innerRef={formRef}
				>
					{({ handleSubmit, values, isSubmitting, dirty, setSubmitting }) => (
						<form noValidate onSubmit={handleSubmit}>
							<ProcessFormData processData={processForm} />

							{search.willLinkAPayment && (
								<PaymentList payment={item?.payment} />
							)}
							<RequesterForm
								readonly={isRequesterFormReadonly}
								isPaymentTypeReadonly={search.willLinkAPayment}
								isEditable={
									(!isRequesterFormReadonly || !isEvaluatorFormReadonly) &&
									initialValues.statusFlowId !== STATUS_CREDIT_RECEIPT.REVERSED
								}
								initialValues={initialValues}
							/>
							<Attachments
								name="requestFiles"
								disabled={isRequesterFormReadonly && !isReversal}
								onDelete={handleDelete}
							/>
							{isEvaluatorFormVisible && (
								<>
									<AccountabilityList
										accountabilities={
											item.statusFlowId === STATUS_CREDIT_RECEIPT.REQUESTED
												? undefined
												: item.accountabilities
										}
										readonly={isEvaluatorFormReadonly}
									/>
									<EvaluatorForm
										readonly={isEvaluatorFormReadonly}
										statusFlowId={item.statusFlowId}
										isReversal={isReversal}
									/>
									<Attachments
										name="evaluationFiles"
										disabled={isEvaluatorFormReadonly}
										onDelete={handleDelete}
									/>
								</>
							)}
							{filtredAccountingMain && !isReversal && (
								<AccordionPanel
									title={t("judicialBlocksAndTransfers:accounting")}
								>
									<Grid container spacing={3}>
										<Grid item xs={12} md={3}>
											<FieldColumn
												value={filtredAccountingMain.releaseDate}
												label={t(
													"judicialBlocksAndTransfers:accountingData.date"
												)}
												type="date"
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<FieldColumn
												value={`${filtredAccountingMain?.company} ${filtredAccountingMain?.exercice} ${filtredAccountingMain?.documentNumber}`}
												label={t(
													"judicialBlocksAndTransfers:accountingData.number"
												)}
											/>
										</Grid>
									</Grid>
								</AccordionPanel>
							)}
							{filtredAccountingReversal &&
								filtredAccountingReversal.documentNumber !==
									filtredAccountingMain.documentNumber &&
								item.statusFlowId === STATUS_CREDIT_RECEIPT.REVERSED && !isReversal && (
									<AccordionPanel
										title={t("judicialBlocksAndTransfers:accountingReversal")}
									>
										<Grid container spacing={3}>
											<Grid item xs={12} md={3}>
												<FieldColumn
													value={
														filtredAccounting[filtredAccounting.length - 1]
															.createdDate
													}
													label={t(
														"judicialBlocksAndTransfers:accountingData.date"
													)}
													type="date"
												/>
											</Grid>
											<Grid item xs={12} md={3}>
												<FieldColumn
													value={`${
														filtredAccounting[filtredAccounting.length - 1]
															?.company
													} ${
														filtredAccounting[filtredAccounting.length - 1]
															?.exercice
													} ${
														filtredAccounting[filtredAccounting.length - 1]
															?.documentNumber
													}`}
													label={t(
														"judicialBlocksAndTransfers:accountingData.number"
													)}
												/>
											</Grid>
										</Grid>
									</AccordionPanel>
								)}
							{showJustificationDisapproval  && !isReversal && (
								<JustificationDisplay
									type={getReasonType(item.statusFlowId)}
									status={item.statusFlowId}
									logs={item.logs}
									moduloId={9}
								/>
							)}
							<Logs
								logs={item.logs}
								statuses={statusText}
								statusOrder={["flow"]}
								possibleApprovers={!isReversal?
									item?.aprovadores?.map((item) => ({
										...item,
										approverName: item?.nameApprover ?? "",
										hierarchyDescription: item?.codeHierarchy ?? "",
									})) ?? [] : []
								}
							/>
							{(isSaveButtonVisible || isReversal) && (
								<Grid
									container
									direction="row"
									justifyContent="flex-end"
									className="margin-top-24"
								>
									<Submit
										isNew={isNew}
										submitting={isSubmitting || statusSubmit === "saving"}
										disabled={
											!dirty ||
											(values.statusFlowId ===
												STATUS_CREDIT_RECEIPT.REQUESTED &&
												!isRequest)
										}
									/>
								</Grid>
							)}
							{statusSubmit === "failure" &&
								isSubmitting &&
								setSubmitting(false)}
						</form>
					)}
				</Form>
			)}
		</ScreenTemplate>
	);
};

export default CreditReceiptForm;
