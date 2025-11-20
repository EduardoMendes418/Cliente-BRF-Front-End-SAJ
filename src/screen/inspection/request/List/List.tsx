import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import {
	getRowsPaymentInspection,
	getLoadingPayment,
	getFiltersPayment,
} from "src/core/store/modules/inspection/selectors";
import { fetchPaymentInspectionList } from "src/core/store/modules/inspection/thunks";
import { useTranslation } from "src/locale/i18n";
import { Modulos } from "src/core/models/modules";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import {
	statusTextApprovalsFlow,
	STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { useStage } from "../../utils";

const List = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { ...history } = useHistory();

	const { page, pageSize } = usePagination();
	const items = useSelector(getRowsPaymentInspection);
	const loading = useSelector(getLoadingPayment);
	const paymentfilters = useSelector(getFiltersPayment);
	const { id: userId, idBrf } = useSelector(getDataCurrentUser);
	const { isInternalLawyerApproval, isLegalControlValidation, isSolicitation } = useStage();

	useEffect(() => {
		dispatch(
			fetchPaymentMethod({
				moduloId: Modulos.Inspection,
				notPaginate: true,
			})
		);
		dispatch(
			fetchPaymentType({ modulo: Modulos.Inspection, notPaginate: true })
		);
	}, [dispatch]);

	useEffect(() => {
		const { legalDepartmentAreaId, ...filters } =
			paymentfilters[pathname] ?? {};

		const isApprovalInternalLawyer = pathname.startsWith(
			"/fiscalizacao/aprovacao-advogado-interno"
		);
		const resultIsApproval = rejectNoValues({
			...filters,
			page,
			pageSize,
			advogadoInternoId: isApprovalInternalLawyer ? idBrf : null,
			fluxoAprovacao: 2
		});

		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			fluxoAprovacao: 1
		});
		if(pathname.includes('aprovacao-controle-juridico') === false){
			delete result.fluxoAprovacao
		}
	
		dispatch(fetchPaymentInspectionList(isApprovalInternalLawyer === false ? result : resultIsApproval));
	}, [dispatch, paymentfilters, page, pageSize, pathname, userId]);

	const columns: ColumnData[] = [
		{ label: t("solicitacaoPagamento:numeroSolicitacao"), field: "id" },
		{
			label: t("solicitacaoPagamento:dataSolicitacao"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("solicitacaoPagamento:pastaCTG"), field: "folderNumber" },
		{
			label: t("solicitacaoPagamento:processFormData.DEJURArea"),
			field: "legalDepartmentArea",
		},
		{
			label: t("solicitacaoPagamento:dadosPagamento.dataPagamento"),
			field: "paymentDate",
			type: "date",
		},
		{
			label: t("inspection:resquest.valorTotalGuia"),
			field: "valorTotalGuia",
			type: "currency",
		},
		{
			label: t("solicitacaoPagamento:dadosPagamento.advogadoInterno"),
			field: "advogadoInterno",
		},
		{ label: t("status"), field: "statusDescription" },
	];

	const handleAction = (row: any) => {
		history.push(`${pathname}/${row.id}`);
	};
	
	const rows = useMemo(
		() =>
			items.map(
				({
					statusFlowId,
					statusApprovalId,
					requesterId,
					isInternal,
					tipoPagamentoId,
					bancoId,
					...item
				}) => {
					let isEditButtonVisible = false;

					if(statusFlowId === STATUS_APPROVALS_FLOW.RETURNED && statusApprovalId === STATUS_APPROVALS_FLOW.NONE && isSolicitation === true && userId === requesterId){
						isEditButtonVisible = true;
					}
					
					if(isLegalControlValidation === true && statusFlowId === STATUS_APPROVALS_FLOW.REQUESTED && statusApprovalId === STATUS_APPROVALS_FLOW.NONE && item.fluxoAprovacao === 1){
						isEditButtonVisible = true;
					}

					if(isInternalLawyerApproval === true && statusFlowId === STATUS_APPROVALS_FLOW.REQUESTED && statusApprovalId === STATUS_APPROVALS_FLOW.NONE && item.fluxoAprovacao === 2){
						isEditButtonVisible = true;
					}

					let status = (statusTextApprovalsFlow as any)[statusFlowId];

					if (
						statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
						statusApprovalId === STATUS_APPROVALS_FLOW.NONE
					)
						status = "Aprovado internamente";
					if (statusApprovalId === STATUS_APPROVALS_FLOW.CONTABILIZATION_ERROR)
						status = "Erro na contabilização";

					return {
						...item,
						status: status,
						statusFlowId,
						isViewButtonHidden: isEditButtonVisible,
						isEditButtonHidden: !isEditButtonVisible,
					};
				}
			),
		[
			items,
			isLegalControlValidation,
			isInternalLawyerApproval,
			userId,
		]
	);

	return (
		<>
			<Panel title={t("solicitacaoPagamento:list")}>
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
