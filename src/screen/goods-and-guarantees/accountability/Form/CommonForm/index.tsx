import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";

import JustificationDisplay from "src/components/JustificationDisplay";
import Attachments from "src/components/Attachments";
import { Submit } from "src/components/button";
import Form from "src/components/form";
import Logs from "src/components/Logs";

import { useTranslation } from "src/locale/i18n";
import {
	getStatus,
	getErrorMessage,
} from "src/core/store/modules/guarantee-accountability/selectors";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { useRegisterDefault } from "src/hooks";

import { useAccountability } from "../hooks/useAccountability";
import useFormPermission from "../hooks/useFormPermission";
import {
	ACCOUNTABILITY_SITUATION,
	accountabilityStatusOptionsAsObject,
	ACCOUNTABILITY_STATUS,
	requesterAccountabilityStatus,
} from "../../constants";
import RequesterForm from "./RequesterForm";
import EvaluationForm from "./EvaluationForm";
import CancelButton from "src/components/button/Cancel";
import {
	getOrders,
	getPaymentOrders,
} from "src/core/store/modules/provision-order/selectors";
import apiAccountability from "src/core/api/guarantee-accountability"
import { useMemo } from "react";
import {
	getDataCurrentUser,
} from "src/core/store/modules/currentUser/selectors";
import moment from "moment";

type Props = {
	hasItem: boolean;
	itemAccountability: TGuaranteeAccountability;
	itemRequest: TGoodsGuaranteesRequest;
	isSolicitacao: boolean;
	isReversal: boolean
};

const CommonForm = ({
	hasItem,
	itemAccountability,
	itemRequest,
	isSolicitacao,
	isReversal
}: Props) => {
	const { t } = useTranslation();

	const statusSubmit = useSelector(getStatus);
	const orders = useSelector(getOrders);
	const paymentOrders = useSelector(getPaymentOrders);
	const currentUser = useSelector(getDataCurrentUser);

	useRegisterDefault({
		action: "guaranteeAccountability",
		getStatus,
		getErrorMessage,
	});

	const { isApprover, isRequester } = useFormPermission();

	const { onSubmit, initialValues, accountabilityFormFormSchema } =
		useAccountability({
			hasItem,
			itemAccountability,
			itemRequest,
			isRequester,
			orders,
			paymentOrders,
			isSolicitation: isRequester,
			isReversal
		});

	const { guaranteeModalityTypeFlowAsObject } = useGuaranteeModality();

	const rejected =
		itemAccountability.status === ACCOUNTABILITY_SITUATION.REJECTED;
	const returned = requesterAccountabilityStatus.includes(
		itemAccountability.statusFlowId
	);
	const reversed =
		itemAccountability.statusFlowId === ACCOUNTABILITY_STATUS.OVERTURNED;

	let reasonType: "returned" | "rejected" | "reversed" = "returned";
	if (!returned) reasonType = rejected ? "rejected" : "reversed";

	const { statusFlowId } = itemAccountability;

	const isRequesterFormReadOnly =
		rejected ||
		!(
			statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL ||
			statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_OFFICE
		);
	const isEvaluatorFormReadOnly =
		hasItem &&
		(rejected || !isApprover ||
			!(
				statusFlowId === ACCOUNTABILITY_STATUS.PENDING ||
				statusFlowId === ACCOUNTABILITY_STATUS.IN_CANCELLATION ||
				statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS ||
				statusFlowId === ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL
			));
	const isFormEditable =
		!hasItem || !isApprover
			? statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL ||
			  statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_OFFICE
			: statusFlowId === ACCOUNTABILITY_STATUS.PENDING ||
			  statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS ||
			  statusFlowId === ACCOUNTABILITY_STATUS.IN_CANCELLATION ||
			  statusFlowId === ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL;
	const isSaveButtonVisible = !hasItem || isFormEditable;
	const isEvaluatorFormVisible =
		(hasItem && isApprover) ||
		(hasItem &&
			isRequester &&
			itemAccountability.evaluator !== null);

	const typeFlow = (guaranteeModalityTypeFlowAsObject as any)[itemRequest.guaranteeModalityId] ?? "";
	
	const formInitialValues = useMemo(() => {
		let formInitialValues = {
			...initialValues, 
			reverseAccounting: false
		}
		if (isReversal) {
			formInitialValues = {
				...formInitialValues, 
				statusFlowId: ACCOUNTABILITY_STATUS.OVERTURNED,
				valuationDate: moment().format("YYYY-MM-DD"),
				evaluator: currentUser.name ?? ""
			}
		}
		return formInitialValues
	},[initialValues, isReversal, currentUser.name])

	return (
		<Form
			initialValues={formInitialValues}
			onSubmit={onSubmit}
			validationSchema={!isReversal ? accountabilityFormFormSchema : undefined}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, setSubmitting }) => (
				<form noValidate onSubmit={handleSubmit}>
					<RequesterForm
						itemAccountability={itemAccountability}
						readOnly={hasItem && isRequesterFormReadOnly}
						isSolicitacao={isSolicitacao}
					/>
					<EvaluationForm
						isVisible={isEvaluatorFormVisible}
						readOnly={isEvaluatorFormReadOnly || isReversal}
						typeFlow={typeFlow}
						statusFlowId={itemAccountability?.statusFlowId}
					/>
					<Attachments
						name="files"
						onDelete={({id}) => apiAccountability.deleteFile(id)}
						disabled={isReversal}
						label={t("goodsAndGuarantees:tasks.accountabilityAttachments")}
					/>
					{(rejected || returned || reversed) && (
						<JustificationDisplay
							logs={itemAccountability.logs}
							status={itemAccountability.statusFlowId}
							type={reasonType}
							moduloId={9}
						/>
					)}
					{!isReversal && <Logs
						logs={itemAccountability.logs}
						statuses={accountabilityStatusOptionsAsObject}
						statusOrder={["flow"]}
					/>}
					{(isSaveButtonVisible || isReversal) && (
						<Box mt="20px" textAlign="right">
							<CancelButton />
							<Submit submitting={isSubmitting || statusSubmit === "saving"} />
						</Box>
					)}
					{statusSubmit === "failure" && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Form>
	);
};

export default CommonForm;
