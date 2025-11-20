import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { confirm } from "src/components/modals";
import { useSnackbar } from "notistack";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { actions, AppDispatch } from "src/core/store";
import { useRegisterDefault } from "src/hooks";

import { TOrderConfrontingType } from "src/core/models/confronting-parameters";

import {
	fetchOrderConfrontings,
	editOrderConfronting,
	deleteOrderConfronting,
} from "src/core/store/modules/order-confronting-parameters/thunks";

import {
	getListOrderConfronting,
	getListFiltersOrderConfronting,
	getStatusOrderConfronting,
	getErrorMessageOrderConfronting,
} from "src/core/store/modules/order-confronting-parameters/selectors";
import { getListAreasDEJUR } from "src/core/store/modules/areas/selectors";

const List = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { page, pageSize } = usePagination();
	const { enqueueSnackbar } = useSnackbar();

	const list = useSelector(getListOrderConfronting);
	const filters = useSelector(getListFiltersOrderConfronting);
	const areas = useSelector(getListAreasDEJUR);

	useRegisterDefault({
		action: "orderConfrontingParameters",
		getStatus: getStatusOrderConfronting,
		getErrorMessage: getErrorMessageOrderConfronting,
		route: "noRedirect",
		updateInListCallback: () =>
			dispatch(fetchOrderConfrontings({ ...filters, page, pageSize })),
	});

	const handleSwitchButton = useCallback(
		async (row: TOrderConfrontingType) => {
			if (!row.id) return;
			const { type } = await dispatch(
				editOrderConfronting({ ...row, isActive: !row.isActive })
			);
			if (type === "orderConfrontingParameters/edit/rejected") {
				enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
			}
		},
		[dispatch, enqueueSnackbar, t]
	);

	const handleEdit = (row: TOrderConfrontingType) => {
		dispatch(actions.orderConfrontingParameters.setItem(row));
		history.push(`/configuracoes/provisao/confrontador/${row.id}`);
	};

	const handleDelete = async (row: TOrderConfrontingType) => {
		if (!row.id) return;
		if (!(await confirm(t("confirmDeletion")))) return;
		dispatch(deleteOrderConfronting(row.id));
	};

	const columns: ColumnData[] = useMemo(
		() => [
			{
				label: t("provisions:orderConfrontingParameters.id"),
				field: "id",
			},
			{
				label: t("closure:runEqualization.list.dejurArea"),
				field: "areaDejurName",
			},
			{
				label: t("provisions:orderConfrontingParameters.status"),
				field: "isActive",
				type: "switch-button",
				onChange: handleSwitchButton,
			},
		],
		[handleSwitchButton, t]
	);

	useEffect(() => {
		dispatch(fetchOrderConfrontings({ ...filters, page, pageSize }));
	}, [dispatch, filters, page, pageSize]);

	const rows = useMemo(() => {
		const newList = list.map((order) => ({
			...order,
			areaDejurName: areas.find((x) => x.id === order.areaDejurId)?.path,
		}));

		return newList;
	}, [areas, list]);

	return (
		<>
			<Panel title={t("provisions:orderConfrontingParameters.listTitle")}>
				<TableComponent
					onEdit={handleEdit}
					columns={columns}
					rows={rows}
					isLoading={false}
					onDelete={handleDelete}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
