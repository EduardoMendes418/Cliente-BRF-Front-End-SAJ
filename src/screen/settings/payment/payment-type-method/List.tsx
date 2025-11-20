import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';

import { useTranslation } from 'src/locale/i18n';
import {
	useActionRelacaoTipoFormaPagamento,
} from 'src/hooks/paymentTypeMethod';
import {
	getLoadingPaymentTypeMethod,
	getTablePaymentTypeMethod,
} from 'src/core/store/modules/payment-type-method/selectors';
import { actions } from 'src/core/store';
import { TPaymentTypeMethod } from 'src/core/models/payment-type-method';
import { usePagination } from 'src/hooks/pagination';
import { fetchPaymentTypeMethod } from 'src/core/store/modules/payment-type-method/thunks';

const RelacaoTipoFormaPagamento = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const { page, pageSize } = usePagination();
	const list = useSelector(getTablePaymentTypeMethod);
	const isFetching = useSelector(getLoadingPaymentTypeMethod);

	useEffect(() => {
		dispatch(fetchPaymentTypeMethod({ page, pageSize, status: true }));
	}, [page, pageSize, dispatch]);

	useActionRelacaoTipoFormaPagamento();

	const columns: ColumnData[] = [
		{ label: t('Pagamentos:tipoPagamento_plural'), field: 'tipoPagamento' },
		{
			label: t('Pagamentos:formaPagamento_plural'),
			field: 'formasPagamento',
			type: 'array',
		},
		{
			label: t('Pagamentos:tipoXFormaPagamento.formularioVinculado'),
			field: 'formularios',
			type: 'array',
		},
	];

	const handleEdit = (row: TPaymentTypeMethod) => {
		dispatch(actions.paymentTypeMethod.setItem(row.id));
		history.push(`/configuracoes/pagamentos/relacao-tipo-forma/${row.id}`);
	};

	return (
		<ScreenTemplate slotTopRight={t('Pagamentos:tipoXFormaPagamento.novoVinculo')}>
			<Panel
				title={t('Pagamentos:relacaoTipoXFormaPagamento')}
			>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={list}
					isLoading={isFetching}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default RelacaoTipoFormaPagamento;
