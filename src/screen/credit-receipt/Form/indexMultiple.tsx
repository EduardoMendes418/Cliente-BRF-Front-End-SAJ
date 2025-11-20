import { useCallback, useMemo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ScreenTemplate from "src/components/Screen";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { addGuaranteeCreditMultiples } from "src/core/store/modules/guarantee-accountability/thunks";
import { Button } from "@material-ui/core";
import { clearAll } from "src/core/store/modules/guarantee-accountability";

import {
	getStatus,
	getErrorMessage,
} from "src/core/store/modules/guarantee-accountability/selectors";
import CreditReceipt from "src/screen/goods-and-guarantees/accountability/Form/componentsMultiple/CreditReceipt";
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
import { TUserDefault } from "src/core/models/users";
import apiCreditReceipt from "src/core/api/credit-receipt";
import { fillIfValue } from "src/core/utils/func";
import {
	setCreditReceipt,
} from "src/core/store/modules/guarantee-accountability";
import { fetchExplanatoryNote } from "src/core/store/modules/explanatory-note/thunks";
import { getListExplanatoryNote } from "src/core/store/modules/explanatory-note/selectors";
import EvaluatorForm from "./EvaluatorForm";
import JustificationModal, { TForm } from "src/components/JustificationModal";
import { modal } from "src/components/modals";
import {
	addGuaranteeCreditReceipReverse
} from "src/core/store/modules/credit-receipt/thunks";
import {
	getStatusCreditReceipt,
	getErrorMessageCreditReceipt,
} from "src/core/store/modules/credit-receipt/selectors";
import {
	STATUS_CREDIT_RECEIPT,
} from "../constants";
const numberFields = [
	"evaluatorCovenantRate",
	"evaluatorCreditedAmount",
	"evaluatorElectronicTransferRate",
	"evaluatorIncomeTax",
	"evaluatorUpdateValueCredited",
];

const IndexMultiple = () => {
	const dispatch = useDispatch<AppDispatch>();
	const creditReceipt = useSelector(getCreditReceipt);
	const {
		location: { pathname },
		...history
	} = useHistory();
	const { name, id } = useSelector(getDataCurrentUser);
	const noteTypes = useSelector(getListExplanatoryNote)

	const [reverseInitialValue, setReverseInitialValue] = useState<any>(null);

	const [, idLinkForAccounting] = pathname.split(";");
	const isReverse = pathname.includes(";");
	if (creditReceipt.length === 0 && !isReverse) history.goBack();

	const formInitialValues = useMemo(
		() => {
			const initialValues = {
				id: 0,
				requestDate: moment().format("YYYY-MM-DD"),
				statusFlowId: STATUS_CREDIT_RECEIPT.NONE,
				paymentTypeId: "",
				creditValue: creditReceipt.reduce((soma, { creditValue }) => creditValue + soma, 0),
				licenseNumber: "",
				creditJudicialAccount: "",
				restatementInterestAmount: false,
				observation: "",
	
				evaluatorCompany: "",
				evaluatorExercise: "",
				evaluatorSapDocument: "",
				evaluatorDocumentDate: null,
				evaluatorCreditedAmount: 0,
				evaluatorIncomeTax: 0,
				evaluatorElectronicTransferRate: 0,
				evaluatorCovenantRate: 0,
				evaluatorAccount: "",
				evaluatorUpdateValueCredited: 0,
				evaluatorWriteOffDate: null,
				evaluatorSendBankDate: null,
				evaluatorPendingTime: 0,
				evaluatorObservation: "",
				process: "",
				evaluatorUserId: Number(id),
				evaluatorUser: { name, id } as TUserDefault,
				evaluatorDate: moment().format("YYYY-MM-DD"),
				evaluatorWriteOffQuantity: "",
	
				paymentId: undefined,
				files: [],
			}
			if (isReverse && reverseInitialValue !== null) {
				return {
					...fillIfValue<any>(reverseInitialValue, initialValues),
					statusFlowId: 3,
					writeOffDate: moment().format("YYYY-MM-DD")
				};
			}
			return initialValues
		},
		
		[name, id, creditReceipt, isReverse, reverseInitialValue]
	);

	useRegisterDefault({
		action: "guaranteeAccountability",
		getStatus,
		getErrorMessage,
	});
	useRegisterDefault({
		action: "creditReceipt",
		getStatus : getStatusCreditReceipt,
		getErrorMessage : getErrorMessageCreditReceipt,
	});
	const getDataIsReverse = useCallback(async () => {
		const creditReceipt = await apiCreditReceipt.listReversal({
			idLinkForAccounting,
		});
		if (creditReceipt.data.items.length !== 0) 
			setReverseInitialValue(creditReceipt.data.items[0]);
		dispatch(setCreditReceipt(creditReceipt.data.items));
	}, [idLinkForAccounting, dispatch]);
	useEffect(() => {
		if (isReverse) {
			getDataIsReverse()
			dispatch(fetchExplanatoryNote({ notPaginate: true }))
		};
			;
	}, [dispatch, isReverse, getDataIsReverse]);
	const onJustify = useCallback((normalizedValues: any) => {

		const component = (
			<JustificationModal
				reason={ "reversed" }
				moduloId={9}
				onSubmitJustification={async(justificationValues: TForm) =>
					{
						await dispatch(
							addGuaranteeCreditReceipReverse({
								files: normalizedValues.files,
								creditReceiptIds: [...creditReceipt.map(({ id }) => Number(id))],
								accountabilityIds: [],
								note: noteTypes.find((item) => item.description === "REVERSÃO")?.id ?? 0,
								email: "",
								evaluationDescription: normalizedValues.evaluatorObservation,
								justification: justificationValues.justification,
								rejectionAndReturnReasonsId: justificationValues.rejectionAndReturnReasonsId
							})
						)
						await dispatch(clearAll());
					}
				}
			/>
		);

		modal({
			title: "Justificativa estorno recebimento de crédito",
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	}, [creditReceipt, dispatch, noteTypes]);
	const onSubmit = useCallback(
		async (values: any, { setSubmitting }: FormikHelpers<any>) => {
			setSubmitting(true);
			const normalizedValues = valuesToNumber<any>(numberFields, {
				...values,
			});

			if (isReverse) {
				onJustify(normalizedValues)
				setSubmitting(false);
				return;
			}

			const finalValues = {
				evaluateAccountabilities: {
					accountabilityIds: [],
					sapDocument: normalizedValues.evaluatorSapDocument,
					observation: normalizedValues.evaluatorObservation,
					documentDate: normalizedValues.evaluatorDocumentDate,
					creditedAmount: normalizedValues.evaluatorCreditedAmount,
					incomeTax: normalizedValues.evaluatorIncomeTax,
					covenantRate: normalizedValues.evaluatorCovenantRate,
					updateValueCredited: normalizedValues.evaluatorUpdateValueCredited,
					writeOffQuantity: creditReceipt.length,
					writeOffDate: moment(normalizedValues.evaluatorWriteOffDate
						).format(
						"YYYY-MM-DD"
					),
					sendBankDate:
						normalizedValues.evaluatorSendBankDate !== null
							? moment(normalizedValues.evaluatorSendBankDate).format("YYYY-MM-DD")
							: null,
					accountabilityStatus: normalizedValues.statusFlowId,
					situation: 0,
					explicationNote: 1,
					bankAccount: 0,
					email: "",
					pendingTime: normalizedValues.evaluatorPendingTime,
					ctgTransfered: "",
					evaluatorId: id,
					evaluationDate: moment().format("YYYY-MM-DD"),
					tedRate: 0,
					company: normalizedValues.evaluatorCompany,
					exercise: normalizedValues.evaluatorExercise,
					guaranteeValue: normalizedValues.evaluatorCreditedAmount,
					guaranteeDate: normalizedValues.evaluatorDate,
					transferredAccount: "",
					reasonforoccurrence: 0,
				},
				evaluateCreditReceipts: {
					creditReceiptIds: [...creditReceipt.map(({ id }) => id)],
					sapDocument: normalizedValues.evaluatorSapDocument,
					observation: normalizedValues.evaluatorObservation,
					documentDate: normalizedValues.evaluatorDocumentDate,
					creditedAmount: normalizedValues.evaluatorCreditedAmount,
					incomeTax: normalizedValues.evaluatorIncomeTax,
					covenantRate: normalizedValues.evaluatorCovenantRate,
					updateValueCredited: normalizedValues.evaluatorUpdateValueCredited,
					writeOffQuantity: creditReceipt.length,
					writeOffDate: moment(normalizedValues.evaluatorWriteOffDate).format(
						"YYYY-MM-DD"
					),
					sendBankDate:
						normalizedValues.evaluatorSendBankDate !== null
							? moment(normalizedValues.evaluatorSendBankDate).format("YYYY-MM-DD")
							: null,
					evaluatorId: id,
					evaluationDate: moment().format("YYYY-MM-DD"),
					status: 10,
					tedRate: normalizedValues.evaluatorElectronicTransferRate,
					company: normalizedValues.evaluatorCompany,
					exercise: normalizedValues.evaluatorExercise,
					account: normalizedValues.evaluatorAccount,
					restatementInterestAmount: normalizedValues.restatementInterestAmount
				},
				files: normalizedValues.files,
			};
			
			if(values.restatementInterestAmount === false) delete finalValues.evaluateCreditReceipts.restatementInterestAmount

			await dispatch(addGuaranteeCreditMultiples(finalValues));
			await dispatch(clearAll());
			setSubmitting(false);
		},
		[creditReceipt, dispatch, id, isReverse, onJustify]
	);

	return (
		<ScreenTemplate>
			<CreditReceipt hiddeAddNew />
			<Form
				initialValues={formInitialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<EvaluatorForm readonly={isReverse} statusFlowId={3} isMultiple isReversal={isReverse} />
						<Attachments name="files" />
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
