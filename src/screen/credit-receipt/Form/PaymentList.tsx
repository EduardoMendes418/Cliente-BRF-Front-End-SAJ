import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';

import AccordionPanel from 'src/components/AccordionPanel';
import Table, { ColumnData } from 'src/components/Table';

import { getLoadingPayment, getListPayment } from 'src/core/store/modules/payment/selectors';
import { Modulos } from 'src/core/models/modules';
import { TPayment } from 'src/core/models/payment';
import { getOptionsAsObject } from 'src/core/utils/func';
import { statusTextApprovalsFlow } from 'src/core/utils/constants';
import { TCreditReceipt } from 'src/core/models/credit-receipt';
import { usePaymentMethod, usePaymentType } from 'src/hooks/fetchLists';
import { useTranslation } from 'src/locale/i18n';
import Pagination from "src/components/Pagination";
import { usePagination } from "src/hooks/pagination";
import { fetchSolicitacao } from "src/core/store/modules/payment/thunks";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";

type TPaymentList = {
	payment?: TPayment;
}

const PaymentList = ({ payment }: TPaymentList) => {
	const { setFieldValue, values } = useFormikContext<TCreditReceipt>()
	const { t } = useTranslation();
    const dispatch = useDispatch();


	const items = useSelector(getListPayment);
	const loading = useSelector(getLoadingPayment);
	const { page, pageSize } = usePagination();

	let folderNumber = "" as string
	if (items && items[0] && items[0].folderNumber)
		folderNumber = items[0].folderNumber
	useEffect(() => {
		if (folderNumber)
			dispatch(fetchSolicitacao({ folderNumber, statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE, page, pageSize }))
       
    }, [dispatch, folderNumber, page, pageSize]);


	usePaymentMethod(Modulos.Pagamento);
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	const paymentTypeAsObject = useMemo(() => getOptionsAsObject(paymentTypeAsOptions), [paymentTypeAsOptions]);

	const rows = useMemo(() => (payment ? [payment] : items).map((item: TPayment) => ({
		...item,
		paymentTypeId: item.tipoPagamentoId,
		paymentType: paymentTypeAsObject[item.tipoPagamentoId],
		paymentValue: item.valorPagamentoJudicial,
		internalLawyer: item.advogadoInterno,
		status: (statusTextApprovalsFlow as any)[item.statusApprovalId],
		isSelected: item.id === values.paymentId
	})), [items, payment, paymentTypeAsObject, values.paymentId]);

	const columns: ColumnData[] = [
		{ label: t('solicitacaoPagamento:numeroSolicitacao'), field: 'id' },
		{ label: t('solicitacaoPagamento:dataSolicitacao'), field: 'dataSolicitacao', type: 'date' },
		{ label: t('solicitacaoPagamento:pastaCTG'), field: 'folderNumber' },
		{ label: t('form.legalDepartmentArea'), field: 'legalDepartmentArea' },
		{ label: t('Pagamentos:tipoPagamento'), field: 'paymentType' },
		{ label: t('solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial'), field: 'paymentValue', type: 'currency' },
		{ label: t('solicitacaoPagamento:dadosPagamento.advogadoInterno'), field: 'internalLawyer' },
		{ label: t('status'), field: 'status' },
	];

	const onSelectRadio = ({ id, paymentTypeId }: { id: number, paymentTypeId: number }) => {
		setFieldValue('paymentId', id);
		setFieldValue('paymentTypeId', paymentTypeId);
	}

	return (
		<>
			<AccordionPanel title={t('creditReceipt:form.paymentList')} startExpanded noContentMargin>
				<Table
					columns={columns}
					rows={rows}
					isLoading={loading}
					onSelectRadio={payment ? undefined : onSelectRadio}
				/>
			</AccordionPanel>
			<Pagination />
		</>
	);
};

export default PaymentList;
