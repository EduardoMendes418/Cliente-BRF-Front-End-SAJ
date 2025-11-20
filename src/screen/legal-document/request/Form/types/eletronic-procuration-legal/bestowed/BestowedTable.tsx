import { useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { LegalDocumentEletronicProcurationLegalGranteds } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";
import { usePersonTypes } from "src/screen/legal-document/request/hooks/personType";

type BestowedTableProps = {
	list: LegalDocumentEletronicProcurationLegalGranteds[]
	edit: (index: number) => void;
	delete: (index: number) => void;
}

const BestowedTable = (props: BestowedTableProps) => {
	const { t } = useTranslation()

	const { personsAsOption } = usePersonTypes()

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
			label: t("legalDocs:bestowed.kindOfPerson.title"),
			field: "personType",
			type: "custom",
			component: (row: LegalDocumentEletronicProcurationLegalGranteds) => {
				return personsAsOption.find(x => x.value === row.personType)?.label
			}
		},
		{
			label: t("legalDocs:bestowed.cpfCnpj"),
			field: "identificationNumber"
		},
		{
			label: t("legalDocs:bestowed.name"),
			field: "name"
		},
		{
			label: t("legalDocs:bestowed.brfEmployee"),
			field: "employeeBRF",
			type: "custom",
			component: (row: LegalDocumentEletronicProcurationLegalGranteds) => {
				return row.employeeBRF ? t('sim') : t('nao')
			}
		},
		{
			label: t("legalDocs:bestowed.nameOffice"),
			field: "partnerOfficeName"
		}
	], [personsAsOption, t])

	return (
		<TableComponent 
			columns={columns}
			rows={props.list}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	)
}

export default BestowedTable;