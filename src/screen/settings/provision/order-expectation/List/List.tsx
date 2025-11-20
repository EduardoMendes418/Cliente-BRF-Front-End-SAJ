import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';
import { usePagination } from 'src/hooks/pagination';
import { actions, AppDispatch } from 'src/core/store';
import { useRegisterDefault } from 'src/hooks';
import { TOrderExpectation } from 'src/core/models/order-expectation'

import {
	fetchOrderExpectations,
	editOrderExpectation,
	fetchByNameOrderExpectation
} from 'src/core/store/modules/order-expectation/thunks'
import {
	getListOrderExpectation,
	getListFiltersOrderExpectation,
	getStatusOrderExpectation,
	getErrorMessageOrderExpectation
} from 'src/core/store/modules/order-expectation/selectors'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListOrderExpectation)
	const filters = useSelector(getListFiltersOrderExpectation)

	useEffect(() => {
		if (filters.partName)
			dispatch(fetchByNameOrderExpectation({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderExpectations({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'orderExpectation',
		getStatus: getStatusOrderExpectation,
		getErrorMessage: getErrorMessageOrderExpectation,
		route: '',
		updateInListCallback: () => dispatch(fetchOrderExpectations({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TOrderExpectation) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderExpectation({ ...row, isActive: !row.isActive }))
		if (type === 'orderExpectation/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });

	}, [dispatch, enqueueSnackbar, t])

	const handleProvisionButton = useCallback(async (row: TOrderExpectation) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderExpectation({ ...row, provision: !row.provision }))
		if (type === 'orderExpectation/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TOrderExpectation) => {
		dispatch(actions.orderExpectation.setItem(row))
		history.push(`/configuracoes/provisao/expectativa-provisao/${row.id}`)
	}, [dispatch, history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('provisions:orderExpectation.id'), field: 'id' },
		{ label: t('provisions:orderExpectation.title'), field: 'name' },
		{
			label: t('provisions:orderExpectation.provision'),
			field: 'provision',
			type: 'switch-button-yn',
			onChange: handleProvisionButton
		},
		{
			label: t('provisions:orderExpectation.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleSwitchButton
		},
	], [handleSwitchButton, handleProvisionButton, t])

	return (
		<>
			<Panel title={t('provisions:orderExpectation.listTitle')}>
				<TableComponent
					onEdit={handleEdit}
					columns={columns}
					rows={list}
					isLoading={false}
				/>
			</Panel>
			<Pagination />
		</>
	)
};

export default List;