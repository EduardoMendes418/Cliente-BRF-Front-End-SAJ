import { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import JustificationModal from "src/components/JustificationModal";
import ActionButtons from "src/components/ActionButtons";
import Form, { TextField, EmailField } from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import { confirm, modal } from "src/components/modals";
import Panel from "src/components/Panel";
import { t } from "src/locale/i18n";

import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { TApprovalFormData, TUpdateStatus } from "src/core/models";
import { TForm as TJustificationModalForm } from "../JustificationModal";
import { getPaymentBanks } from "src/core/store/modules/payment/thunks";
import { AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

type Props = {
	item: TApprovalFormData;
	isInternalLawyer?: boolean;
	isInternalLawyerId?: number;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
	page: string;
	updateStatus: (value: TUpdateStatus) => void;
	buttons?: string[];
	approveButtonText?: string;
	hasReason?: boolean;
	approvalConfirmationMessage?: string;
	moduloId: number;
	isSubmitting?: boolean;
	overrideIsInternal?: boolean;
	tipoProcesso?: string;
	typeForm?: string;
	isReversal?: boolean;
};

type TForm = {
	observationOfLegalControl: string;
	observationOfInternalLawyer: string;
	emails?: string;
};

const justificationText = {
	[STATUS_APPROVALS_FLOW.RETURNED]: "approval.justificationReturn",
	[STATUS_APPROVALS_FLOW.CANCELLED]: "approval.justificationCancelled",
	[STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE]: "approval.justificationReject",
	[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE] : "approval.justificationReversed"
};

const ApprovalForm = ({
	item: {
		id,
		isInternal,
		statusFlowId = -1,
		internalLawyerId,
		approverOfLegalControl,
		approvalDateOfLegalControl,
		observationOfLegalControl,
		approverOfInternalLawyer,
		approvalDateOfInternalLawyer,
		observationOfInternalLawyer,
		process,
		tipoProcesso,
		cpf, 
		agencia, //codAgencia
		fornecedorId, //codsapFornTransp
		conta, //codConta
		agenciaDv, //digitoAgencia
		contaDv,//digConta
		bancoId, //codbanco
	},
	isApprovalLegalControl,
	isApprovalInternalLawyer,
	updateStatus,
	page,
	buttons = ["return", "reject", "approve"],
	approveButtonText = t("approval.approve"),
	hasReason = false,
	approvalConfirmationMessage,
	isInternalLawyer = false,
	moduloId,
	isSubmitting,
	overrideIsInternal,
	typeForm,
	isReversal,
}: Props) => {

	const [emailState, setEmailState] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { name, idBrf, isAdmin } = useSelector(getDataCurrentUser);
	const { enqueueSnackbar } = useSnackbar();
	const { location: { pathname } } = useHistory();

	isInternal = isInternalLawyer ? idBrf === (internalLawyerId ? internalLawyerId : process?.internalLawyerId) : isInternal;
	// isInternal = false
	const approvingLegalControl =
		isApprovalLegalControl &&
		[STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(
			statusFlowId
		);
	const approvingInternalLawyer =
		isApprovalInternalLawyer &&
		[STATUS_APPROVALS_FLOW.APPROVED].includes(statusFlowId) &&
		(isInternal || isAdmin || overrideIsInternal);
	const editable = approvingLegalControl || approvingInternalLawyer;

	const initialValues: TForm = {
		observationOfLegalControl: observationOfLegalControl || "",
		observationOfInternalLawyer: observationOfInternalLawyer || "",
	};

	const onSubmit = async ({
		observationOfLegalControl,
		observationOfInternalLawyer,
	}: TForm) => {
		setIsLoading(true)
		if (pathname.includes('pagamentos/aprovacao-advogado-interno') && typeForm === "default") { 
			try {

				const { payload } = await dispatch(getPaymentBanks(cpf!)) as any;
				const {codBanco, digAgencia, digConta, codAgencia, codConta, codsapFornTransp} = payload[0];

				const account = {
						codBanco: codBanco,
						codAgencia: agencia,
						digAgencia: agenciaDv === "X" ? agenciaDv : ( typeof digAgencia === "number" ? Number(agenciaDv) : (Number(agenciaDv) === 0 ? null : Number(agenciaDv))),
						codConta: conta,
						digConta: typeof digConta === "string" ? digConta : (typeof digConta === "number" ? Number(contaDv) : (Number(contaDv) === 0 ? null : Number(contaDv))),
						codsapFornTransp: fornecedorId,
					} as any;

				const banks = {
					codAgencia: codAgencia,
					codBanco: codBanco,
					codConta: codConta,
					codsapFornTransp: codsapFornTransp,
					digAgencia: digAgencia === null || digAgencia === "" ? "0" : digAgencia,
					digConta: digConta === null || digConta === "" ? "0" : digConta,
				} as any;

					const compareBankAccounts = (array: any, objeto: any) => {
						for (const item of array) {
	
						if (JSON.stringify(item) === JSON.stringify(objeto)) {
							return true;
						}
						}
						return false;
					} 

					const result = compareBankAccounts(banks, account);

		if (result === false) {
			setIsLoading(false);
			return enqueueSnackbar("Dados bancários não condizem com o cadastrado no SAP. Favor realizar a devolução do pagamento para correção dos dados bancários.", {
				variant: "error",
			});
		}
	
			} catch (error) {
				console.error(error)
			}
			
		}

		let statusFlowId =
			approvingInternalLawyer && isInternal
				? STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
				: STATUS_APPROVALS_FLOW.APPROVED;
		if (overrideIsInternal) statusFlowId = STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
	
	if (
			approvalConfirmationMessage &&
			!(await confirm(approvalConfirmationMessage, t("message")))
		)
			return;

		const observation = approvingLegalControl
			? observationOfLegalControl
			: observationOfInternalLawyer;

		await updateStatus({
			id: Number(id),
			statusFlowId,
			observation,
			emails: emailState,
		});

		setIsLoading(false);
	};

	const onSaveNewStatusFlow = async (
		statusFlowId: STATUS_APPROVALS_FLOW,
		{ justification, rejectionAndReturnReasonsId }: TJustificationModalForm
	) => {
		await updateStatus({
			id: Number(id),
			statusFlowId,
			observation: justification,
			rejectionAndReturnReasonsId,
			emails: emailState,
		}); 
	};

	const onJustify = (
		status: STATUS_APPROVALS_FLOW,
		reason: "rejected" | "returned" | "reversed" | "cancelled"
	) => {
		const component = (
			<JustificationModal
				reason={
					isReversal
					? "reversed"
					: (isApprovalLegalControl || isApprovalInternalLawyer)
						? reason
						: hasReason
							? reason
							: undefined
				}
				onSubmitJustification={(values: TJustificationModalForm) =>
					onSaveNewStatusFlow(status, values)
				}
				moduloId={moduloId}
			/>
		);

		const title = t((justificationText as any)[status], { page });

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const actionButtons = [
		{
			name: "return",
			label: t("approval.return"),
			onClick: () => onJustify(STATUS_APPROVALS_FLOW.RETURNED, "returned"),
		},
		{
			name: "cancel",
			label: t("approval.cancel"),
			onClick: () => onJustify(STATUS_APPROVALS_FLOW.CANCELLED, "cancelled"),
		},
		{
			name: "reject",
			label: t("approval.reject"),
			onClick: () => onJustify(STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE, "rejected"),
		},
		{
			name: "approve",
			label: approveButtonText,
		},
	].filter(({ name }) => buttons.includes(name));

	if (
		(isApprovalInternalLawyer &&
			[STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(
				statusFlowId
			)) ||
		(!approverOfLegalControl &&
			[
				STATUS_APPROVALS_FLOW.RETURNED,
				STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE,
			].includes(statusFlowId))
	){

		return null;
	}

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={initialValues}
			enableReinitialize
			permission={editable ? undefined : false}
		>
			{({ handleSubmit, status: statusForm }) =>
				statusForm === "readOnly" && !approverOfLegalControl ? null : (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t("approval.title")} withPadding>
							<Typography variant="h3">
								{t("approval.titleLegalControl")}
							</Typography>
							<Box mt={3} mb={4}>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<FieldColumn
											label={t("approval.date")}
											value={approvingLegalControl ? new Date() : approvalDateOfLegalControl}
											type="date"
										/>
									</Grid>
									<Grid item md={9} xs={12}>
										<FieldColumn
											label={t("approval.approver")}
											value={approvingLegalControl ? name : approverOfLegalControl}
										/>
									</Grid>
									<Grid item md={9} xs={12}>
										<EmailField
											name="emails"
											label={"email"}
											onChange={(e: any) => {setEmailState(e.target.value);}}
											readOnly={!approvingLegalControl || isReversal}
										/>
									</Grid>
									<Grid item md={12} xs={12} className="tablecell-observation">
										<TextField
											name="observationOfLegalControl"
											label={t("approval.observation")}
											rows={3}
											multiline
											maxLength={5000}
											readOnly={!approvingLegalControl || isReversal}
										/>
									</Grid>
								</Grid>
							</Box>
							{
							// (isInternal || isAdmin) &&
								(approvingInternalLawyer ||
									STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE ===
										statusFlowId || statusFlowId === STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE) && (
									<>
									{
										approvingInternalLawyer === false && tipoProcesso !== 'SE' ? <>
										<Typography variant="h3">
											{t("approval.titleInternalLawyer")}
										</Typography>
										<Box mt={3}>
											<Grid container spacing={3}>
												<Grid item md={3} xs={12}>
													<FieldColumn
														label={t("approval.date")}
														value={approvingInternalLawyer ? new Date() : approvalDateOfInternalLawyer}
														type="date"
													/>
												</Grid>
												<Grid item md={9} xs={12}>
													<FieldColumn
														label={t("approval.approver")}
														value={approvingInternalLawyer ? name : approverOfInternalLawyer}
													/>
												</Grid>
												<Grid item md={12} xs={12}>
													<TextField
														name="observationOfInternalLawyer"
														label={t("approval.observation")}
														rows={3}
														multiline
														maxLength={5000}
														readOnly={!approvingInternalLawyer}
													/>
												</Grid>
											</Grid>
										</Box>										
										</> : null
									}
									</>
								)}
						</Panel>
						<ActionButtons
							hidden={statusForm === "readOnly"}
							buttons={actionButtons}
							isSubmitting={isSubmitting}
						/>
					</form>
				)
			}
		</Form>
	);
};

export default ApprovalForm;


