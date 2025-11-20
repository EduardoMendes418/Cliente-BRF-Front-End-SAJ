import { useMemo } from "react";
import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { TLegalDoc } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";
import useRequestStatus from "./hooks/requestStatus";

type ListProps = {
	list: TLegalDoc[];
};

const List = (props: ListProps) => {
	const { t } = useTranslation();
	const { requestStatusText } = useRequestStatus();

	const columns = useMemo<ColumnData[]>(
		() => [
			{
				field: "id",
				label: t("legalDocs:smartSwap.solicitation"),
			},
			{
				field: "legalDepartmentArea",
				label: t("legalDocs:smartSwap.dejurAreaId"),
				type: "custom",
				component: (row: TLegalDoc) => {
					return row.process?.legalDepartmentArea;
				},
			},
			{
				field: "requestDate",
				label: t("legalDocs:smartSwap.requestDate"),
				type: "date",
			},
			{
				field: "createdBy",
				label: t("legalDocs:smartSwap.requestUserName"),
			},
			{
				field: "folderNumber",
				label: t("legalDocs:smartSwap.folderNumber"),
			},
			{
				field: "processNumber",
				label: t("legalDocs:smartSwap.processNumber"),
			},
			{
				field: "legalDocumentRequestType.id",
				label: t("legalDocs:smartSwap.legalDocumentRequestTypeId"),
				type: "custom",
				component: (row: TLegalDoc) => {
					return row.legalDocumentRequestType?.name;
				},
			},
			{
				field: "serviceUserId",
				label: t("legalDocs:smartSwap.serviceUserId"),
				type: "custom",
				component: (row: TLegalDoc) => {
					return row.serviceUser?.name ?? "-";
				},
			},
			{
				field: "status",
				label: t("legalDocs:smartSwap.status"),
				type: "custom",
				component: (row: TLegalDoc) => {
					if (row.status) return (requestStatusText as any)[row.status];
					else return "-";
				},
			},
		],
		[requestStatusText, t]
	);

	const rows = useMemo(
		() => props.list.slice().sort((x, y) => (y.id ?? 0) - (x.id ?? 0)),
		[props.list]
	);

	return (
		<>
			<Panel title={t("legalDocs:smartSwap.list")}>
				<TableComponent columns={columns} rows={rows} />
			</Panel>
		</>
	);
};

export default List;
