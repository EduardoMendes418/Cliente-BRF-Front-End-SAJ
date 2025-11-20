import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import {
	FormLabel,
} from '@material-ui/core';

import { useTranslation } from "src/locale/i18n";
import { getListJudicialBlocksAndTransfers } from "src/core/store/modules/judicial-blocks-and-transfers/selectors";
import { allStatusAsObject, occurrenceTypeAsObject } from "../constants";
import { useBanks } from "src/hooks/fetchLists";
import { isEditable } from "src/screen/judicial-blocks-and-transfers/editable";
import { useCurrentUser } from "src/config/permissions";
import { getPagination } from 'src/core/store/modules/pagination/selectors';
import { getListAsOptionPaymentTypeAllStatus } from "src/core/store/modules/payment-type/selectors";

export const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"20": "",
};

const List = ({ loading }: { loading: boolean }) => {
	const { t } = useTranslation();
	const { location, ...history } = useHistory();
	const isSolicitacao = location.pathname.includes("solicitacao");
	const { banks } =  useBanks();
	const list = useSelector(getListJudicialBlocksAndTransfers);
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);
	const { itemCount } = useSelector(getPagination);

	const { currentScreenPermissions } = useCurrentUser("");

	const rows = useMemo(
		() =>
			list.map((item) => {
				const {
					id,
					createdDate,
					blockOrTransfDate,
					folderNumber,
					process,
					occurrenceType,
					statusFlowId,
					value,
					occurrenceReason,
					statusApprovalId,
					goodsGuaranteesRequestId,
					bankId,
					destinationBankAccountId,
				} = item;
         const destinationBank = banks?.find(b => b.id === Number(destinationBankAccountId))?.name
				 const sourceBank = banks?.find(b => b.id === Number(bankId))?.name
				const statusToShow = allStatusAsObject[statusFlowId];
				const occurrenceTypeToShow = (occurrenceTypeAsObject as any)[occurrenceType];
				const isEditButtonHidden = !isEditable(
					item?.occurrenceReasonType,
					isSolicitacao,
					statusFlowId,
					currentScreenPermissions.edit,
					goodsGuaranteesRequestId === null,
					statusApprovalId
				);
				return {
					id,
					createdDate,
					folderNumber,
					blockOrTransfDate,
					bankId: sourceBank,
					destinationBankAccountId: destinationBank,
					statusToShow,
					isEditButtonHidden,
					occurrenceTypeToShow,
					isViewButtonHidden: !isEditButtonHidden,
					legalDepartmentArea: process?.legalDepartmentArea ?? "",
					statusTextApproval:
						(statusTextApprovals as any)[statusApprovalId ?? "10"] ?? "",
					value,
					occurrenceReasonText: paymentTypeAsOptions.find(
						(item) => item.value === occurrenceReason
					)?.label,
				};
			}),
		[list, banks, paymentTypeAsOptions, isSolicitacao, currentScreenPermissions.edit]
	);

	const columns: ColumnData[] = [
		{
			label: t("judicialBlocksAndTransfers:form.requestNumber"),
			field: "id",
		},
		{
			label: "Data do registro",
			field: "createdDate",
			type: "date",
		},
		{
			label: "Data do bloq/transf",
			field: "blockOrTransfDate",
			type: "date",
		},
		{
			label: t("form.CTGFolder"),
			field: "folderNumber",
		},
		{
			label: t("form.legalDepartmentArea"),
			field: "legalDepartmentArea",
		},
		{
			label: t("judicialBlocksAndTransfers:form.occurrenceType"),
			field: "occurrenceTypeToShow",
		},
		{
			label: "Motivo da ocorrência",
			field: "occurrenceReasonText",
		},
		{
			label: "Banco de Origem",
			field: "bankId",
		},
		{
			label: "Valor",
			field: "value",
			type: "currency",
		},

		{
			label: "Banco de Destino",
			field: "destinationBankAccountId",
		},
		{
			label: t("status"),
			field: "statusToShow",
		},
		{ label: "Status da contabilização", field: "statusTextApproval" },
	];

	const handleAction = ({ id }: any) =>
		history.push(`${location.pathname}/${id}`);

	return (
		<>
			<Panel title={t("judicialBlocksAndTransfers:list")}>
				<FormLabel style={{fontWeight:'bold', display:'flex', margin:'3% 3% 0 1.5%'}}>
				{`Listagem de bloqueios e transferências totais encontradas ${itemCount}`}
				</FormLabel>
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
