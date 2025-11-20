import { FormLabel } from "@material-ui/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import {
	FOLDER_OPTIONS,
	TDataImportRequisition,
} from "src/core/models/data-import";
import {
	getDataImportRequests,
	getDataImportStatus,
} from "src/core/store/modules/data-import/selectors";
import { usePagination } from "src/hooks/pagination";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { useTranslation } from "src/locale/i18n";
import { statusText } from "src/screen/requisitions/constants";
import { optionsFolderText } from "src/screen/settings/constants";

const folderText = {
	[FOLDER_OPTIONS.MAIN]: "Principal",
	[FOLDER_OPTIONS.ALL]: "Todas",
	[FOLDER_OPTIONS.LINKED]: "Vinculada",
};

const List = () => {
	const pagination = usePagination();
	const { t } = useTranslation();

	const requests = useSelector(getDataImportRequests);
	const loading = useSelector(getDataImportStatus);

	const { contingenciesOptions, areasResponsibleOptions } =
		useProcessFilterOptions();
	
	const rows = useMemo(() => requests.map(x => ({
		...x,
		responsible: (x?.responsiblesInService && x?.responsiblesInService?.length !== 0)
			? x.responsiblesInService.join(',')
			:  x?.administrativeControlResponsiblesIds?.length !== 0
					? x?.administrativeControlResponsiblesNames?.toString().replace(/,/g, ', ') : x.responsibleName,
	})), [requests])
	
	const columns = useMemo<ColumnData[]>(
		() => [
			{
				label: t("dataImport:requests.id"),
				field: "id",
			},
			{
				label: t("dataImport:requests.requestDate"),
				field: "requestDate",
				type: "date",
			},
			{
				label: t("dataImport:requests.expectedServiceDate"),
				field: "expectedServiceDate",
				type: "date",
			},
			{
				label: t("dataImport:requests.conclusionDate"),
				field: "conclusionDate",
				type: "date",
			},
			{
				label: t("dataImport:requests.requestParameter"),
				field: "requestParameter",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.requestParameter.requestType;
				},
			},
			{
				label: t("dataImport:requests.status"),
				field: "status",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return (statusText as any)[row.status];
				},
			},
			{
				label: "Nome responsável atendimento",
				field: "responsible",
			},
			{
				label: t("dataImport:requests.serviceUser"),
				field: "serviceUser",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.serviceUser?.name ?? "-";
				},
			},
			{
				label: t("dataImport:requests.legalDepartmentArea"),
				field: "legalDepartmentArea",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.process?.legalDepartmentArea ?? "-";
				},
			},
			{
				label: t("dataImport:requests.folderNumber"),
				field: "folderNumber",
			},
			{
				label: t("dataImport:requests.litigationRelationship"),
				field: "litigationRelationship",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					if (row.process?.litigationRelationship) {
						return (folderText as any)[row.process?.litigationRelationship];
					}
					return "-";
				},
			},
			{
				label: t("dataImport:requests.folderStatus"),
				field: "folderStatus",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					if (row.process?.statusId) {
						return (optionsFolderText as any)[row.process.statusId];
					}
					return "-";
				},
			},
			{
				label: t("dataImport:requests.contingency"),
				field: "contingency",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					if (row.process?.contingency) {
						return contingenciesOptions.find(
							(x) => x.value === row.process?.contingency
						)?.label;
					}
					return "-";
				},
			},
			{
				label: t("dataImport:requests.oppositePart"),
				field: "oppositePart",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.process?.otherPartName ?? "-";
				},
			},
			{
				label: t("dataImport:requests.internalLawyer"),
				field: "internalLawyer",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.process?.internalLawyer ?? "-";
				},
			},
			{
				label: t("dataImport:requests.agent"),
				field: "agent",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return row.process?.agent ?? "-";
				},
			},
			{
				label: t("dataImport:requests.legalOfficerId"),
				field: "legalOfficerId",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return (
						row.process?.processParty?.find(
							(x) => x.isMainParticipant && x.situation === "Responsável"
						)?.name ?? "-"
					);
				},
			},
			{
				label: t("dataImport:requests.responsibleAreaId"),
				field: "responsibleAreaId",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					return (
						areasResponsibleOptions.find(
							(x) => x.value === row.process?.responsibleAreaId
						)?.label ?? "-"
					);
				},
			},
			{
				label: t("dataImport:requests.responsibleOfficeId"),
				field: "responsibleOfficeId",
				type: "custom",
				component: (row: TDataImportRequisition) => {
					if (row.process?.responsibleOoffice) {
						return row.process?.responsibleOoffice
					}
					return "-"
				},
			},
			{
				label: "Solicitante",
				field: "requesterName",
			},
		],
		[areasResponsibleOptions, contingenciesOptions, t]
	);

	return (
		<Panel title={t("dataImport:common.list")}>
			<FormLabel
				style={{
					fontWeight: "bold",
					display: "flex",
					margin: "1rem 3% 1rem 1.5%",
				}}
			>
				Requisições encontradas: {pagination.itemCount}
			</FormLabel>
			<TableComponent
				columns={columns}
				rows={rows}
				isLoading={loading === "fetching"}
			/>
		</Panel>
	);
};

export default List;
