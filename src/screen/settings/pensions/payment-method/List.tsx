import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';

import { editPaymentMethod, fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import {
	getListPaymentMethod,
	getLoadingPaymentMethod,
	getStatusPaymentMethod as getStatus,
	getErrorMessagePaymentMethod as getErrorMessage
} from 'src/core/store/modules/payment-method/selectors';
import { actions } from 'src/core/store';
import { TPaymentMethod as FPType } from 'src/core/models/payment-method';
import { Modulos } from 'src/core/models/modules';
import { useFetchFormaPagamento } from 'src/hooks/paymentMethod';
import { useRegisterDefault } from 'src/hooks';
import { getPagination } from 'src/core/store/modules/pagination/selectors';

const PaymentMethod = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListPaymentMethod);
	const isFetching = useSelector(getLoadingPaymentMethod);

	const { page, pageSize } = useSelector(getPagination);

	useFetchFormaPagamento(Modulos.Pension);
	useRegisterDefault({
		action: 'paymentMethod',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchPaymentMethod({ page, pageSize, moduloId: Modulos.Pension }))
	})

	const handleChange = (row: FPType) => {
		if (!row.id) return;
		const values = { ...row, status: !row.status, moduloId: Modulos.Pension };
		dispatch(editPaymentMethod({ id: row.id.toString(), values }));
	};

	const columns: ColumnData[] = [
		{ label: t('Pagamentos:id'), field: 'id' },
		{ label: t('Pagamentos:formaPagamento'), field: 'descricao' },
		{
			label: t('status'),
			field: 'status',
			type: 'switch-button',
			onChange: handleChange,
		},
	];

	const handleEdit = (row: FPType) => {
		dispatch(actions.paymentMethod.setItem(row));
		history.push(`/configuracoes/pensoes/forma-pagamento/${row.id}`);
	};

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('Pagamentos:formaPagamento_plural')}>
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

export default PaymentMethod;
