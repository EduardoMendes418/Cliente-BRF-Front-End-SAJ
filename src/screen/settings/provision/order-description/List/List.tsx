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

import {
	fetchOrderDescriptions,
	editOrderDescription,
	fetchByNameOrderDescription
} from 'src/core/store/modules/order-description/thunks'
import {
	getListOrderDescription,
	getListFiltersOrderDescription,
} from 'src/core/store/modules/order-description/selectors'

import { TOrderDescription } from "src/core/models/order-description";

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListOrderDescription)
	const filters = useSelector(getListFiltersOrderDescription)


	useEffect(() => {
		if (filters.partName)
			dispatch(fetchByNameOrderDescription({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderDescriptions({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	const handleSwitchIsActive = useCallback(async (row: TOrderDescription) => {
		if (!row.id) return
		const { meta, payload } = await dispatch(editOrderDescription({ ...row, isActive: !row.isActive }))
		if (meta.requestStatus === "rejected")
			enqueueSnackbar(payload.error.detail ?? t('anErrorHasOcurred'), { variant: 'error' });


		if (filters.partName)
			dispatch(fetchByNameOrderDescription({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderDescriptions({ ...filters, page, pageSize }))
	}, [dispatch, enqueueSnackbar, filters, page, pageSize, t])

	const handleSwitchSumProvision = useCallback(async (row: TOrderDescription) => {
		if (!row.id) return
		const { meta, payload } = await dispatch(editOrderDescription({ ...row, sumProvision: !row.sumProvision }))
		if (meta.requestStatus === "rejected")
			enqueueSnackbar(payload.error.detail ?? t('anErrorHasOcurred'), { variant: 'error' });


		if (filters.partName)
			dispatch(fetchByNameOrderDescription({ ...filters, page, pageSize }))
		else
			dispatch(fetchOrderDescriptions({ ...filters, page, pageSize }))
	}, [dispatch, enqueueSnackbar, filters, page, pageSize, t])

	const handleEdit = useCallback((row: TOrderDescription) => {
		dispatch(actions.orderDescription.setItem(row))
		history.push(`/configuracoes/provisao/ordem-descricao/${row.id}`)
	}, [dispatch, history])

	const rows = useMemo(() => list.map((item) => ({
		...item,
		dejurArea: item.area?.path,
		name: item.name
	})), [list]);

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('provisions:orderDescription.id'), field: 'id' },
		{ label: t('provisions:orderDescription.areaDejur'), field: 'dejurArea' },
		{ label: t('provisions:orderDescription.title'), field: 'name' },
		{
			label: t("provisions:orderDescription.sumProvision"),
			field: "sumProvision",
			type: "switch-button-yn",
			onChange: handleSwitchSumProvision
		},
		{
			label: t('provisions:orderDescription.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleSwitchIsActive
		}
	], [handleSwitchIsActive, handleSwitchSumProvision, t])

	return (
		<>
			<Panel title={t('provisions:orderDescription.listTitle')}>
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
