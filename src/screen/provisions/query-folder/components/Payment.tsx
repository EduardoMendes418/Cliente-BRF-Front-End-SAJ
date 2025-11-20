import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';

import {
	getRowsPayment,
	getLoadingPayment,
	getFiltersPayment
} from 'src/core/store/modules/payment/selectors';
import { useTranslation } from 'src/locale/i18n';
import { statusTextApprovalsFlow, STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { rejectNoValues } from 'src/core/utils/func';
import { fetchSolicitacao } from 'src/core/store/modules/payment/thunks';
import { usePagination } from 'src/hooks/pagination';
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { Modulos } from "src/core/models/modules";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";

const List = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const items = useSelector(getRowsPayment);
	const loading = useSelector(getLoadingPayment);
	const paymentfilters = useSelector(getFiltersPayment)
	const { page, pageSize } = usePagination()

	useEffect(() => {
		dispatch(
			fetchPaymentMethod({
				moduloId: Modulos.Pagamento,
				notPaginate: true,
			})
		);
		dispatch(
			fetchPaymentType({ modulo: Modulos.Pagamento, notPaginate: true })
		);
	}, [dispatch]);

	 useEffect(() => {
		const { legalDepartmentAreaId, ...filters } = paymentfilters[pathname] ?? {};
		const result = rejectNoValues({ ...filters, statusApprovalId: 1, page, pageSize });
		dispatch(fetchSolicitacao(result));
	}, [dispatch, paymentfilters, page, pageSize, pathname]);

	const columns: ColumnData[] = [
		{ label: t('solicitacaoPagamento:numeroSolicitacao'), field: 'id' },
		{ label: t('solicitacaoPagamento:dataSolicitacao'), field: 'requestDate', type: 'date' },
		{ label: t('solicitacaoPagamento:pastaCTG'), field: 'folderNumber' },
		{ label: t('solicitacaoPagamento:processFormData.DEJURArea'), field: 'legalDepartmentArea' },
		{ label: t('solicitacaoPagamento:processFormData.processNumber'), field: 'processNumber' },
		{ label: t('solicitacaoPagamento:processFormData.oppositeParty'), field: 'oppositeParty' },
		{ label: t('Pagamentos:tipoPagamento'), field: 'paymentType' },
		{ label: t('Pagamentos:formaPagamento'), field: 'paymentForm' },
		{ label: t('solicitacaoPagamento:dadosPagamento.dataPagamento'), field: 'paymentDate', type: 'date' },
		{ label: t('solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial'), field: 'paymentValue', type: 'currency' },
		{ label: t('solicitacaoPagamento:dadosPagamento.advogadoInterno'), field: 'internalLaywer' },
		{ label: t('status'), field: 'status' },
	];

	const rows = useMemo(() => items.map(({ statusFlowId, statusApprovalId, requesterId, ...item }) => {
		let status = '';
		statusApprovalId === 8
			? status = statusTextApprovalsFlow[8]
			: status = statusTextApprovalsFlow[statusFlowId]

			if (
				statusFlowId ===
				STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
				statusApprovalId === STATUS_APPROVALS_FLOW.NONE
			)
				status = "Aprovado Advogado Interno";

			if (
				statusFlowId ===
				STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
				statusApprovalId ===
				STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
			)
				status = "Aprovado";

			if (
				statusFlowId ===
				STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE &&
				statusApprovalId ===
				STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
			)
				status = "Reprovado";
			if (
				statusFlowId === 
				STATUS_APPROVALS_FLOW.REVERSAL && 
				statusApprovalId === 
				STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
				)

				status= "Estornado";
					

		return {
			...item,
			status,
			statusFlowId,
		}
	}), [items])

	return (
		<>
			<Table
				columns={columns}
				rows={rows}
				isLoading={loading}
			/>
			<Pagination />
		</>
	);
};

export default List;
