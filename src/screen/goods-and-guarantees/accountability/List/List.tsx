import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import {
	getListGuaranteeAccountability,
	getAccountabilityArray,
} from "src/core/store/modules/guarantee-accountability/selectors";
import {
	addAccontabilityArray,
	removeAccontabilityArray,
} from "src/core/store/modules/guarantee-accountability";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";

import {
	accountabilityStatusOptionsAsObject,
	ACCOUNTABILITY_STATUS,
	situationStatusOptionsAsObject,
	ACCOUNTABILITY_SITUATION
} from "src/screen/goods-and-guarantees/accountability/constants";
import {
	bearishReasonsOptionsList,
	requestTypesOptionsAll,
} from "src/screen/goods-and-guarantees/constants";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"8": "Erro na contabilização",
	"20": "",
};
const List = ({ loading }: { loading: boolean }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const {
		location: { pathname },
		...history
	} = useHistory();
	
	const isEvaluation = pathname.includes("prestacao-de-contas-avaliacao");

	const { guaranteeModality } = useGuaranteeModality();

	const list = useSelector(getListGuaranteeAccountability);
	const accontabilityArray = useSelector(getAccountabilityArray);

	const rows = useMemo(
		() =>
			list.map(
				({
					id,
					goodsGuaranteesRequest,
					folderNumber,
					statusFlowId,
					totalAmountWrittenOff,
					status,
					statusApprovalId,
					bearishReasons,
					accountabilityDate,
					goodsGuaranteesRequestId,
					guaranteeModeId,
					requestTypeId,
					guaranteeDate,
					...item
				}) => {
					
					const { description } =
						guaranteeModality.find(({ id }) => id === guaranteeModeId) ??
						{};

					const accountabilyStatusText =
						accountabilityStatusOptionsAsObject[statusFlowId];
					const situationText = situationStatusOptionsAsObject[status];
					const isEditButtonVisible = 
					!isEvaluation ?
						(statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL ||
							statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_OFFICE  || 
							status === ACCOUNTABILITY_SITUATION.OFFICE_PENDING) : (
								(status !== ACCOUNTABILITY_SITUATION.OFFICE_PENDING  &&
								(
									statusFlowId === ACCOUNTABILITY_STATUS.PENDING ||
									statusFlowId === ACCOUNTABILITY_STATUS.IN_CANCELLATION ||
									statusFlowId === ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS ||
									statusFlowId === ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL
								)) || 
								status === ACCOUNTABILITY_SITUATION.PENDING
						)
					
					return {
						...item,
						id,
						folderNumber,
						guaranteeDate,
						accountabilityStatusToShow: accountabilyStatusText,
						situationToShow: situationText,
						amountWrittenOff: totalAmountWrittenOff,
						isViewButtonHidden: isEditButtonVisible,
						isEditButtonHidden: !isEditButtonVisible,
						guaranteeModality: description,
						statusTextApproval:
							(statusTextApprovals as any)[statusApprovalId ?? "10"] ?? "",
						bearishReasonsText:
						bearishReasonsOptionsList.find(
								(item) => item.value === bearishReasons
							)?.label ?? "",
						bearishReasons,
						accountabilityDate,
						totalAmountWrittenOff,
						requestTypeId,
						status
					};
				}
			),
		[list, guaranteeModality, isEvaluation]
	);
	
	const columns: ColumnData[] = [
		{
			label: t("goodsAndGuarantees:requestNumber"),
			field: "id",
		},
		{ 	label: t("goodsAndGuarantees:accountability.parentAccountabilityId"), 
			field: "parentAccountabilityId"},
		{
			label: "Data solicitação",
			field: "accountabilityDate",
			type: "date",
		},
		{
			label: t("form.CTGFolder"),
			field: "folderNumber",
		},
		{
			label: t("goodsAndGuarantees:management.goodDate"),
			field: "guaranteeDate",
			type: "date",
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeModality"),
			field: "guaranteeModality",
		},
		{
			label: t("goodsAndGuarantees:form.solicitationType"),
			field: "description",
			type: "custom",
			component: (row: TGoodsGuaranteesRequest) => {
				return requestTypesOptionsAll.find((x) => x.value === row.requestTypeId)
					?.label;
			},
		},
		{ label: "Motivo da baixa", field: "bearishReasonsText" },
		{
			label: "Total baixado",
			field: "amountWrittenOff",
			type: "currency",
		},
		{
			label: t("goodsAndGuarantees:accountability.situation"),
			field: "situationToShow",
		},
		{
			label: t("goodsAndGuarantees:accountability.accountabilityStatus"),
			field: "accountabilityStatusToShow",
		},
		{ label: "Status da contabilização", field: "statusTextApproval" }
		
	];

	const ids = useMemo(
		() => accontabilityArray.map(({ id }) => id),
		[accontabilityArray]
	);

	if (isEvaluation) {
		columns.unshift({
			label: "Marcar avaliação",
			field: "action",
			component: (row: TGuaranteeAccountability, index: any) => {
				if (row.status === ACCOUNTABILITY_SITUATION.OFFICE_PENDING)  return null;
				if (row.accountabilityStatusToShow !== "Pendente") return null;
				if (
					!(
						row.guaranteeModality === "DEPÓSITO JUDICIAL" &&
						(row.bearishReasonsText === "Liberado à empresa" ||
							row.bearishReasonsText === "Transferência entre contas" ||
							row.bearishReasonsText === "Transferência entre processos")
					) 
					|| row.creditReceiptId !== null
				)
					return null;

				if (
					accontabilityArray.length !== 0 &&
					(accontabilityArray[0].bearishReasonsText !==
						row.bearishReasonsText 
						|| accontabilityArray[0].creditReceiptId !== null
					)
				)
					return null;

				return (
					<>
						<Checkbox
							color="primary"
							icon={icon}
							checkedIcon={checkedIcon}
							checked={ids.findIndex((id) => id === row.id) !== -1}
							size="small"
							onClick={() => {
								const index = ids.findIndex((id) => id === row.id);
								if (index === -1) dispatch(addAccontabilityArray(row));
								else dispatch(removeAccontabilityArray(index));
							}}
						/>
					</>
				);
			},
			type: "custom",
		});
	};

	const handleAction = ({ id }: any) => {
		if (pathname.includes("gestao"))
			history.push(`/bens-e-garantias/prestacao-de-contas-solicitacao/${id}`);
		else history.push(`${pathname}/${id}`);
	};

	return (
		<>
			<Panel title={t("goodsAndGuarantees:accountability.listTitle")}>
				<TableComponent
					rows={rows}
					columns={columns}
					onEdit={handleAction}
					onVisualize={handleAction}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
