import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useMsal } from "@azure/msal-react";
import moment from "moment";

import JustificationModal, { TForm } from "src/components/JustificationModal";
import Form, { DateField, TextField } from "src/components/form";
import ActionButtons from "src/components/ActionButtons";
import FieldColumn from "src/components/FieldColumn";
import Attachments from "src/components/Attachments";
import { modal } from "src/components/modals";
import Panel from "src/components/Panel";
import Logs from "src/components/Logs";
import JustificationDisplay from "src/components/JustificationDisplay";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { t } from "src/locale/i18n";

import {
	TGoodsGuaranteesRequest,
	TGuaranteeFlowProperty,
} from "src/core/models/goods-guarantee";
import {
	editGoodsGuaranteesRequest,
	updateGoodsGuaranteesStatusFlow,
} from "src/core/store/modules/goods-guarantee/thunks";
import { TActors } from "src/core/models/profiles";

import { customTaskTitleStyle, ACTIONS_TO_STATUS, ACTIONS } from "./constants";
import { RECORD_TYPE, statusTextProperty, STATUS_FLOW } from "../constants";
import { approverScope, requesterScope } from "../func";
import { getSavingGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";

type TTasks = {
	item: TGoodsGuaranteesRequest & TGuaranteeFlowProperty;
} & TActors;

const GuaranteeProperty = ({
	item: { statusFlowId, process, ...item },
	isRequester,
	isApprover,
}: TTasks) => {
	const dispatch = useDispatch();

	const isLoading = useSelector(getSavingGoodsGuaranteesRequest);

	const { accounts } = useMsal();

	const requested = statusFlowId === STATUS_FLOW.REQUESTED;
	const started = statusFlowId !== STATUS_FLOW.NONE;
	const cancelled =
		statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE &&
		!item.logs?.find(
			({ statusFlowId }) => statusFlowId === STATUS_FLOW.REQUESTED
		);
	const finished = [
		STATUS_FLOW.APPROVED_DEFINITIVE,
		STATUS_FLOW.REJECTED_DEFINITIVE,
	].includes(statusFlowId);
	const id = Number(item.id);

	const onJustify = (type: "rejected" | "cancelled") => {
		const component = (
			<JustificationModal
				reason={type === "cancelled" ? "cancelled" : undefined}
				onSubmitJustification={(values: TForm) => onSubmitReject(values, type)}
				moduloId={5}
			/>
		);

		const title =
			type === "rejected"
				? t("goodsAndGuarantees:tasks.justificationForUnavailableGoods")
				: t("goodsAndGuarantees:tasks.justificationForCancelRequest");

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const actionButtons = [
		{
			label: t("goodsAndGuarantees:tasks.cancelRequest"),
			statuses: [STATUS_FLOW.NONE, STATUS_FLOW.RETURNED, STATUS_FLOW.REQUESTED],
			onClick: () => onJustify("cancelled"),
		},
		{
			label: t("goodsAndGuarantees:tasks.unavailableGoods"),
			statuses: [STATUS_FLOW.REQUESTED],
			onClick: () => onJustify("rejected"),
		},
		{
			label:
				requested &&
				item.statusApprovalId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
					? "Bem disponibilizado"
					: t("btnRequest"),
			statuses: [STATUS_FLOW.NONE, STATUS_FLOW.RETURNED, STATUS_FLOW.REQUESTED],
		},
	];

	const validActionButtons = actionButtons.filter(({ statuses }) =>
		statuses.includes(Number(statusFlowId))
	);

	const finishedInfo = item.logs?.find((log) =>
		[STATUS_FLOW.APPROVED_DEFINITIVE, STATUS_FLOW.REJECTED_DEFINITIVE].includes(
			log.statusFlowId as STATUS_FLOW
		) && !log.observation?.includes("Histórico de Alterações")
	);

	const onSubmit = ({ ...values }: TGuaranteeFlowProperty) => {
		
		const statusFlowId = requested
			? STATUS_FLOW.APPROVED_DEFINITIVE
			: STATUS_FLOW.REQUESTED;
		const generateLog = {
			id,
			observation: isPropertyInfoHidden ? values.observation : values.observationRequest,
			statusFlowId,
		};
		delete values.observationRequest;
		dispatch(
			editGoodsGuaranteesRequest({
				...item,
				...values,
				id,
				generateLog,
				sendEmail: !requested,
				recordType: requested ? RECORD_TYPE.EFFECTIVE : item.recordType,
			})
		);
	};

	const onSubmitReject = (
		{ justification, rejectionAndReturnReasonsId }: TForm,
		type: "rejected" | "cancelled"
	) => {
		const newStatusFlow =
			type !== "rejected"
				? ACTIONS_TO_STATUS[ACTIONS.REJECT_DEFINITIVE]
				: ACTIONS_TO_STATUS[ACTIONS.RETURN_DRAFT];
		dispatch(
			updateGoodsGuaranteesStatusFlow({
				id,
				observation: justification,
				statusFlowId: newStatusFlow,
				rejectionAndReturnReasonsId,
			})
		);
	};

	const requestedInfo = item.logs?.find(
		(log) => log.statusFlowId === STATUS_FLOW.REQUESTED
	);
	
	

	const { observation, occurrenceDate } = requestedInfo ?? {};

	const isPropertyInfoHidden =
		!started ||
		(statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE && !requestedInfo);

	const initialValues = {
		id,
		effectiveDate: occurrenceDate ?? moment().format("YYYY-MM-DD"),
		statusFlowId,
		observationRequest: finished
			? finishedInfo?.observation ?? ""
			: isPropertyInfoHidden
			? observation ?? ""
			: "",
		observation: item.observation ?? "",
		invoiceNumber: item.invoiceNumber || "",
		registrationNumber: item.registrationNumber || "",
		fixedAssetRegistryNumber: item.fixedAssetRegistryNumber || "",
		emissionDate: item.emissionDate || null,
		emails: item.emails ?? "",
		attachments: item.files.filter(({ isMainFile }: any) => !isMainFile) as any,
	};

	return (
		<Form
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			permission={
				!finished &&
				((isRequester && requesterScope(statusFlowId)) ||
					(isApprover && approverScope(statusFlowId)))
			}
		>
			{({ handleSubmit, status: statusForm }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={t("goodsAndGuarantees:tasks.title")} withPadding>
						<Typography variant="h4" style={customTaskTitleStyle}>
							{t("goodsAndGuarantees:tasks.goodsRequest")}
						</Typography>
						<Box mt={3}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t("goodsAndGuarantees:formFlow.responsible")}
										value={requestedInfo?.userName || accounts[0]?.name}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField name="effectiveDate" label="Data" readOnly />
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										name="emails"
										label={t("goodsAndGuarantees:formFlow.emails")}
										helperText={t(
											"goodsAndGuarantees:formFlow.emailsHelperText"
										)}
										readOnly={started || statusForm === "readOnly"}
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										name={"observation"}
										label="Observações"
										placeholder={t("form.typeHere")}
										readOnly={started || statusForm === "readOnly"}
									/>
								</Grid>
							</Grid>
						</Box>
						{!isPropertyInfoHidden && (
							<Box mt={3}>
								<Typography variant="h4" style={customTaskTitleStyle}>
									{t("goodsAndGuarantees:tasks.attachmentsDraft")}
								</Typography>
								<Grid container spacing={3}>
									<Grid item xs={12} md={3}>
										<FieldColumn
											label={t("goodsAndGuarantees:formFlow.responsible")}
											value={finishedInfo?.userName || accounts[0]?.name}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name="invoiceNumber"
											label={t("goodsAndGuarantees:formFlow.invoiceNumber")}
											placeholder={t("form.typeHere")}
											readOnly={!requested || statusForm === "readOnly"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name="registrationNumber"
											label={t(
												"goodsAndGuarantees:formFlow.registrationNumber"
											)}
											placeholder={t("form.typeHere")}
											readOnly={!requested || statusForm === "readOnly"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name="fixedAssetRegistryNumber"
											label={t(
												"goodsAndGuarantees:formFlow.fixedAssetRegistryNumber"
											)}
											placeholder={t("form.typeHere")}
											readOnly={!requested || statusForm === "readOnly"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											name="emissionDate"
											label={t("goodsAndGuarantees:emissionDate")}
											readOnly={!requested || statusForm === "readOnly"}
										/>
									</Grid>
									<Grid item md={9} xs={12}>
										<TextField
											name="observationRequest"
											label="Observações"
											placeholder={t("form.typeHere")}
											readOnly={!requested || statusForm === "readOnly"}
										/>
									</Grid>
								</Grid>
							</Box>
						)}
					</Panel>
					{(requested || finished) && (
						<Attachments
							name="attachments"
							label={t("goodsAndGuarantees:tasks.attachmentsTask")}
						/>
					)}
					{cancelled && (
						<JustificationDisplay
							logs={item.logs}
							status={statusFlowId}
							type="cancelled"
							moduloId={5}
							reasonType={4}
						/>
					)}
					<Logs
						logs={item.logs}
						statuses={statusTextProperty}
						statusOrder={["flow"]}
					/>
					<ActionButtons
						isSubmitting={isLoading}
						hidden={finished || statusForm === "readOnly"}
						buttons={validActionButtons}
					/>
				</form>
			)}
		</Form>
	);
};

export default GuaranteeProperty;
