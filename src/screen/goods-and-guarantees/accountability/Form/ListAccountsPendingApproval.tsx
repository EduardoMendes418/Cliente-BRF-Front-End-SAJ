import { useMemo } from "react";

import TableComponent, { ColumnData } from "src/components/Table";
import AccordionPanel from "src/components/AccordionPanel";

import { useTranslation } from "src/locale/i18n";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import {
	accountabilityStatusOptionsAsObject,
	situationStatusOptionsAsObject,
	
} from "../constants";
import { bearishReasonsOptionsList } from "src/screen/goods-and-guarantees/constants"
const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"20": "",
};
const ListAccountsPendingApproval = ({ list }: { list: TGuaranteeAccountability[] }) => {
	const { t } = useTranslation();

	const filtredList = list && list.filter && list.filter(({status, statusFlowId, statusApprovalId})=> 
	(status === 0 && statusFlowId === 0) || statusApprovalId === -1
	)

	const rows = useMemo(
		() =>
			filtredList.map(
				({
					id,
					goodsGuaranteesRequest,
					folderNumber,
					statusFlowId,
					amountWrittenOff,
					status,
					statusApprovalId,
					bearishReasons,
					...item
				}) => {
					const { effectiveDate } =
						goodsGuaranteesRequest ?? {};
		
					const accountabilyStatusText =
						accountabilityStatusOptionsAsObject[statusFlowId];
					const situationText = situationStatusOptionsAsObject[status];

					return {
						id,
						effectiveDate,
						folderNumber,
						accountabilityStatusToShow: accountabilyStatusText,
						situationToShow: situationText,
						amountWrittenOff: amountWrittenOff,
						statusContability: (statusTextApprovals as any)[statusApprovalId ?? "10"],
						bearishReasonsText: bearishReasonsOptionsList.find(
							(item) => item.value === bearishReasons
						)?.label ?? "",
						...item
					};
				}
			),
		[filtredList]
	);

	const columns: ColumnData[] = [
		{
			label: t("goodsAndGuarantees:requestNumber"),
			field: "id",
		},
		{
			label: "Data solicitação",
			field: "accountabilityDate",
			type: "date",
		},
		{
			label: "Motivo da baixa",
			field: "bearishReasonsText",
		},
		{
			label: t("goodsAndGuarantees:management.totalWrittenOff"),
			field: "amountWrittenOff",
			type: "currency",
		},
		{
			label: t("goodsAndGuarantees:accountability.accountabilityStatus"),
			field: "accountabilityStatusToShow",
		},
		{
			label: t("goodsAndGuarantees:accountability.situation"),
			field: "situationToShow",
		},
		{
			label: "Status da contabilização",
			field: "statusContability",
		},
	];

	return (
		<>
			<AccordionPanel
				noContentMargin
				title={"Listagem de Prestação de Contas Pendente de Aprovação"}
				startExpanded
			>
				<TableComponent rows={rows} columns={columns} />
			</AccordionPanel>
		</>
	);
};

export default ListAccountsPendingApproval;

