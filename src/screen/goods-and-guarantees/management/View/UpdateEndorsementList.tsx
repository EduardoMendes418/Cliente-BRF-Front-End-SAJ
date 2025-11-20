import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import {
	getListGoodsGuaranteesRequest,
	getLoadingGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";
import { fetchGoodsGuaranteesRequestList } from "src/core/store/modules/goods-guarantee/thunks";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { usePagination } from "src/hooks/pagination";
import { getOptionsAsObject } from "src/core/utils/func";

import {
	RECORD_TYPE,
	requestTypesOptionsAll,
	TYPE_FLOW,
} from "../../constants";
import {
	STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import { statusBemAsOption, TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { IconButton } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";

const requestTypesOptionsAsObject = getOptionsAsObject(requestTypesOptionsAll);

const UpdateEndorsementList = ({
	goodsAndGuaranteesId,
}: {
	goodsAndGuaranteesId: number;
}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const history = useHistory();

	const { guaranteeModality } = useGuaranteeModality();
	const { page, pageSize } = usePagination();

	const list = useSelector(getListGoodsGuaranteesRequest);
	const loading = useSelector(getLoadingGoodsGuaranteesRequest);

	const rows = useMemo(
		() =>
			list
				.filter((x) => x.recordType === RECORD_TYPE.EFFECTIVE)
				.map(
					({
						statusApprovalId,
						statusFlowId,
						guaranteeModalityId,
						logs,
						recordType,
						...item
					}) => {
						const { description } =
							guaranteeModality.find(({ id }) => id === guaranteeModalityId) ??
							{};

						const inFlow = logs?.find(
							({ statusApprovalId }) =>
								statusApprovalId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
						);

						const isRequest = recordType === RECORD_TYPE.REQUEST;

						const status = item.isDeleted
							? t("goodsAndGuarantees:management.dead")
							: t("enabled");

						return {
							...item,
							status,
							guaranteeModality: description,
							requestType:
								(requestTypesOptionsAsObject as any)[item.requestTypeId] ?? "",
							redirectPage: isRequest
								? inFlow
									? "fluxo"
									: "solicitacao"
								: "gestao",
							guaranteeModalityId,
						};
					}
				),
		[list, guaranteeModality, t]
	);

	const getAttachments = (
		typeFlow: TYPE_FLOW,
		item: TGoodsGuaranteesRequest
	) => {
		if (typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT) return item?.files ?? [];

		const isInsurance = typeFlow === TYPE_FLOW.INSURANCE;

		let attachments = isInsurance
			? item?.estimates?.find(({ isApproved }) => isApproved)?.files
			: item?.files;

		attachments = (attachments ?? []).filter(
			({ isMainFile }: any) => isMainFile
		);

		return attachments;
	};

	const columns: ColumnData[] = [
		{
			label: t("form.attachments"),
			field: "",
			type: "custom",
			component: (row: TGoodsGuaranteesRequest) => {
				const typeFlow =
					guaranteeModality.find(({ id }) => id === row.guaranteeModalityId)
						?.typeFlow ?? TYPE_FLOW.NONE;

				const attachments = getAttachments(typeFlow, row);

				const paths = attachments
					.filter((file) => file.path)
					.map((file) => file.path);
				return (
					<IconButton
						onClick={() => paths.forEach((path) => window.open(path))}
					>
						<AttachmentIcon />
					</IconButton>
				);
			},
		},
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
			label: t("goodsAndGuarantees:form.guaranteeModality"),
			field: "guaranteeModality",
		},
		{
			label: t("goodsAndGuarantees:form.requestType"),
			field: "requestType",
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeAmount"),
			field: "valueGuarantee",
			type: "currency",
		},
		{
			label: t("status"),
			field: "status",
		},
	];

	const handleAction = ({ id, redirectPage }: any) => {
		history.push(`/bens-e-garantias/${redirectPage}/${id}`);
	};

	useEffect(() => {
		dispatch(
			fetchGoodsGuaranteesRequestList({
				goodGuaranteeLinked: goodsAndGuaranteesId,
				page,
				pageSize,
			})
		);
	}, [dispatch, page, pageSize, goodsAndGuaranteesId]);

	return (
		<>
			<Panel title={t("goodsAndGuarantees:management.updateEndorsementList")}>
				<TableComponent
					rows={rows}
					columns={columns}
					onVisualize={handleAction}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default UpdateEndorsementList;
