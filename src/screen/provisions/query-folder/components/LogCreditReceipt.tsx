import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { useTranslation } from "src/locale/i18n";

import { usePagination } from "src/hooks/pagination";

import { getOptionsAsObject } from "src/core/utils/func";
import { makeStyles } from "@material-ui/core";

import { getListCreditReceipt, getLoadingCreditReceipt } from "src/core/store/modules/credit-receipt/selectors";
import { getListAsOptionPaymentTypeAllStatus } from "src/core/store/modules/payment-type/selectors";
import { useCurrentUser } from "src/config/permissions";
import { fetchCreditReceiptList } from "src/core/store/modules/credit-receipt/thunks";
import { statusText } from "src/screen/credit-receipt/constants";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";

const useStyles = makeStyles({
	root: {
		"& thead tr th": {
			fontSize: "13px",
			fontWeight: 600,
			color: "#5e5e5e",
		},
	},
});

const LogCreditReceipt = ({folderNumber}: {folderNumber: string}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const classes = useStyles();

	const items = useSelector(getListCreditReceipt);

	const loading = useSelector(getLoadingCreditReceipt);

	const { page, pageSize } = usePagination();
	
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);

	const { currentScreenPermissions } = useCurrentUser("");

	const paymentTypeAsObject = useMemo(
		() => getOptionsAsObject(paymentTypeAsOptions),
		[paymentTypeAsOptions]
	);

	useEffect(() => {
		dispatch(fetchCreditReceiptList({ page, pageSize, folderNumber: folderNumber, statusApprovalId: 1 }));
		dispatch(fetchPaymentType({ 
			pageSize: 100, 
			notPaginate: true,
			modulo: 6 
		}));
	}, [dispatch, page, pageSize]);

	
	const rows = useMemo(
		() =>
			items.map((item) => {
				return {
					...item,
					sapReleaseDate: item.sapResponses && item.sapResponses.length > 0 
						? item.sapResponses?.[0].releaseDate
						: "-",
					status: statusText[item.statusFlowId],
					paymentType: (paymentTypeAsObject as any)[item.paymentTypeId] ?? "",
				};
			}),
		[items, currentScreenPermissions, paymentTypeAsObject]
	);

	const columns: ColumnData[] = [
		{ label: t("creditReceipt:list.requestNumber"), field: "id" },
		{ label: t("goodsAndGuarantees:accountability.parentAccountabilityId"), field: "parentCreditReceiptsId"},
		{ label: t("form.CTGFolder"), field: "folderNumber" },
		{
			label: t("creditReceipt:form.requestDate"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("creditReceipt:form.paymentType"), field: "paymentType" },
		{
			label: t("creditReceipt:form.value"),
			field: "creditValue",
			type: "currency",
		},
		{ label: t("status"), field: "status" },
		{ 
			label: t("creditReceipt:list.evaluatorDateStart"), 
			field: "evaluatorDate",
			type: "dateHour"
		},
		{ 
			label: t("creditReceipt:list.sapRequestDateStart"), 
			field: "sapReleaseDate",
			type: "date"
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

export default LogCreditReceipt;
