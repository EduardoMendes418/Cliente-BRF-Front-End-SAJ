import { useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { LegalDocumentPrepositionReplacementParties } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";

type CorrespondentsTableProps = {
	list: LegalDocumentPrepositionReplacementParties[]
	edit: (index: number) => void;
	delete: (index: number) => void;
}

const CorrespondentsTable = (props: CorrespondentsTableProps) => {
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
			label: t("legalDocs:substabelecimento.cpf"),
			field: "identificationNumber"
		},
		{
			label: t("legalDocs:substabelecimento.rg"),
			field: "registryIdentification"
		},
		{
			label: t("legalDocs:substabelecimento.oab"),
			field: "oabState"
		},
		{
			label: t("legalDocs:substabelecimento.name"),
			field: "name"
		},
		{
			label: t("legalDocs:substabelecimento.corporateName"),
			field: "officeName"
		},
		{
			label: t("legalDocs:substabelecimento.oabNumber"),
			field: "officeOAB"
		},
		{
			label: t("legalDocs:substabelecimento.address"),
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

export default CorrespondentsTable;