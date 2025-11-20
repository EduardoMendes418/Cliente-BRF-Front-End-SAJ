import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import ScreenTemplate from "src/components/Screen";
import ProcessFormData from "src/components/ProcessFormData";
import ApprovalForm from "src/components/ApprovalForm";
import { useTranslation } from "src/locale/i18n";
import FullLogs from "src/components/Logs/FullLogs"; //, { removeDuplicatedLogsAndSortByDate }
import { getLogFromGoodsAndGuarantees } from "src/screen/goods-and-guarantees/statusInfo";

import {
	getProcessFormData,
	getProcessIsFetching,
	getProcessStatus,
} from "src/core/store/modules/process/selectors";
import {
	getLoadingGoodsGuaranteesRequest,
	getItemGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";
import { updateGoodsGuaranteesStatusFlow } from "src/core/store/modules/goods-guarantee/thunks";
import {
	useFetchGoodsAndGuaranteesItem,
	useGoodsAndGuarantees,
} from "src/hooks/goodsAndGuarantees";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { TGuaranteeModality } from "src/core/models/guarantee-modality";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";

import Search from "./Search";
import Form from "./Form";
import { getStatusTextFromGoodAndGuarantees } from "../statusInfo";
import { STATUS_FLOW } from "src/screen/goods-and-guarantees/constants";
import { TUpdateStatus } from "src/core/models";

const RequestGoodsAndGuaranteesForm = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const { pathname } = useLocation();

	const redirectUrl = useMemo(() => {
		const lastOccurrenceOfSlash = pathname.lastIndexOf("/");
		return pathname.slice(0, lastOccurrenceOfSlash);
	}, [pathname]);

	useGoodsAndGuarantees(redirectUrl);
	useFetchGoodsAndGuaranteesItem(Number(id));
	const { guaranteeModality } = useGuaranteeModality();

	const item = useSelector(getItemGoodsGuaranteesRequest);
	const isFetchingItem = useSelector(getLoadingGoodsGuaranteesRequest);
	const processForm = useSelector(getProcessFormData);
	const isFetching = useSelector(getProcessIsFetching);
	const isFolderClosed = useSelector(getProcessStatus);

	const hasFolder = processForm && Object.keys(processForm).length > 0;
	const isFolderValid =
		!isFetching && ((hasFolder && !isFolderClosed) || item?.process);

	const isNew = id === "novo";
	const isEditing = item.statusFlowId === STATUS_APPROVALS_FLOW.RETURNED;

	const isRequest = pathname.startsWith("/bens-e-garantias/solicitacao");
	const isApprovalLegalControl = pathname.startsWith(
		"/bens-e-garantias/avaliacao-controle-juridico"
	);
	const isApprovalInternalLawyer = pathname.startsWith(
		"/bens-e-garantias/avaliacao-advogado-interno"
	);

	//Regra exibição ApprovalForm:
	//STATUS APPROVAL ID !== -1 (JA TEVE RETORNO DA CENTRAL)
	//ITEM.STATUSFLOWID === 1 || === 4 (FLOW APROVADO (advogado) OU VALIDADO CONTROLE JURIDICO)
	const isApprovalFormVisible =
		item.statusApprovalId !== STATUS_APPROVALS_FLOW.NONE ||
		isApprovalLegalControl ||
		isApprovalInternalLawyer ||
		[
			STATUS_APPROVALS_FLOW.APPROVED,
			STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
		].includes(item.statusFlowId ?? -1);

	const { typeFlow } = useMemo(
		() =>
			guaranteeModality.find(({ id }) => id === item.guaranteeModalityId) ??
			({} as TGuaranteeModality),
		[guaranteeModality, item.guaranteeModalityId]
	);

	const ruleProps = useMemo(() => ({ typeFlow }), [typeFlow]);

	// const logs = useMemo(() => removeDuplicatedLogsAndSortByDate(item.logs), [item.logs])
	const logs = item.logs;

	const status = getStatusTextFromGoodAndGuarantees(
		typeFlow,
		item.statusFlowId,
		item.statusApprovalId
	);

	const itemNew: any = useMemo(() => ({ ...item }), [item]);

	const logInReview = useMemo(() => {
		const filterLogs =
			item?.statusFlowId && itemNew?.logs
				? [...itemNew.logs].filter(
						({ statusFlowId, statusApprovalId, observation }) =>
							statusFlowId === STATUS_FLOW.IN_REVIEW && statusApprovalId === -1 
							&& !observation.includes("Histórico de Alterações")
				  )
				: null;
		const finalLogs =
			filterLogs?.length === 0
				? null
				: filterLogs?.reduce((shortestLog, currentLog) =>
						currentLog.observation.length < shortestLog.observation.length
							? currentLog
							: shortestLog
				  );
		return finalLogs;
	}, [item, itemNew]);
	const logApprovedDefinitive = useMemo(() => {
		const filterLogs =
			item?.statusFlowId && itemNew?.logs
				? [...itemNew.logs].filter(
						({ statusFlowId, statusApprovalId, observation }) =>
							statusFlowId === STATUS_FLOW.APPROVED_DEFINITIVE &&
							statusApprovalId === -1
							&& !observation.includes("Histórico de Alterações")
				  )
				: null;
		const finalLogs =
			filterLogs?.length === 0
				? null
				: filterLogs?.reduce((shortestLog, currentLog) =>
						currentLog.observation.length < shortestLog.observation.length
							? currentLog
							: shortestLog
				  );
		return finalLogs;
	}, [item, itemNew]);

	if (logInReview?.id) {
		itemNew.approverOfLegalControl = logInReview.userName;
		itemNew.approvalDateOfLegalControl = logInReview.occurrenceDate;
		itemNew.observationOfLegalControl = logInReview.observation;
	}

	if (logApprovedDefinitive?.id) {
		itemNew.observationOfInternalLawyer = logApprovedDefinitive.observation;
	}

	const onUpdate = (value: TUpdateStatus) => {
		if (value.statusFlowId === STATUS_FLOW.APPROVED_DRAFT) {
			value.statusFlowId = STATUS_FLOW.REJECTED_DEFINITIVE;
		}
		dispatch(updateGoodsGuaranteesStatusFlow({...value, id: Number(id)}));
	};

	return (
		<ScreenTemplate>
			<Search
				readOnly={!isNew}
				requestNumber={item?.id}
				status={status}
				folderNumber={item?.folderNumber ?? ""}
				requestDate={item?.requestDate}
			/>
			{!isFolderValid && isFetchingItem && (
				<CircularProgress className="margin-top-16 align-center" />
			)}
			{isFolderValid && (
				<>
					<ProcessFormData processData={processForm} />
					<Form
						item={item}
						isNew={isNew}
						readOnly={(!isNew && !isEditing) || !isRequest}
						folderNumber={processForm?.folderNumber ?? ""}
						processId={processForm.processKey}
						areaId={processForm?.legalDepartmentAreaId ?? ""}
					/>
					{isApprovalFormVisible && (
						<ApprovalForm
							item={itemNew as any}
							isInternalLawyer
							isApprovalLegalControl={isApprovalLegalControl}
							isApprovalInternalLawyer={isApprovalInternalLawyer}
							page={t("goodsAndGuarantees:page")}
							updateStatus={onUpdate}
							buttons={["return", "cancel", "approve"]}
							approveButtonText={isApprovalLegalControl ? "VALIDAR" : "APROVAR"}
							hasReason
							moduloId={5}
							overrideIsInternal={isApprovalInternalLawyer}				
						/>
					)}
					<FullLogs
						logs={logs}
						rule={getLogFromGoodsAndGuarantees}
						ruleProps={ruleProps}
					/>
				</>
			)}
		</ScreenTemplate>
	);
};

export default RequestGoodsAndGuaranteesForm;
