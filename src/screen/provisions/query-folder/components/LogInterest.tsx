import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { useTranslation } from "src/locale/i18n";

import { usePagination } from "src/hooks/pagination";

import { rejectNoValues } from "src/core/utils/func";
import { fetchLogInterest } from "src/core/store/modules/log-interest/thunks";
import { getListLogInterest, getLoadingLogInterest } from "src/core/store/modules/log-interest/selectors";
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
	root: {
		"& thead tr th": {
			fontSize: "13px",
			fontWeight: 600,
			color: "#5e5e5e",
		},
	},
});

const LogInterest = ({folderNumber}: {folderNumber: string}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const classes = useStyles();

	const list = useSelector(getListLogInterest);
	const { page, pageSize } = usePagination();

	const loading = useSelector(getLoadingLogInterest);


	useEffect(() => {
		const result = rejectNoValues({
			page,
			pageSize,
			folderNumber
		});
		dispatch(fetchLogInterest(result));
	}, [dispatch, page, pageSize, folderNumber]);
	
	const rows = useMemo(
		() =>

		list.map(
				(item: any) => {

					return {
						...item,
						movimentValue: (item?.changedCorrectedValue - item?.previousCorrectedValue),
						accountingDocument: `${item?.company  ?? ""} ${item?.exercice ?? ""} ${item?.documentNumber ?? ""}`
					};
				}
			),
		
		[list]
	);

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
			field: "previousCorrectedValue",
			type: "currency",
		},
		{
			label: t("provisions:provisionLog.list.newValue"),
			field: "changedCorrectedValue",
			type: "currency",
		},
		{
			label: "Valor do movimento",
			field: "movimentValue",
			type: "currency",
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

	return (
		<>
			<TableComponent  
				rows={rows} 
				columns={columns} 
				isLoading={loading} 
				className={classes}
				/>
			<Pagination />
		</>
	);
};

export default LogInterest;
