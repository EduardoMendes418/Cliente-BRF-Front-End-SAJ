import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";

import {
	getLoadingLogProvision,
	getFiltersLogProvision,
} from "src/core/store/modules/log-provision/selectors";
import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import moment from "moment";
import Pagination from "src/components/Pagination";
import { makeStyles } from "@material-ui/core";

import { fetchProvisionLog } from "src/core/store/modules/confronting-orders/thunks";

const useStyles = makeStyles({
	root: {
		"& thead tr th": {
			fontSize: "13px",
			fontWeight: 600,
			color: "#5e5e5e",
		},
	},
});

const ProvisionLog = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();

	const { t } = useTranslation();

	const loading = useSelector(getLoadingLogProvision);
	const filtersLog = useSelector(getFiltersLogProvision);

	const [items, setItems] = useState<any>();

	useEffect(() => {
		const filters = filtersLog["/provisoes/consulta-pasta"] ?? {};

		(async () => {
			const arr: any = await dispatch(
				fetchProvisionLog({
					filters: {
						folderNumber: filters.folderNumber,
						page: page,
						pageSize: pageSize,
					},
				})
			);
			setItems(arr?.payload);
		})();
	}, [dispatch, filtersLog, page, pageSize]);

	const columns: ColumnData[] = [
		{
			label: t("provisions:provisionLog.list.orderDescription"),
			field: "orderName",
		},
		{
			label: t("provisions:provisionLog.list.orderExpectationName"),
			field: "orderExpectationName"
		},
		{
			label: t("provisions:provisionLog.list.ratingDescription"),
			field: "ratingDescription",
		},
		{
			label: t("provisions:provisionLog.list.probability"),
			field: "probabilityDescription",
		},
		{
			label: t("provisions:provisionLog.list.oldValue"),
			field: "previousValue",
			type: "currency",
		},
		{
			label: t("provisions:provisionLog.list.newValue"),
			field: "changedValue",
			type: "currency",
		},
		{
			label: "Valor do movimento",
			field: "",
			type: "custom",
			component: (row: any) => {
				return (
					"R$ " +
					parseFloat(
						(row?.changedValue - row?.previousValue).toFixed(2)
					).toLocaleString("pt-BR", {
						currency: "BRL",
						minimumFractionDigits: 2,
					})
				);
			},
		},
		{ label: t("provisions:provisionLog.list.accountingDocument"), field: "accountingDocument", noWrap: true },
		{
			label: t("provisions:provisionLog.list.timestamp"),
			field: "updatedDate",
			type: "dateHour",
		},
		{
			label: t("provisions:provisionLog.list.updatedBy"),
			field: "updatedBy",
		},
		{
			label: t("provisions:provisionLog.list.updateReason"),
			field: "updateReason",
		},
	];

	const rows = useMemo(
		() =>
			items !== undefined
				? items.map(({ ...item }) => {
						return {
							...item,
							updatedDateHour: moment(item.updatedDate).format("HH:mm"),
							accountingDocument: `${item.company ?? ''} ${item.exercice ?? ''} ${item.documentNumber ?? ''}`
						};
				  })
				: null,
		[items]
	);

	return (
		<>
			<TableComponent
				className={classes}
				columns={columns}
				rows={rows}
				isLoading={loading}
			/>
			<Pagination />
		</>
	);
};

export default ProvisionLog;
