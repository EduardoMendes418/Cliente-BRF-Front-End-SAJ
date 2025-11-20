import { useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { LegalDocumentPrepositionReplacementParties } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";

type ReplacementTableProps = {
	list: LegalDocumentPrepositionReplacementParties[]
	edit: (index: number) => void;
	delete: (index: number) => void;
}

const ReplacementTable = (props: ReplacementTableProps) => {
	const { t } = useTranslation()

	const onEdit = (row: LegalDocumentPrepositionReplacementParties, index?: number) => {
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
			label: t("legalDocs:correspondents.cpf"),
			field: "identificationNumber"
		},
		{
			label: t("legalDocs:correspondents.rg"),
			field: "registryIdentification"
		},
		{
			label: t("legalDocs:correspondents.oab"),
			field: "oabState"
		},
		{
			label: t("legalDocs:correspondents.name"),
			field: "name"
		},
		{
			label: t("legalDocs:correspondents.corporateName"),
			field: "officeName"
		},
		{
			label: t("legalDocs:correspondents.oabNumber"),
			field: "officeOAB"
		},
		{
			label: t("legalDocs:correspondents.address"),
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

export default ReplacementTable;