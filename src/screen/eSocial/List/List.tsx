import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import {
	getListESocialEventLauch,
	getLoadingESocialEventLauch,
	getListFiltersESocialEventLauch,
} from "src/core/store/modules/e-social-event-launch/selectors";
import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";

import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { fetchESocialEventLauch } from "src/core/store/modules/e-social-event-launch/thunks";
import { objESocial, objEventLaunchStatus } from "src/core/models/eSocial";

const List = ({ pathname }: { pathname: string }) => {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { ...history } = useHistory();

	const { page, pageSize } = usePagination();
	const items = useSelector(getListESocialEventLauch) as any[];
	const loading = useSelector(getLoadingESocialEventLauch);
	const esocialfilters = useSelector(getListFiltersESocialEventLauch);
	const { id: userId } = useSelector(getDataCurrentUser);

	useEffect(() => {
		const result = rejectNoValues({
			...esocialfilters,
			page,
			pageSize,
		});

		dispatch(fetchESocialEventLauch({ ...result }));
	}, [dispatch, esocialfilters, page, pageSize, pathname, userId]);

	const columns: ColumnData[] = [
        {
			label: "Id",
			field: "id",
		},
		{ label: "Id de pagamento", field: "paymentId" },
		{ label: "Tipo de pagamento", field: "paymentTypeName" },
		{ label: "Tipo de verba", field: "amountTypeDescription" },
		{ label: "Mês Competência", field: "accrualMonth", type: "date" },
		{
			label: "Tipo Evento",
			field: "eventCodeText",
		},
		{ label: t("solicitacaoPagamento:pastaCTG"), field: "folderNumber" },
		{ label: "Matrícula", field: "matricula"},
		{
			label: "Número do processo",
			field: "processNumber",
		},
		{ label: "Contribuinte", field: "nmTrab" },
		{ label: "Empregador", field: "employer" },
		{ label: "Data da atualização", field: "createdDate", type: "date" },
		// { label: "Recibo do evento", field: "eventReceipt" },
		// { label: "Erro validador", field: "validatorError" },
		{ label: t("status"), field: "eventLaunchStatusText" },
	];

	const handleAction = (row: any) => {
		history.push(`${pathname}/${row.id}:${row.eventCode}`);
	};

	const rows = useMemo(
		() =>
			items?.map((item: any) => ({
				...item,
				eventCodeText: (objESocial as any)[item?.eventCode ?? ""],
                eventLaunchStatusText: (objEventLaunchStatus as any)[item?.eventLaunchStatus ?? ""],
                isViewButtonHidden: item.eventLaunchStatus !== 4,
                isEditButtonHidden: item.eventLaunchStatus === 4,
                
			})),
		[items]
	);

	return (
		<>
			<Panel title={"Listagem eSocial"}>
				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={loading}
					onEdit={handleAction}
					onVisualize={handleAction}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;

