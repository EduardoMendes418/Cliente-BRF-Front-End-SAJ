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
import { TOrderStatus } from 'src/core/models/order-status'

import {
	fetchOrderStatuses,
	editOrderStatus,
	fetchByNameOrderStatus
} from 'src/core/store/modules/order-status/thunks'
import {
	getListOrderStatus,
	getListFiltersOrderStatus,
	getStatusOrderStatus,
	getErrorMessageOrderStatus
} from 'src/core/store/modules/order-status/selectors'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListOrderStatus)
	const filters = useSelector(getListFiltersOrderStatus)

	useEffect(() => {
		if (filters.partName)
			dispatch(fetchByNameOrderStatus({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderStatuses({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'orderStatus',
		getStatus: getStatusOrderStatus,
		getErrorMessage: getErrorMessageOrderStatus,
		route: '',
		updateInListCallback: () => dispatch(fetchOrderStatuses({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TOrderStatus) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderStatus({ ...row, isActive: !row.isActive }))
		if (type === 'orderStatus/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });

	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TOrderStatus) => {
		dispatch(actions.paymentType.setItem(row))
		history.push(`/configuracoes/provisao/status-provisao/${row.id}`)
	}, [dispatch, history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('provisions:orderStatus.id'), field: 'id' },
		{ label: t('provisions:orderStatus.statusField'), field: 'name' },
		{
			label: t('provisions:orderStatus.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleSwitchButton
		}
	], [handleSwitchButton, t])

	return (
		<>
			<Panel title={t('provisions:orderStatus.listTitle')}>
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