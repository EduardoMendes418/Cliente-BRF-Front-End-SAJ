import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { RECORD_TYPE } from "src/screen/goods-and-guarantees/constants";

import { useTranslation } from "src/locale/i18n";
import { getListGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import {
	STATUS_APPROVALS_FLOW,
	statusTextApprovalsFlow,
} from "src/core/utils/constants";
import { useGuaranteeModality, useGuaranteeType } from "src/hooks/fetchLists";
import { getOptionsAsObject } from "src/core/utils/func";
import { usePagination } from "src/hooks/pagination";
import { fetchGoodsGuaranteesRequestList } from "src/core/store/modules/goods-guarantee/thunks";

import {
	requestTypesOptionsAll,
	statusApprovalsFlow,
	TYPE_FLOW,
} from "src/screen/goods-and-guarantees/constants";
import { statusAsOptions } from "src/screen/goods-and-guarantees/func";
import {
	getLoadingGoodsGuaranteesRequest,
	getFiltersGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";
import { rejectNoValues } from "src/core/utils/func";
import { statusBemAsOption } from "src/core/models/goods-guarantee";

const requestTypesOptionsAsObject = getOptionsAsObject(requestTypesOptionsAll) as any;

function getOccurrenceType(id: any) {
	const occurencetype = {
		"1": "Bloqueio judicial",
		"2": "Transferência judicial",
	} as any;
	return occurencetype[id] || "";
}

function getOrigin(id: any) {
	const originType = {
		"4": "Transferência entre contas",
		"8": "Transferência entre processos",
	} as any;
	return originType[id] || "";
}

const GoodsAndGuarantees = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const {
		location: { pathname },
	} = useHistory();

	const { guaranteeModality } = useGuaranteeModality();
	const inFlow = true;
	const list = useSelector(getListGoodsGuaranteesRequest);
	const { page, pageSize } = usePagination();

	const loading = useSelector(getLoadingGoodsGuaranteesRequest);
	const goodsGuaranteesFilters = useSelector(getFiltersGoodsGuaranteesRequest);

	const { guaranteeTypeAsOptions } = useGuaranteeType();



	useEffect(() => {
		const filters = goodsGuaranteesFilters[pathname] ?? {};
		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			statusFlowId: null,
			statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
			recordType: RECORD_TYPE.EFFECTIVE,
		});
		dispatch(fetchGoodsGuaranteesRequestList(result));
	}, [dispatch, page, pageSize, goodsGuaranteesFilters, inFlow, pathname]);

	const rows = useMemo(
		() =>

		list.map(
				({ statusApprovalId, statusFlowId, guaranteeModalityId, ...item }) => {
					let goodGuaranteeLinkedText = "";
					if (item?.payment !== null)
						goodGuaranteeLinkedText = item?.payment?.financeChartOfAccountsCategoryName ?? "";
					else if (item?.judicialBlocksAndTransfer !== null)
						goodGuaranteeLinkedText = item?.judicialBlocksAndTransfer?.financeChartOfAccountsCategoryName ?? "";
					else
						goodGuaranteeLinkedText = item.financeChartOfAccountsCategoryName ?? "";

					if (goodGuaranteeLinkedText === "") {
						goodGuaranteeLinkedText =
							guaranteeTypeAsOptions.find(
								(itemOp) => itemOp.value === item.guaranteeTypeId
							)?.label ?? "";
					}


					const { typeFlow = TYPE_FLOW.NONE, description } =
						guaranteeModality.find(({ id }) => id === guaranteeModalityId) ??
						{};

					const requestStatus =
						statusApprovalId !== STATUS_APPROVALS_FLOW.NONE
							? statusTextApprovalsFlow[statusApprovalId]
							: statusApprovalsFlow[statusFlowId];

					const status = inFlow
						? statusAsOptions(typeFlow).find(
								({ value }) => value === statusFlowId
						)?.label
						: requestStatus;

					return {
						...item,
						/* statusBem: statusBemAsOption.filter((x) => x.value === item?.statusBemId)[0]?.label, */
						goodGuaranteeLinkedText,
						status,
						guaranteeModality: description,
						requestType: requestTypesOptionsAsObject[item.requestTypeId] ?? "",
					};
				}
			),
		
		[list, inFlow, guaranteeModality]
	);

	const columns: ColumnData[] = [
		{
			label: t("goodsAndGuarantees:requestNumber"),
			field: "id",
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
			label: t("goodsAndGuarantees:list.applicantName"),
			field: "applicantName",
		},
		{
			label: t("goodsAndGuarantees:form.requestDate"),
			field: "requestDate",
			type: "date",
		},
		{
			label: "Data da Garantia",
			field: "guaranteeDate",
			type: "date",
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeModality"),
			field: "guaranteeModality",
		},
		{
			label: "Tipo da Garantia",
			field: "goodGuaranteeLinkedText"
		},
		{
			label: t("goodsAndGuarantees:form.requestType"),
			field: "",
			type: "custom",
			component: (row: any) => {
				return row?.origin !== null
					? getOrigin(row.origin)
					: row.judicialBlocksAndTransfer?.occurrenceType
					? getOccurrenceType(row.judicialBlocksAndTransfer?.occurrenceType)
					: requestTypesOptionsAll.find((x) => x.value === row.requestTypeId)
							?.label;
			},
		},
		{
			label: 'Status do Bem',
			field: "statusBem",
		},
		{
			label: 'Advogado Interno',
			field: "",
			type: "custom",
			component: (row: any) => {

				if(row?.process)
				return row?.process?.internalLawyer
			},
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeAmount"),
			field: "valueGuarantee",
			type: "currency",
		},
	];

	return (
		<>
			<TableComponent rows={rows} columns={columns} isLoading={loading} />
			<Pagination />
		</>
	);
};

export default GoodsAndGuarantees;
