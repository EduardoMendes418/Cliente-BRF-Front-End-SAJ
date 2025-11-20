import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getPensionRequestListFilters,
	getPensionRequestRows,
	getPensionRequestStatus,
} from "src/core/store/modules/pensions/request-pensions/selectors";
import { fetchPensionRequest } from "src/core/store/modules/pensions/request-pensions/thunks";
import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";
import Pagination from "src/components/Pagination";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";
import { useHistory } from "react-router-dom";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import {
	requestStatusFlowText,
	requestStatusText,
	REQUEST_STATUS_FLOW,
} from "src/screen/pensions/request/constants";
import { AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import { useAreasWitchGroups } from "src/hooks/fetchLists";

const List = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { page, pageSize } = usePagination();
	const items = useSelector(getPensionRequestRows);
	const status = useSelector(getPensionRequestStatus);
	const filters = useSelector(getPensionRequestListFilters);
	const { areasDEJUROptions } = useAreasWitchGroups();
	const { enqueueSnackbar } = useSnackbar();

	const isSolicitation = pathname.startsWith("/pensoes/solicitar-pensao");

	const isApprovalLegalControl = pathname.startsWith(
		"/pensoes/validacao-controle-juridico"
	);
	const isApprovalInternalLawyer = pathname.startsWith(
		"/pensoes/aprovacao-advogado-interno"
	);

	const rows = useMemo(
		() =>
			items.map(({ status, flowId, statusApprovalId, ...item }) => {
				let isEditButtonVisible = false;

				if (
					(isSolicitation && [REQUEST_STATUS_FLOW.DEVOLVER].includes(flowId)) ||
					(isApprovalLegalControl &&
						[REQUEST_STATUS_FLOW.NONE].includes(flowId)) ||
					(isApprovalInternalLawyer &&
						[REQUEST_STATUS_FLOW.APROVACAO_INTERNA].includes(flowId))
				) {
					isEditButtonVisible = true;
				}

				return {
					...item,
					isViewButtonHidden: isEditButtonVisible,
					isEditButtonHidden: !isEditButtonVisible,
					status: requestStatusText[status],
					flowId: requestStatusFlowText[flowId],
				};
			}),
		[isApprovalInternalLawyer, isApprovalLegalControl, isSolicitation, items]
	);

	useEffect(() => {
		dispatch(
			fetchPaymentMethod({ moduloId: Modulos.Pension, notPaginate: true })
		);
		dispatch(fetchPaymentType({ modulo: Modulos.Pension, notPaginate: true }));
	}, [dispatch]);

	useEffect(() => {
		let statusFlowIds: number[] | "" = "";

		if (isSolicitation) {
			statusFlowIds = [
				REQUEST_STATUS_FLOW.NONE,
				REQUEST_STATUS_FLOW.APROVACAO_ADVOGADO_INTERNO,
				REQUEST_STATUS_FLOW.REJEITADO,
				REQUEST_STATUS_FLOW.DEVOLVER,
				REQUEST_STATUS_FLOW.APROVACAO_INTERNA,
				REQUEST_STATUS_FLOW.MORTO,
			];
		} else if (isApprovalLegalControl) {
			statusFlowIds = [REQUEST_STATUS_FLOW.NONE];
		} else if (isApprovalInternalLawyer) {
			statusFlowIds = [REQUEST_STATUS_FLOW.APROVACAO_INTERNA];
		}

		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			statusFlowIds: filters.flowId ?? statusFlowIds,
			flowId: undefined,
		});
		dispatch(fetchPensionRequest(result)).then(({ meta, payload }) => {
			if (meta.requestStatus === "rejected") {
				enqueueSnackbar(payload, { variant: "error" });
			}
		});
	}, [
		dispatch,
		page,
		pageSize,
		filters,
		isSolicitation,
		isApprovalLegalControl,
		isApprovalInternalLawyer,
		enqueueSnackbar,
	]);

	const columns: ColumnData[] = [
		{ label: t("pension:request.requestNumber"), field: "id" },
		{
			label: t("pension:request.requestDate"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("form.CTGFolder"), field: "folderNumber" },
		{ label: t("form.area"), field: "area" },
		{
			label: t("pension:request.nameOppositeParty"),
			field: "parteContraria",
		},
		{
			label: "Etapa",
			field: "flowId",
		},
		{ label: t("status"), field: "status" },
	];

	const handleView = (row: any) => {
		history.push(`${pathname}/${row.id}`);
	};

	return (
		<>
			<Panel title={t("pension:request.list.title")}>
				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={status === "fetching"}
					onVisualize={handleView}
					onEdit={handleView}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
