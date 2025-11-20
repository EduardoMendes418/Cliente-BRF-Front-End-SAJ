import { useCallback, useMemo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ScreenTemplate from "src/components/Screen";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import {
	addGuaranteeAccountabilityMultiples,
	addGuaranteeAccountabilityReverse,
} from "src/core/store/modules/guarantee-accountability/thunks";
import { Button } from "@material-ui/core";
import { clearAll } from "src/core/store/modules/guarantee-accountability";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";
import { modal } from "src/components/modals";

import {
	getAccountabilityArray,
	getStatus,
	getErrorMessage,
} from "src/core/store/modules/guarantee-accountability/selectors";
import TableAccontability from "./componentsMultiple/TableAccontability";
import CreditReceipt from "src/screen/goods-and-guarantees/accountability/Form/componentsMultiple/CreditReceipt";
import EvaluationFrom from "src/screen/goods-and-guarantees/accountability/Form/componentsMultiple/EvaluationForm";
import Form from "src/components/form";
import { Box } from "@material-ui/core";
import { Submit } from "src/components/button";
import { FormikHelpers } from "formik";
import { valuesToNumber } from "src/core/utils/func";
import { getCreditReceipt } from "src/core/store/modules/guarantee-accountability/selectors";
import { AppDispatch } from "src/core/store";
import moment from "moment";
import { useRegisterDefault } from "src/hooks";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import Attachments from "src/components/Attachments";
import guaranteeModalityAPI from "src/core/api/guarantee-accountability";
import {
	setAccontabilityArray,
	setCreditReceipt,
} from "src/core/store/modules/guarantee-accountability";
import { fillIfValue } from "src/core/utils/func";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import {
	accountabilityStatusOptionsAsObject,
	situationStatusOptionsAsObject,
} from "src/screen/goods-and-guarantees/accountability/constants";
import { bearishReasonsOptionsList } from "src/screen/goods-and-guarantees/constants";
import apiCreditReceipt from "src/core/api/credit-receipt";
import JustificationModal, {
	TForm as TJustificationModalForm,
} from "src/components/JustificationModal";
import { useSnackbar } from "notistack";

const numberFields = [
	"amountWrittenOff",
	"fine",
	"historicalInterest",
	"charge",
	"succumbence",
	"updateAmountWrittenOff",
	"creditedAmount",
	"incomeTax",
	"electronicTransferRate",
	"totalAmountWrittenOff",
	"covenantRate",
	"updateValueCredited",
	"valueGuarantee",
	"exercise",
];
const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"8": "Erro na contabilização",
	"20": "",
};

