import { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

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
import { TForm as TJustificationModalForm } from "src/components/JustificationModal";

type Props = {
	item: TApprovalFormData | any;
	isInternalLawyer?: boolean;
	isInternalLawyerId?: number;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
	isPaymentRequest?: boolean;
	page: string;
	updateStatus: (value: TUpdateStatus) => void;
	buttons?: string[];
	approveButtonText?: string;
	hasReason?: boolean;
	approvalConfirmationMessage?: string;
	moduloId: number;
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
};

const ApprovalForm = ({
	item: {
		id,
		statusFlowId = -1,
		approverOfLegalControl,
		approvalDateOfLegalControl,
		observationOfLegalControl,
		approverOfInternalLawyer,
		approvalDateOfInternalLawyer,
		observationOfInternalLawyer,
		status,
		fluxoAprovacao
	},
	isApprovalLegalControl,
	isApprovalInternalLawyer,
	isPaymentRequest,
	updateStatus,
	page,
	buttons = ["return", "reject", "approve"],
	approveButtonText = t("approval.approve"),
	hasReason = false,
	approvalConfirmationMessage,
	moduloId,
}: Props) => {
	const [emailState, setEmailState] = useState("");
	const { name } = useSelector(getDataCurrentUser);
	const approvingLegalControl = isApprovalLegalControl && [STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(statusFlowId);

	const approvingInternalLawyer = isApprovalInternalLawyer && [STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(statusFlowId);
	const isEditableByStatus = isApprovalLegalControl && status === 6 || status === 22 ;

	const editable = approvingLegalControl || approvingInternalLawyer || isEditableByStatus;

	const initialValues: TForm = {
		observationOfLegalControl: observationOfLegalControl || "",
		observationOfInternalLawyer: observationOfInternalLawyer || "",
	};

	const onSubmit = async ({
		observationOfLegalControl,
		observationOfInternalLawyer,
	}: TForm) => {
		const statusFlowId =
			approvingInternalLawyer || approvingLegalControl
				? STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
				: STATUS_APPROVALS_FLOW.APPROVED;

		if (
			approvalConfirmationMessage &&
			!(await confirm(approvalConfirmationMessage, t("message")))
		)
			return;

		const observation = approvingLegalControl
			? observationOfLegalControl
			: observationOfInternalLawyer;

		updateStatus({
			id: Number(id),
			statusFlowId,
			observation,
			emails: emailState,
		});
	};

	const onSaveNewStatusFlow = (
		statusFlowId: STATUS_APPROVALS_FLOW,
		{ justification, rejectionAndReturnReasonsId }: TJustificationModalForm
	) => {
		updateStatus({
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
				reason={hasReason ? reason : undefined}
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
			onClick: () =>
				onJustify(STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE, "rejected"),
		},
		{
			name: "approve",
			label: approveButtonText,
		},
	].filter(({ name }) => buttons.includes(name));

	if (
		/* (isApprovalInternalLawyer &&
			[STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(
				statusFlowId
			)) ||  */ 
		(!approverOfLegalControl &&
			[
				STATUS_APPROVALS_FLOW.RETURNED,
				STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE,
			].includes(statusFlowId))
	) {
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
				statusForm === "readOnly" && !approverOfLegalControl && !isApprovalInternalLawyer ? null : (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={t("approval.title")} withPadding>
							{ (isPaymentRequest === true || isApprovalLegalControl === true) && fluxoAprovacao === 1 ? <>
								<Typography variant="h3">
								{isApprovalLegalControl === true ? t("approval.titleAdministrativeControl") : t("approval.titleLegalControl")}
								</Typography>
							<Box mt={3} mb={4}>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<FieldColumn
											label={t("approval.date")}
											value={
												approvingLegalControl
													? new Date()
													: approvalDateOfLegalControl
											}
											type="date"
										/>
									</Grid>
									<Grid item md={9} xs={12}>
										<FieldColumn
											label={t("approval.approver")}
											value={
												approvingLegalControl ? name : approverOfLegalControl
											}
										/>
									</Grid>
									<Grid item md={9} xs={12}>
										<EmailField
											name="emails"
											label={"email"}
											onChange={(e: any) => {
												setEmailState(e.target.value);
											}}
											readOnly={!approvingLegalControl}
										/>
									</Grid>
									<Grid item md={12} xs={12} className="tablecell-observation">
										<TextField
											name="observationOfLegalControl"
											label={t("approval.observation")}
											rows={3}
											multiline
											maxLength={5000}
											readOnly={!approvingLegalControl}
										/>
									</Grid>
								</Grid>
		
							</Box> 
							</> : null
							}
							{(approvingInternalLawyer ||
								STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE === statusFlowId ||
								statusFlowId === STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE) && fluxoAprovacao === 2 && (
								<>
									{ isPaymentRequest === true || isApprovalInternalLawyer === true  ? <>
										<Typography variant="h3">
										{t("approval.titleInternalLawyer")}
									</Typography>
									<Box mt={3}>
										<Grid container spacing={3}>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("approval.date")}
													value={
														approvingInternalLawyer
															? new Date()
															: approvalDateOfInternalLawyer
													}
													type="date"
												/>
											</Grid>
											<Grid item md={9} xs={12}>
												<FieldColumn
													label={t("approval.approver")}
													value={
														approvingInternalLawyer
															? name
															: approverOfInternalLawyer
													}
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
						/>
					</form>
				)
			}
		</Form>
	);
};

export default ApprovalForm;
