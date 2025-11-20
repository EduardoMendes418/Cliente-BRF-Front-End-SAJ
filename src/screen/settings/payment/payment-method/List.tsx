import { useTranslation } from 'src/locale/i18n';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { editPaymentMethod, fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import {
	getListPaymentMethod,
	getLoadingPaymentMethod,
	getStatusPaymentMethod as getStatus,
	getErrorMessagePaymentMethod as getErrorMessage
} from 'src/core/store/modules/payment-method/selectors';
import { useHistory } from 'react-router-dom';
import { actions } from 'src/core/store';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { useFetchFormaPagamento } from 'src/hooks/paymentMethod';
import { Modulos } from 'src/core/models/modules';
import { useRegisterDefault } from 'src/hooks';
import { getPagination } from 'src/core/store/modules/pagination/selectors';

const FormaPagamento = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListPaymentMethod);
	const isFetching = useSelector(getLoadingPaymentMethod);

	const { page, pageSize } = useSelector(getPagination);

	useFetchFormaPagamento(Modulos.Pagamento);
	useRegisterDefault({
		action: 'paymentMethod',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchPaymentMethod({ page, pageSize, moduloId: Modulos.Pagamento }))
	})

	const handleChange = (row: TPaymentMethod) => {
		if (!row.id) return;
		const values = { ...row, status: !row.status, moduloId: Modulos.Pagamento };
		dispatch(editPaymentMethod({ id: row.id.toString(), values }));
	};

	const columns: ColumnData[] = [
		{ label: 'Id', field: 'id' },
		{ label: 'Forma de pagamento', field: 'descricao' },
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChange,
		},
	];

	const handleEdit = (row: TPaymentMethod) => {
		dispatch(actions.paymentMethod.setItem(row));
		history.push(`/configuracoes/pagamentos/forma-pagamento/${row.id}`);
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

export default FormaPagamento;
