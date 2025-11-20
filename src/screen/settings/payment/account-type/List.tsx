import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions } from 'src/core/store';
import { getPagination } from 'src/core/store/modules/pagination/selectors';
import { getListPaymentAccountType, getLoadingPaymentAccountType } from 'src/core/store/modules/payment-account-type/selectors';
import { useEffect } from 'react';
import { editPaymentAccountType, fetchPaymentAccountType } from 'src/core/store/modules/payment-account-type/thunks';

const TipoDeConta = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const list = useSelector(getListPaymentAccountType);
	const isFetching = useSelector(getLoadingPaymentAccountType);

	const { page, pageSize } = useSelector(getPagination);

	useEffect(() => {
		dispatch(fetchPaymentAccountType())
	}, [page, pageSize, dispatch]);

	const handleChange = (row: any) => {
		if (!row.id) return;
		dispatch(editPaymentAccountType({...row, isActive: !row.isActive })); 
	};

	const columns: ColumnData[] = [
		{ label: 'Id', field: 'id' },
		{ label: 'Código', field: 'code' },
		{ label: 'Descrição', field: 'description'},
		{
			label: 'Status',
			field: 'isActive',
			type: 'switch-button',
			onChange: handleChange,
		},
	];

	const handleEdit = (row: any) => {
		dispatch(actions.paymentMethod.setItem(row));
		history.push(`/configuracoes/pagamentos/tipo-de-conta/${row.id}`);
	};

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={"Tipo de conta"}>
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

export default TipoDeConta;
