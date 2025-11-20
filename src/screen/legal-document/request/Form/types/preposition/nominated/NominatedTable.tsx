import { useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { LegalDocumentPrepositionLetterParties } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";

type NominatedTableProps = {
	list: LegalDocumentPrepositionLetterParties[]
	edit: (index: number) => void;
	delete: (index: number) => void;
}

const NominatedTable = (props: NominatedTableProps) => {
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
			label: t("legalDocs:nominated.cpf"),
			field: "identificationNumber"
		},
		{
			label: t("legalDocs:nominated.rg"),
			field: "registryIdentification"
		},
		{
			label: t("legalDocs:nominated.name"),
			field: "name"
		},
		{
			label: t("legalDocs:nominated.initials"),
			field: "identifier"
		},
		{
			label: t("legalDocs:nominated.office"),
			field: "role"
		},
		{
			label: t("legalDocs:nominated.address"),
			field: "addressName"
		}
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

export default NominatedTable;