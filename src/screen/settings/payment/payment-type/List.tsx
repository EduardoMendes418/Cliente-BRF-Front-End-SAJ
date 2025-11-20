import { useTranslation } from 'src/locale/i18n';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import {
	getListFiltersPaymentType,
	getListPaymentType,
	getLoadingPaymentType,
	getStatusPaymentType as getStatus,
	getErrorMessagePaymentType as getErrorMessage
} from 'src/core/store/modules/payment-type/selectors';
import { useHistory } from 'react-router-dom';
import { actions } from 'src/core/store';
import { TPaymentType } from 'src/core/models/payment-type';
import {
	editPaymentType,
	fetchPaymentType,
} from 'src/core/store/modules/payment-type/thunks';
import { Formik, FormikHelpers } from 'formik';
import { Grid } from '@material-ui/core';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { Modulos } from 'src/core/models/modules';
import { usePagination } from 'src/hooks/pagination';
import { useEffect, useMemo } from 'react';
import { rejectNoValues } from 'src/core/utils/func';
import { useRegisterDefault } from 'src/hooks';

const TipoPagamento = () => {
	const { t } = useTranslation();
	const { location: { pathname }, ...history } = useHistory();
	const dispatch = useDispatch();

	const { page, pageSize } = usePagination();
	const paymentTypeFilters = useSelector(getListFiltersPaymentType);

	useRegisterDefault({
		action: 'paymentType',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchPaymentType({ page, pageSize, ...(paymentTypeFilters[pathname] ?? {}), modulo: Modulos.Pagamento }))
	})

	const list = useSelector(getListPaymentType);
	const isFetching = useSelector(getLoadingPaymentType);
	const status = useSelector(getStatus);

	const rows = useMemo(() => list.map(item => ({ ...item, paymentTypeName: item.financeChartOfAccountsCategory?.name ?? '' })), [list]);

	useEffect(() => {
		const filters = paymentTypeFilters[pathname] ?? {}
		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			modulo: Modulos.Pagamento,
		})
		dispatch(fetchPaymentType({ ...result, modulo: Modulos.Pagamento, }))
	}, [dispatch, paymentTypeFilters, page, pageSize, pathname])

	const handleChange = (row: TPaymentType) => {
		if (!row.id) return;
		const values = { ...row, status: !row.status, moduloId: Modulos.Pagamento };
		dispatch(editPaymentType({ id: row.id, values }));
	};

	const columns: ColumnData[] = [
		{ label: 'Id', field: 'id' },
		{ label: 'Tipo de pagamento', field: 'paymentTypeName' },
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChange,
		},
	];

	const handleEdit = (row: TPaymentType) => {
		dispatch(actions.paymentType.setItem(row));
		history.push(`/configuracoes/pagamentos/tipo-pagamento/${row.id}`);
	};

	const onSubmit = (
		values: { desc: string },
		{ setSubmitting }: FormikHelpers<{ desc: string }>
	) => {
		dispatch(actions.paymentType.setFilters({ filters: { ...values, page: 1 }, page: pathname }))
		setSubmitting(false)
	};

	const initialValues = {
		desc: '',
		...(paymentTypeFilters[pathname] ?? {})
	} as { desc: string }

	return (
		<ScreenTemplate slotTopRight>
			<Panel title='Buscar tipo de pagamento' withPadding>
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					enableReinitialize
				>
					{({ handleSubmit, dirty }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<TextField
										name='desc'
										label='Tipo de pagamento'
									/>
								</Grid>
								<Grid item md={1} xs={2}>
									<Submit type="search" disabled={!dirty} submitting={isFetching || status === 'saving'} />
								</Grid>
							</Grid>
							<Clean action='paymentType' page={pathname} />
						</form>
					)}
				</Formik>
			</Panel>
			<Panel title={t('Pagamentos:tipoPagamento_plural')}>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={rows}
					isLoading={isFetching || status === 'saving'}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default TipoPagamento;
