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
import { TOrderRatingDescription } from 'src/core/models/order-rating-description'

import {
	fetchOrderRatingDescriptions,
	editOrderRatingDescription,
	fetchByNameOrderRatingDescription
} from 'src/core/store/modules/order-rating-description/thunks'
import {
	getListOrderRatingDescription, getListFiltersOrderRatingDescription,
	getStatusOrderRatingDescription,
	getErrorMessageOrderRatingDescription
} from 'src/core/store/modules/order-rating-description/selectors'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListOrderRatingDescription)
	const filters = useSelector(getListFiltersOrderRatingDescription)

	useEffect(() => {
		if (filters.partName)
			dispatch(fetchByNameOrderRatingDescription({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderRatingDescriptions({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'orderRatingDescription',
		getStatus: getStatusOrderRatingDescription,
		getErrorMessage: getErrorMessageOrderRatingDescription,
		route: '',
		updateInListCallback: () => dispatch(fetchOrderRatingDescriptions({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TOrderRatingDescription) => {
		if (!row.id) return
		const { type } = await dispatch(editOrderRatingDescription({ ...row, isActive: !row.isActive }))
		if (type === 'orderRatingDescription/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });

	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TOrderRatingDescription) => {
		dispatch(actions.paymentType.setItem(row))
		history.push(`/configuracoes/provisao/abertura-descricao/${row.id}`)
	}, [dispatch, history])

	const calcPunctuation = (item: TOrderRatingDescription) =>
		Number(item.isActive ?? 0) * 10000 - (item.orderById ?? 0)

	const rows = useMemo(() => {
		const newList = list.slice()
		newList.sort((x, y) => calcPunctuation(y) - calcPunctuation(x))
		return newList
	}, [list])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('provisions:orderRatingDescription.id'), field: 'id' },
		{ label: t('provisions:orderRatingDescription.title'), field: 'name' },
		{ label: t('provisions:orderRatingDescription.orderById'), field: 'orderById' },
		{
			label: t('provisions:orderRatingDescription.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleSwitchButton
		}
	], [handleSwitchButton, t])

	return (
		<>
			<Panel title={t('provisions:orderRatingDescription.listTitle')}>
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