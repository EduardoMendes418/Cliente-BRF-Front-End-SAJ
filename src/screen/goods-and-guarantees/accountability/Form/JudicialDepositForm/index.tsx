import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { Grid } from '@material-ui/core';

import Attachments from "src/components/Attachments";
import Logs from "src/components/Logs";
import { Submit } from "src/components/button";
import Form from "src/components/form";

import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import {
	getStatus,
	getErrorMessage,
} from "src/core/store/modules/guarantee-accountability/selectors";
import { fillIfValue } from "src/core/utils/func";
import { useRegisterDefault } from "src/hooks";
import { useTranslation } from "src/locale/i18n";

import { useAccountability, TForm } from "../hooks/useAccountability";
import useFormPermission from "../hooks/useFormPermission";
import { BEARISH_REASONS } from "../../../constants";
import {
	getGuaranteeAccountabilityAccounting
} from 'src/core/store/modules/guarantee-accountability/selectors'

import {
	depositAccountabilityStatusOptionsAsObject,
	ACCOUNTABILITY_SITUATION,
	requesterAccountabilityStatus,
	ACCOUNTABILITY_STATUS,
} from "../../constants";

import EvaluationForm from "./EvaluationForm";
import RequesterForm from "./RequesterForm";
import CancelButton from "src/components/button/Cancel";
import ProssibleApprovers from "src/components/Logs/PossibleApprovers";
import {
	getOrders,
	getPaymentOrders,
} from "src/core/store/modules/provision-order/selectors";
import FieldColumn from 'src/components/FieldColumn';
import Panel from 'src/components/Panel';
import JustificationDisplay from "src/components/JustificationDisplay";
import apiAccountability from "src/core/api/guarantee-accountability"
import {
	getDataCurrentUser,
} from "src/core/store/modules/currentUser/selectors";
import moment from "moment";

type Props = {
	hasItem: boolean;
	itemAccountability: TGuaranteeAccountability;
	itemRequest: TGoodsGuaranteesRequest;
	isSolicitacao: boolean;
	setBearishReason: (event: any) => void;
	bearishReason: BEARISH_REASONS | "";
	reversalJudicialDepositSap: any;
	form: any
};

