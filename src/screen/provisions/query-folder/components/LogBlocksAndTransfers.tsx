import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { useTranslation } from "src/locale/i18n";

import { usePagination } from "src/hooks/pagination";

import { rejectNoValues } from "src/core/utils/func";
import { makeStyles } from "@material-ui/core";
import { fetchJudicialBlocksAndTransfersList } from "src/core/store/modules/judicial-blocks-and-transfers/thunks";
import { getListJudicialBlocksAndTransfers, getLoadingJudicialBlocksAndTransfers } from "src/core/store/modules/judicial-blocks-and-transfers/selectors";
import { useBanks } from "src/hooks/fetchLists";
import { allStatusAsObject, occurrenceTypeAsObject } from "src/screen/judicial-blocks-and-transfers/constants";
import { isEditable } from "src/screen/judicial-blocks-and-transfers/editable";
import { statusTextApprovals } from "src/screen/judicial-blocks-and-transfers/List/List";
import { getListAsOptionPaymentTypeAllStatus } from "src/core/store/modules/payment-type/selectors";
import { useCurrentUser } from "src/config/permissions";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";

const useStyles = makeStyles({
	root: {
		"& thead tr th": {
			fontSize: "13px",
			fontWeight: 600,
			color: "#5e5e5e",
		},
	},
});

const LogBlocksAndTransfers = ({folderNumber}: {folderNumber: string}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const classes = useStyles();

	const list = useSelector(getListJudicialBlocksAndTransfers);
	const { banks } =  useBanks();
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);
	const isSolicitacao = location.pathname.includes("solicitacao");
	const { currentScreenPermissions } = useCurrentUser("");

	const { page, pageSize } = usePagination();

	const loading = useSelector(getLoadingJudicialBlocksAndTransfers);

	useEffect(() => {
		const result = rejectNoValues({
			page,
			pageSize,
			folderNumber
		});
		dispatch(fetchJudicialBlocksAndTransfersList({...result, statusApprovalId: 1}));
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento, status: true }));
	}, [dispatch, page, pageSize, folderNumber]);

	const rows = useMemo(
		() =>
			list.map((item) => {
				const {
					id,
					createdDate,
					blockOrTransfDate,
					folderNumber,
					process,
					occurrenceType,
					statusFlowId,
					value,
					occurrenceReason,
					statusApprovalId,
					goodsGuaranteesRequestId,
					bankId,
					destinationBankAccountId,
				} = item;
         const destinationBank = banks?.find(b => b.id === Number(destinationBankAccountId))?.name
				const sourceBank = banks?.find(b => b.id === Number(bankId))?.name
				const statusToShow = allStatusAsObject[statusFlowId];
				const occurrenceTypeToShow = (occurrenceTypeAsObject as any)[occurrenceType];
				const isEditButtonHidden = !isEditable(
					item?.occurrenceReasonType,
					isSolicitacao,
					statusFlowId,
					currentScreenPermissions.edit,
					goodsGuaranteesRequestId === null,
					statusApprovalId
				); 
				return {
					id,
					createdDate,
					folderNumber,
					blockOrTransfDate,
					bankId: sourceBank,
					destinationBankAccountId: destinationBank,
					 statusToShow,
					isEditButtonHidden,
					occurrenceTypeToShow,
					isViewButtonHidden: !isEditButtonHidden, 
					legalDepartmentArea: process?.legalDepartmentArea ?? "",
					statusTextApproval:
						(statusTextApprovals as any)[statusApprovalId ?? "10"] ?? "",
					value,
					occurrenceReasonText: paymentTypeAsOptions.find(
						(item) => item.value === occurrenceReason
					)?.label,
				};
			}),
		[list, banks, paymentTypeAsOptions]
	);

	const columns: ColumnData[] = [
		{
			label: t("judicialBlocksAndTransfers:form.requestNumber"),
			field: "id",
		},
		{
			label: "Data do registro",
			field: "createdDate",
			type: "date",
		},
		{
			label: "Data do bloq/transf",
			field: "blockOrTransfDate",
			type: "date",
		},
		{
			label: t("form.CTGFolder"),
			field: "folderNumber",
		},
		{
			label: t("form.legalDepartmentArea"),
			field: "legalDepartmentArea",
		},
		{
			label: t("judicialBlocksAndTransfers:form.occurrenceType"),
			field: "occurrenceTypeToShow",
		},
		{
			label: "Motivo da ocorrência",
			field: "occurrenceReasonText",
		},
		{
			label: "Banco de Origem",
			field: "bankId",
		},
		{
			label: "Valor",
			field: "value",
			type: "currency",
		},

		{
			label: "Banco de Destino",
			field: "destinationBankAccountId",
		},
		{
			label: t("status"),
			field: "statusToShow",
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

export default LogBlocksAndTransfers;