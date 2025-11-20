import { Box, Grid, Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ActionButtons from "src/components/ActionButtons";
import FieldColumn from "src/components/FieldColumn";
import Form, { TextField } from "src/components/form";
import JustificationModal from "src/components/JustificationModal";
import { modal } from "src/components/modals";
import Panel from "src/components/Panel";
import { TLogs, TUpdateStatus } from "src/core/models";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { useTranslation } from "src/locale/i18n";
import { REQUEST_STATUS_FLOW } from "../constants";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";

type ApprovalFormProps = {
	id: number | undefined;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
	editable: boolean;
	logs: TLogs[] | undefined;
	updateStatus: (value: TUpdateStatus) => void;
	flowId?: REQUEST_STATUS_FLOW;
};

type TForm = {
	observationOfLegalControl: string;
	observationOfInternalLawyer: string;
};

type TJustificationModalForm = {
	justification: string;
	dueDate?: string | null;
	rejectionAndReturnReasonsId?: number | "";
};

const justificationText = {
	[REQUEST_STATUS_FLOW.DEVOLVER]: "approval.justificationReturn",
	[REQUEST_STATUS_FLOW.REJEITADO]: "approval.justificationReject",
} as any;

const ApprovalForm = (props: ApprovalFormProps) => {
	const { t } = useTranslation();
	const { name } = useSelector(getDataCurrentUser);
	const form = useRef<FormikProps<TForm>>(null);
	const history = useHistory();

	const approvalLegalControl = props.logs
		?.filter((x) => x.statusFlowId === REQUEST_STATUS_FLOW.APROVACAO_INTERNA)
		.pop();

	const approvalInternalLawyer = props.logs
		?.filter(
			(x) =>
				x.statusFlowId === REQUEST_STATUS_FLOW.APROVACAO_ADVOGADO_INTERNO &&
				x.statusApprovalId !== STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
				x.statusApprovalId !== STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE
		)
		.pop();

	const returnOrReject = (
		flowId: REQUEST_STATUS_FLOW,
		values: TJustificationModalForm
	) => {
		props.updateStatus({
			id: Number(props.id),
			statusFlowId: flowId,
			observation: values.justification,
			rejectionAndReturnReasonsId: values.rejectionAndReturnReasonsId,
		});
	};

	const modalReturnOrReject = (flowId: REQUEST_STATUS_FLOW) => {
		const component = (
			<JustificationModal
				onSubmitJustification={(values: TJustificationModalForm) =>
					returnOrReject(flowId, values)
				}
				moduloId={7}
			/>
		);

		const title = t(justificationText[flowId], { page: t("pensoes") });

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const actionButtons = [
		{
			name: "cancel",
			label: t("approval.cancel"),
			onClick: () => history.goBack(),
		},
		{
			name: "return",
			label: t("approval.return"),
			onClick: () => modalReturnOrReject(REQUEST_STATUS_FLOW.DEVOLVER),
		},
		{
			name: "reject",
			label: t("approval.reject"),
			onClick: () => modalReturnOrReject(REQUEST_STATUS_FLOW.REJEITADO),
		},
		{
			name: "approve",
			label: t("approval.approve"),
		},
	];

	const initialValues: TForm = {
		observationOfLegalControl: approvalLegalControl?.observation || "",
		observationOfInternalLawyer: approvalInternalLawyer?.observation || "",
	};

	const onSubmit = async (form: TForm, flowId: REQUEST_STATUS_FLOW) => {
		props.updateStatus({
			id: Number(props.id),
			statusFlowId: flowId,
			observation: props.isApprovalLegalControl
				? form.observationOfLegalControl
				: form.observationOfInternalLawyer,
		});
	};

	const editableApprovalLegalControl =
		props.flowId === REQUEST_STATUS_FLOW.NONE;
	const editableApprovalInternalLawyer =
		props.flowId === REQUEST_STATUS_FLOW.APROVACAO_INTERNA;

	return (
		<Form
			innerRef={form}
			onSubmit={(data) =>
				onSubmit(
					data,
					props.isApprovalLegalControl
						? REQUEST_STATUS_FLOW.APROVACAO_INTERNA
						: REQUEST_STATUS_FLOW.APROVACAO_ADVOGADO_INTERNO
				)
			}
			initialValues={initialValues}
			enableReinitialize
			permission={props.editable ? undefined : false}
		>
			{({ handleSubmit, status: statusForm }) => (
				<form onSubmit={handleSubmit}>
					<Panel title={t("pension:avaliation")} withPadding>
						<Typography variant="h3">
							{t("pension:judicialControl.avaliation")}
						</Typography>
						<Box mt={3} mb={4}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t("approval.date")}
										value={
											!approvalLegalControl || editableApprovalLegalControl
												? new Date()
												: new Date(approvalLegalControl.occurrenceDate)
										}
										type="date"
									/>
								</Grid>
								<Grid item md={9} xs={12}>
									<FieldColumn
										label={t("approval.approver")}
										value={
											!approvalLegalControl || editableApprovalLegalControl
												? name
												: approvalLegalControl.userName
										}
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										name="observationOfLegalControl"
										label={t("approval.observation")}
										rows={3}
										multiline
										maxLength={5000}
										readOnly={
											statusForm === "readOnly" ||
											!props.isApprovalLegalControl ||
											!editableApprovalLegalControl
										}
									/>
								</Grid>
							</Grid>
						</Box>
						{(props.isApprovalInternalLawyer || approvalInternalLawyer) && (
							<>
								<Typography variant="h3">
									{t("pension:internalLawyer.avaliation")}
								</Typography>
								<Box mt={3} mb={4}>
									<Grid container spacing={3}>
										<Grid item md={3} xs={12}>
											<FieldColumn
												label={t("approval.date")}
												value={
													!approvalInternalLawyer ||
													editableApprovalInternalLawyer
														? new Date()
														: new Date(approvalInternalLawyer.occurrenceDate)
												}
												type="date"
											/>
										</Grid>
										<Grid item md={9} xs={12}>
											<FieldColumn
												label={t("approval.approver")}
												value={
													!approvalInternalLawyer
														? name
														: approvalInternalLawyer.userName
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
												readOnly={
													statusForm === "readOnly" ||
													!props.isApprovalInternalLawyer ||
													!editableApprovalInternalLawyer
												}
											/>
										</Grid>
									</Grid>
								</Box>
							</>
						)}
					</Panel>
					<ActionButtons
						hidden={statusForm === "readOnly"}
						buttons={actionButtons}
					/>
				</form>
			)}
		</Form>
	);
};

export default ApprovalForm;