const IndexMultiple = () => {
	
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const accontabilityArray = useSelector(getAccountabilityArray);
	const creditReceipt = useSelector(getCreditReceipt);
	
	const [reverseInitialValue, setReverseInitialValue] = useState<any>(null);
	const { guaranteeModality } = useGuaranteeModality();
	const { location: { pathname }, ...history } = useHistory();
	const { name, id } = useSelector(getDataCurrentUser);
	const [, idLinkForAccounting] = pathname.split(";");
	const isReverse = pathname.includes(";");

	const verifyBearishReason = (accontabilitYArray: any[]) => {
		for (let i = 0; i < accontabilitYArray.length; i++) {
			if (accontabilitYArray[i].bearishReasons === 4 || accontabilitYArray[i].bearishReasons === 8) {
			return true;
			}
		}
		return false;
	}

	if (accontabilityArray.length === 0 && !isReverse) history.goBack();

	let creditedAmount = 0;

	if (accontabilityArray.length !== 0) {
		creditedAmount = accontabilityArray.reduce(
			(soma, { totalAmountWrittenOff }) => totalAmountWrittenOff + soma,
			0
		);
	}

	if (creditReceipt.length !== 0) {
		creditedAmount += creditReceipt.reduce(
			(soma, { creditValue }) => creditValue + soma,
			0
		);
	}
	const formInitialValues = useMemo(() => {
		const initialValues = {
			amountWrittenOff: creditedAmount,
			totalAmountWrittenOff: 0,
			fine: 0,
			historicalInterest: 0,
			charge: 0,
			succumbence: 0,
			updateAmountWrittenOff: 0,
			licenseType: "",
			accountType: "",
			releaseType: "",
			sapEntryNumber: "",
			documentDate: null,
			creditedAmount,
			incomeTax: 0,
			electronicTransferRate: 0,
			covenantRate: 0,
			updateValueCredited: 0,
			submissionDate: null,
			pendingTime: "",
			bankToSendLicence: "",
			ctgTransfered: "",
			accountTransferred: "",
			note: "",
			justification: "",
			bearishReasons:
				accontabilityArray === undefined || accontabilityArray[0] === undefined
					? 0
					: accontabilityArray[0].bearishReasons,
			licenseDate: null,
			replacementGoodGuaranteeId: null,
			evaluationDescription: "",
			guaranteeDate: null,
			valueGuarantee: 0,
			status: 1,
			statusFlowId: 1,
			numberOfCasualties:
				accontabilityArray === undefined || accontabilityArray[0] === undefined
					? 0
					: accontabilityArray.length + creditReceipt.length,
			evaluator: name,
			valuationDate: moment().format("YYYY-MM-DD"),
			exercise: 0,
			company: "",
			reasonforoccurrence: "",
			files: [],
			bankId: "",
		} as any;

		if (isReverse && reverseInitialValue !== null) {
			return {
				...fillIfValue<any>(
					{
						...reverseInitialValue,
						company: reverseInitialValue.companySap,
						exercise: reverseInitialValue.exerciceSap,
						reasonforoccurrence: reverseInitialValue.reasonForOccurrence
					},
					initialValues
				),
				statusFlowId: 3,
				writeOffDate: moment().format("YYYY-MM-DD"),
			};
		}

		return initialValues;
	}, [
		accontabilityArray,
		creditReceipt,
		name,
		creditedAmount,
		isReverse,
		reverseInitialValue,
	]);

	useRegisterDefault({
		action: "guaranteeAccountability",
		getStatus,
		getErrorMessage,
	});

	const onJustify = useCallback(
		(normalizedValues: any) => {
			const component = (
				<JustificationModal
					reason={"reversed"}
					onSubmitJustification={async ({
						justification,
						rejectionAndReturnReasonsId,
					}: TJustificationModalForm) => {
						await dispatch(
							addGuaranteeAccountabilityReverse({
								files: normalizedValues.files,
								creditReceiptIds: [...creditReceipt.map(({ id }) => Number(id))],
								accountabilityIds: [
									...accontabilityArray.map(({ id }) => Number(id)),
								],
								note: normalizedValues.note,
								email: normalizedValues.email,
								evaluationDescription: normalizedValues.evaluationDescription,
								justification,
								rejectionAndReturnReasonsId
							})
						);
						await dispatch(clearAll());
					}
					}
					moduloId={9}
				/>
			);

			modal({
				title: "Justificativa estorno prestação de contas",
				component,
				buttons: [],
				dialogProps: {
					maxWidth: "md",
					showCloseButton: true,
					fullWidth: true,
				},
			});
		},
		[accontabilityArray, dispatch, creditReceipt]
	);

	const onSubmit = useCallback(
		async (values: any, { setSubmitting }: FormikHelpers<any>) => {
			setSubmitting(true);
			const normalizedValues = valuesToNumber<any>(numberFields, {
				...values,
			});
			if (isReverse) {
				onJustify(normalizedValues)
				return;
			}

			const finalValues = {
				evaluateAccountabilities: {
					accountabilityIds: [...accontabilityArray.map(({ id }) => id)],
					sapDocument: normalizedValues.sapEntryNumber,
					observation: normalizedValues.evaluationDescription,
					documentDate: normalizedValues.documentDate,
					creditedAmount: normalizedValues.creditedAmount,
					incomeTax: normalizedValues.incomeTax,
					covenantRate: normalizedValues.covenantRate,
					updateValueCredited: normalizedValues.updateValueCredited,
					writeOffQuantity: accontabilityArray.length + creditReceipt.length,
					writeOffDate: moment(normalizedValues.writeOffDate).format(
						"YYYY-MM-DD"
					),
					sendBankDate:
						normalizedValues.submissionDate !== null
							? moment(normalizedValues.submissionDate).format("YYYY-MM-DD")
							: null,
					accountabilityStatus: normalizedValues.statusFlowId,
					situation: normalizedValues.status,
					explicationNote: normalizedValues.note,
					bankAccount: normalizedValues.bankToSendLicence,
					email: normalizedValues.email,
					pendingTime: Number.isNaN(normalizedValues.pendingTime)
						? null
						: normalizedValues.pendingTime,
					ctgTransfered: normalizedValues.ctgTransfered,
					evaluatorId: id,
					evaluationDate: moment().format("YYYY-MM-DD"),
					tedRate: normalizedValues.electronicTransferRate,
					company: normalizedValues.company,
					exercise: normalizedValues.exercise,
					guaranteeValue: normalizedValues.valueGuarantee,
					guaranteeDate: normalizedValues.guaranteeDate,
					bankTransferred: normalizedValues.bankId,
					transferredAccount: normalizedValues.accountTransferred,
					reasonforoccurrence: normalizedValues.reasonforoccurrence,
				},
				evaluateCreditReceipts: {
					creditReceiptIds: [...creditReceipt.map(({ id }) => id)],
					sapDocument: normalizedValues.sapEntryNumber,
					observation: normalizedValues.evaluationDescription,
					documentDate: normalizedValues.documentDate,
					creditedAmount: normalizedValues.creditedAmount,
					incomeTax: normalizedValues.incomeTax,
					covenantRate: normalizedValues.covenantRate,
					updateValueCredited: normalizedValues.updateValueCredited,
					writeOffQuantity: accontabilityArray.length + creditReceipt.length,
					writeOffDate: moment(normalizedValues.writeOffDate).format(
						"YYYY-MM-DD"
					),
					sendBankDate:
						normalizedValues.submissionDate !== null
							? moment(normalizedValues.submissionDate).format("YYYY-MM-DD")
							: null,
					evaluatorId: id,
					evaluationDate: moment().format("YYYY-MM-DD"),
					status: 10,
					tedRate: normalizedValues.electronicTransferRate,
					company: normalizedValues.company,
					exercise: normalizedValues.exercise,
					account: normalizedValues.bankToSendLicence,
					reasonforoccurrence: normalizedValues.reasonforoccurrence,
				},
				files: normalizedValues.files,
			};

			const haveToCompare = verifyBearishReason(accontabilityArray);

			if(haveToCompare === true){
				if(Number(formInitialValues?.amountWrittenOff.toFixed(2)) > finalValues?.evaluateAccountabilities?.guaranteeValue){
					return enqueueSnackbar("Valor da Garantia inferior ao valor baixado", {
						variant: "error",
					});
				}
			} 

			const {payload} = await dispatch(addGuaranteeAccountabilityMultiples(finalValues)) as any;
			
			if(payload?.status === 500) return;
			await dispatch(clearAll());
			setSubmitting(false); 
		},
		[accontabilityArray, creditReceipt, dispatch, id, isReverse, onJustify]
	);
	
	const getDataIsReverse = useCallback(async () => {
		const accountability = await guaranteeModalityAPI.listReversal({
			idLinkForAccounting,
		});

		const { items } = accountability.data;

		dispatch(
			setAccontabilityArray(
				items.map((item: any) => {
					const { guaranteeModeId, requestTypeId, guaranteeDate } =
						item.goodsGuaranteesRequest ?? {};
					const { description } =
						guaranteeModality.find(({ id }) => id === guaranteeModeId) ?? {};
					const accountabilyStatusText =
						accountabilityStatusOptionsAsObject[item.statusFlowId];
					const situationText = situationStatusOptionsAsObject[item.status];
					return {
						...item,
						guaranteeDate,
						accountabilityStatusToShow: accountabilyStatusText,
						situationToShow: situationText,
						amountWrittenOff: item.totalAmountWrittenOff,
						guaranteeModality: description,
						statusTextApproval:
							(statusTextApprovals as any)[item.statusApprovalId ?? "10"] ?? "",
						bearishReasonsText:
							bearishReasonsOptionsList.find(
								(britem) => britem.value === Number(item?.bearishReasons)
							)?.label ?? "",
						requestTypeId,
					};
				})
			)
		);

		if (items?.length !== 0) setReverseInitialValue(items[0]);

		const creditReceipt = await apiCreditReceipt.listReversal({
			idLinkForAccounting,
		});

		dispatch(setCreditReceipt(creditReceipt.data.items));

	}, [idLinkForAccounting, dispatch, guaranteeModality]);

	useEffect(() => {
		dispatch(
			fetchPaymentType({
				pageSize: 100,
				notPaginate: true,
				modulo: Modulos.Pagamento,
			})
		);

		if (isReverse) getDataIsReverse();

	}, [dispatch, isReverse, getDataIsReverse]);

	return (
		<ScreenTemplate>
			<TableAccontability isReverse={isReverse} />
			<CreditReceipt hiddeAddNew={isReverse} />
			<Form
				initialValues={formInitialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Attachments name="files" />
						<EvaluationFrom
							hasItem={false}
							readOnly={false}
							isReverseAccountability={
								accontabilityArray === undefined ||
								accontabilityArray[0] === undefined
									? false
									: accontabilityArray[0].bearishReasons === 2
							}
							isVisible
							bearishReasons={
								accontabilityArray === undefined ||
								accontabilityArray[0] === undefined
									? 0
									: accontabilityArray[0].bearishReasons
							}
							isReverse={isReverse}
						/>
						<Box mt="20px" textAlign="right">
							<Button
								variant="outlined"
								onClick={() => {
									dispatch(clearAll());
									history.push(pathname.replace(/\/[^/]+$/, ""));
								}}
							>
								Cancelar
							</Button>
							<Submit submitting={isSubmitting} style={{ marginLeft: "8px" }} />
						</Box>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default IndexMultiple;
