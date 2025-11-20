import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import  Table, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import { getListGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import {getPagination} from 'src/core/store/modules/pagination/selectors';
import { requestTypesOptionsAll } from "../../constants";
import {
	FormLabel,
} from '@material-ui/core';

export const formatedDateToDDMMYYYY = (dateStr: string): string => {
	const date = new Date(dateStr);
	return date.toLocaleDateString('pt-BR', {
	  day: '2-digit',
	  month: '2-digit',
	  year: 'numeric'
	});
  }

const List = ({ loading }: { loading: boolean }) => {
	const { t } = useTranslation();
	const history = useHistory();

	const { guaranteeModality } = useGuaranteeModality();
	const list = useSelector(getListGoodsGuaranteesRequest);
	const {itemCount} = useSelector(getPagination);

	const guaranteeModalityList = useMemo(() => {
		if (!guaranteeModality) return {};

		return guaranteeModality.reduce((acc, current) => {
			(acc as any)[Number(current.id)] = current.description;
			return acc;
		}, {});
	}, [guaranteeModality]);

	const rows = useMemo(
		() =>
			list.map(
				({
					guaranteeModalityId,
					isDeleted,
					payment,
					judicialBlocksAndTransfer,
					paymentFinanceChartOfAccountsCategoryName,
					judicialBlocksAndTransferFinanceChartOfAccountsCategoryName,
					guaranteeTypeName,
					isActive,
					...item
				}) => {
					const status = !isActive
						? t("goodsAndGuarantees:management.dead")
						: t("enabled");
					const isEditButtonVisible = false;
					let goodGuaranteeLinkedText = "";

					if (paymentFinanceChartOfAccountsCategoryName !== null)
						goodGuaranteeLinkedText =
							paymentFinanceChartOfAccountsCategoryName ?? "";
					else if (judicialBlocksAndTransferFinanceChartOfAccountsCategoryName !== null)
						goodGuaranteeLinkedText =
							judicialBlocksAndTransferFinanceChartOfAccountsCategoryName ??
							"";
					else
						goodGuaranteeLinkedText =
							item.financeChartOfAccountsCategoryName ?? "";
					if (goodGuaranteeLinkedText === "") {
						goodGuaranteeLinkedText = guaranteeTypeName ?? "";
					}

					return {
						...item,
						status,
						guaranteeModality: (guaranteeModalityList as any)[guaranteeModalityId],
						goodGuaranteeLinkedText,
						isViewButtonHidden: isEditButtonVisible,
						isEditButtonHidden: !isEditButtonVisible,
						judicialBlocksAndTransfer: judicialBlocksAndTransfer,
					};
				}
			),
		[list, guaranteeModalityList, t]
	);

	function getOccurrenceType(id: any) {
		const occurencetype = {
			"1": "Bloqueio judicial",
			"2": "Transferência judicial",
		};
		return (occurencetype as any)[id] || "";
	}
	function getOrigin(id: any) {
		const originType = {
			"4": "Transferência entre contas",
			"8": "Transferência entre processos",
		};
		return (originType as any)[id] || "";
	}

	const columns: ColumnData[] = [
		{
			label: t("goodsAndGuarantees:management.goodAndGuaranteeId"),
			field: "id",
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
			label: t("goodsAndGuarantees:form.guaranteesType"),
			field: "goodGuaranteeLinkedText",
		},
		{
			label: t("goodsAndGuarantees:form.solicitationType"),
			field: "description",
			type: "custom",
			component: (row: TGoodsGuaranteesRequest) => {
				if (row?.origin !== null) return getOrigin(row.origin)
				if (row.occurrenceType !== null) return getOccurrenceType(row.occurrenceType)
				return requestTypesOptionsAll.find((x) => x.value === row.requestTypeId)?.label;
			},
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeAmount"),
			field: "valueGuarantee",
			type: "currency",
		},
		{
			label: t("goodsAndGuarantees:management.accountingBalance"),
			field: "accountingBalance",
			type: "currency",
		},
		{
			label: t("goodsAndGuarantees:management.legalBalance"),
			field: "legalBalance",
			type: "currency",
		},
		{
			label: t("status"),
			field: "status",
		},
	];

	const handleAction = ({ id }: any) => {
		history.push(`gestao/${id}`);
	};

	return (
		<>
			<Panel title={t("goodsAndGuarantees:management.listTitle")}>
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%'}}>
					{`Listagem de gestão de bens e garantia  totais encontradas ${itemCount}`}
				</FormLabel>
				<Table
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


