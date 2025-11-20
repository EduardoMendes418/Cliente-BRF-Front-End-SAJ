import { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
	getListFiltersOfficeManagementRequestRefund,
	getListOfficeManagementRequestRefund,
	getLoadingOfficeManagementRequestRefund,
} from "src/core/store/modules/office-management-request-refund/selectors";
import { fetchOfficeManagementRequestRefund } from "src/core/store/modules/office-management-request-refund/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementPayment } from "src/core/models/office-management-payment";

import {
	statusTextApprovalsFlow,
} from "src/core/utils/constants";
import {pathStage} from "../constants";

const List = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const stage = pathStage[pathname];
	
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();

	const list = useSelector(getListOfficeManagementRequestRefund);
	const filters = useSelector(getListFiltersOfficeManagementRequestRefund);
	const loading = useSelector(getLoadingOfficeManagementRequestRefund);

	useEffect(() => {
		dispatch(
			fetchOfficeManagementRequestRefund({
				...filters,
				page,
				pageSize,
			})
		);
	}, [dispatch, page, pageSize, filters]);

	const columns: ColumnData[] = [
		{
			label: "Número da solicitação",
			field: "id",
		},
		{
			label: "Data da solicitação",
			field: "registrationDate",
			type: "date"
		},
		{
			label: "Pasta CTG",
			field: "folderNumber",
		},
		{
			label: "Área DEJUR",
			field: "areaDejur",
		},
		{
			label: "Parte contrária",
			field: "internalLawyerName",
		},
		{
			label: "Escritório responsável",
			field: "externalOffice",
		},
		{
			label: "Solicitante",
			field: "requestName",
		},
		{
			label: "Status",
			field: "status",
		},
	];

	const rows = useMemo(
		() =>
			list.map((item: any) => {
				return {
					...item,
					folderNumber: item.refunds[0]?.folderNumber,
					registrationDate: item.refunds[0]?.registrationDate,
					externalOffice: item.refunds[0]?.externalOfficeName,
					requestName: item.refunds[0]?.requester?.name, 
					isViewButtonHidden: item.stage === stage,
					isEditButtonHidden: item.stage !== stage,
					status: statusTextApprovalsFlow[item.statusFlowId]
				};
			}),
		[list, stage]
	);

	const onEdit = ({ id }: TOfficeManagementPayment) => {
		history.push(`${pathname}/${id}`);
	};

	return (
		<>
			<Panel title={t("officeManagement:list")}>
				<TableComponent
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
					onVisualize={onEdit}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;

