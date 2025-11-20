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
import { TOrderProbability } from 'src/core/models/order-probability'

import {
	fetchOrderProbabilities,
	editOrderProbability
} from 'src/core/store/modules/order-probability/thunks'
import {
	getListOrderProbability,
	getListFiltersOrderProbability,
	getStatusOrderProbability,
	getErrorMessageOrderProbability
} from 'src/core/store/modules/order-probability/selectors'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListOrderProbability)
	const filters = useSelector(getListFiltersOrderProbability)

	useEffect(() => {
		dispatch(fetchOrderProbabilities({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'orderProbability',
		getStatus: getStatusOrderProbability,
		getErrorMessage: getErrorMessageOrderProbability,
		route: '',
		updateInListCallback: () => dispatch(fetchOrderProbabilities({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TOrderProbability) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderProbability({ ...row, isActive: !row.isActive }))
		if (type === 'orderProbability/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])


	const handleAccountFor = useCallback(async (row: TOrderProbability) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderProbability({ ...row, account: !row.account }))
		if (type === 'orderProbability/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TOrderProbability) => {
		dispatch(actions.orderProbability.setItem(row))
		history.push(`/configuracoes/provisao/probabilidade/${row.id}`)
	}, [dispatch, history])

	const punctuation = (item: TOrderProbability) => {
		return Number(item.isActive ?? 0) * 10000 - (item.orderById ?? 0)
	}

	const rows = useMemo(() => {
		const newList = list.slice()
		newList.sort((x, y) => {
			return punctuation(y) - punctuation(x)
		})
		return newList
	}, [list])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('provisions:orderProbability.id'), field: 'id' },
		{ label: t('provisions:orderProbability.title'), field: 'name' },
		{ label: t('provisions:orderProbability.orderById'), field: 'orderById' },
		{
			label: t('provisions:orderProbability.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleSwitchButton
		},
		{
			label: t('provisions:orderProbability.accountFor'),
			field: 'account',
			type: 'switch-button-yn',
			onChange: handleAccountFor
		}
	], [handleSwitchButton, handleAccountFor, t])

	return (
		<>
			<Panel title={t('provisions:orderProbability.listTitle')}>
				<TableComponent
					onEdit={handleEdit}
					columns={columns}
					rows={rows}
					isLoading={false}
				/>
			</Panel>
			<Pagination />
		</>
	)
};

export default List;