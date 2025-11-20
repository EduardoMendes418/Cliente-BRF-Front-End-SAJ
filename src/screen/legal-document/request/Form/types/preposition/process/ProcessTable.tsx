import { useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { LegalDocumentPrepositionLetterProcess } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";

type ProcessTableProps = {
	list: LegalDocumentPrepositionLetterProcess[]
	edit: (index: number) => void;
	delete: (index: number) => void;
}

const ProcessTable = (props: ProcessTableProps) => {
	const { t } = useTranslation()

	const onEdit = (_: any, index?: number) => {
		if (index !== undefined) {
			props.edit(index)
		}
	}

	const onDelete = (_: any, index?: number) => {
		if (index !== undefined) {
			props.delete(index)
		}
	}

	const columns = useMemo<ColumnData[]>(() => [
		{
			label: t("legalDocs:process.processNumber"),
			field: "processNumber"
		},
		{
			label: t("legalDocs:process.vara"),
			field: "legalCourt"
		},
		{
			label: t("legalDocs:process.comarca"),
			field: "district"
		},
		{
			label: t("legalDocs:process.action"),
			field: "actionType"
		},
	], [t])

	return (
		<TableComponent 
			columns={columns}
			rows={props.list}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	)
}

export default ProcessTable;