const JudicialDepositForm = ({
	hasItem,
	itemAccountability,
	itemRequest,
	bearishReason,
	setBearishReason,
	reversalJudicialDepositSap,
	form
}: Props) => {

	const isReverseAccountability = bearishReason === BEARISH_REASONS.RELEASED_TO_COMPANY || bearishReason === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT;
	const currentUser = useSelector(getDataCurrentUser);
	const { location: { pathname } } = useHistory();
	const { t } = useTranslation();
	
	let { id } = useParams<{ id: string }>();
	let isReversal = false
	if (id.includes(";")) {
		id = id.split(";")[0];
		isReversal = true
	};

	const isNew = id === 'novo';
	const statusSubmit = useSelector(getStatus);
	const orders = useSelector(getOrders);
	const paymentOrders = useSelector(getPaymentOrders);
	const accounting = useSelector(getGuaranteeAccountabilityAccounting);
	useRegisterDefault({
		action: "guaranteeAccountability",
		getStatus,
		getErrorMessage,
	});

	const {
		isApprover,
		isRequester,
		canEdit,
		canEditEvaluationForm,
		canEditRequesterForm,
	} = useFormPermission();

	const rejected = itemAccountability.status === ACCOUNTABILITY_SITUATION.REJECTED;
	const returned = requesterAccountabilityStatus.includes(itemAccountability.statusFlowId);
	const isSolicitation = pathname.startsWith('/bens-e-garantias/prestacao-de-contas-solicitacao');
	const reversed = itemAccountability.statusFlowId === ACCOUNTABILITY_STATUS.OVERTURNED;

	let reasonType: "returned" | "rejected" | "reversed" = "returned";
	if (!returned) reasonType = rejected ? "rejected" : "reversed";
	
	const { pending, onSubmit, initialValues, accountabilityFormFormSchema } =
		useAccountability({
			hasItem,
			itemAccountability,
			itemRequest,
			isJudicialDeposit: true,
			isRequester,
			orders,
			paymentOrders,
			isSolicitation,
			isReversal
		});

	const { status, statusFlowId } = itemAccountability;

	const isRequesterFormReadOnly = rejected || !canEditRequesterForm(statusFlowId, status, false);
	const isEvaluatorFormReadOnly = hasItem && (rejected || !canEditEvaluationForm(statusFlowId, status, false));
	const isFormEditable = !hasItem || (canEdit(statusFlowId, status, false) && (statusFlowId !== 1 || status === 0)) || isReversal;
	const isSaveButtonVisible = !hasItem || isFormEditable;

	const onBearishReasonsChanges = (event: any) => {
		const selectedValue = event.target.value;
		setBearishReason(selectedValue);
	};

	const formInitialValues = useMemo(() => {
		const formInitialValues = {
			...initialValues,
			amountWrittenOff: 0,
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
			creditedAmount: 0,
			incomeTax: 0,
			numberOfCasualties: "",
			electronicTransferRate: 0,
			covenantRate: 0,
			updateValueCredited: itemAccountability?.amountWrittenOff ?? 0,
			submissionDate: null,
			pendingTime: "",
			bankToSendLicence: "",
			ctgTransfered: "",
			accountTransferred: "",
			note: "",
			justification: "",
			bearishReasons: bearishReason,
			licenseDate: null,
			replacementGoodGuaranteeId: null,
			evaluationDescription: "",
			guaranteeDate: null,
			valueGuarantee: 0,
			judicialBlocksAndTransferId: itemRequest.judicialBlocksAndTransferId,
			reverseAccounting: isSaveButtonVisible && !isSolicitation && isReverseAccountability,
			reasonForOccurrence: "",
			valuationDate: "",
			evaluator: "",
			reverseAccountingChecked: false
		};

		let finalInitialValues = {...fillIfValue<TGuaranteeAccountability>(
			itemAccountability,
			formInitialValues as any
		)};

		// AVALIAR
		if(isApprover){
			finalInitialValues = {
				...finalInitialValues, 
				valuationDate: moment().format("YYYY-MM-DD"),
				evaluator: currentUser.name as string
			}
		};

		return finalInitialValues;
	}, [
		isApprover,
		isRequester,
		initialValues, 
		hasItem,
		itemAccountability, 
		itemRequest, 
		bearishReason, 
		isReversal,
		isSolicitation, 
		isSaveButtonVisible, 
		isReverseAccountability,
		currentUser.name
	]) as TForm;
	
	useEffect(() => {
		if (hasItem) setBearishReason(itemAccountability.bearishReasons);
	}, [hasItem, itemAccountability, setBearishReason]);

	return (
		<Form
			innerRef={form}
			initialValues={formInitialValues}
			onSubmit={onSubmit}
			validationSchema={accountabilityFormFormSchema}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, setSubmitting, values }) => { 
				const RequesterFormReadOnly = (hasItem && isRequesterFormReadOnly) || (values?.reverseAccounting ?? false)
				const EvaluationFormFormReadOnly = (isSolicitation || isEvaluatorFormReadOnly || !isFormEditable) && !(values?.reverseAccounting ?? false)
				return (
				<form noValidate onSubmit={handleSubmit}>
					<RequesterForm
						isReverseAccountability={false}
						onBearishReasonsChanges={onBearishReasonsChanges}
						itemAccountability={itemAccountability}
						itemRequest={itemRequest}
						hasItem={hasItem}
						isRequester={isRequester}
						readOnly={RequesterFormReadOnly}
					/>
					{(!isNew || (values?.reverseAccounting ?? false)) && <EvaluationForm
						hasItem={hasItem}
						readOnly={EvaluationFormFormReadOnly}
						isReverseAccountability={isReverseAccountability || (values?.reverseAccounting ?? false)}
						isVisible={
							(hasItem && (isApprover || !pending)) ||
							(!hasItem && isReverseAccountability)
							|| (values?.reverseAccounting ?? false)
						}
						bearishReasons={values.bearishReasons}
						statusFlowId={itemAccountability.statusFlowId}
						isReversal={isReversal}
					/>}
					<Attachments
						name="files"
						disabled={!isFormEditable}
						onDelete={({id}) => apiAccountability.deleteFile(id)}
						label={t("goodsAndGuarantees:tasks.attachmentsTask")}
					/>
					{(rejected || returned || reversed) && (
						<JustificationDisplay
							logs={itemAccountability.logs}
							status={itemAccountability.statusFlowId}
							type={reasonType}
							moduloId={9}
						/>
					)}
					{!isReversal && itemAccountability?.accountabilityApprovals && itemAccountability?.accountabilityApprovals.map && <ProssibleApprovers items={itemAccountability?.accountabilityApprovals.map((item) => ({
							...item, 
							approverName: item?.nameApprover ?? "",
							hierarchyDescription: item?.codeHierarchy ?? "",
						})) ?? []} />}
					{!isReversal && hasItem && accounting[0]?.documentNumber !== "" && accounting[0]?.exercice !== "" && (
						<Panel title={t('accounting.title')} withPadding>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.releaseDate')}
										value={accounting[0]?.releaseDate ?? null}
										type='date'
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.sapReleaseNumber')}
										value={`${accounting[0]?.company ?? ''} ${accounting[0]?.exercice ?? ''} ${accounting[0]?.documentNumber ?? ''}`}
									/>
								</Grid>
							</Grid>
						</Panel>
					)}
					{!isReversal && hasItem && accounting?.length > 1 && (
						<Panel title={t('accounting.reclassification')} withPadding>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.releaseDate')}
										value={accounting[1]?.releaseDate ?? null}
										type='date'
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.sapReleaseNumber')}
										value={`${accounting[1]?.company ?? ''} ${accounting[1]?.exercice ?? ''} ${accounting[1]?.documentNumber ?? ''}`}
									/>
								</Grid>
							</Grid>
						</Panel>
					)}
					{!isReversal && hasItem && reversalJudicialDepositSap.documentNumber && reversalJudicialDepositSap.documentNumber !== "" && reversalJudicialDepositSap.exercice !== "" && (
						<Panel title={"Dados da contabilização - Reversão depósito judicial"} withPadding>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.releaseDate')}
										value={reversalJudicialDepositSap?.createdDate ?? null}
										type='date'
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('accounting.sapReleaseNumber')}
										value={`${reversalJudicialDepositSap.company ?? ''} ${reversalJudicialDepositSap.exercice ?? ''} ${reversalJudicialDepositSap.documentNumber ?? ''}`}
									/>
								</Grid>
							</Grid>
						</Panel>
					)}
					<Logs
						logs={itemAccountability.logs}
						statuses={depositAccountabilityStatusOptionsAsObject}
						statusOrder={["flow"]}
					/>
					{isSaveButtonVisible && (
						<Box mt="20px" textAlign="right">
							<CancelButton />
							<Submit submitting={isSubmitting || statusSubmit === "saving"} style={{marginLeft: "8px"}} />
						</Box>
					)}
					{statusSubmit === "failure" && isSubmitting && setSubmitting(false)}
				</form>
				)
			}}
		</Form>
	);
};

export default JudicialDepositForm;
