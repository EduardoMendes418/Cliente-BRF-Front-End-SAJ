import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { fetchReleaseType, editReleaseType } from 'src/core/store/modules/release-type/thunks'
import { getListReleaseType, getListFiltersReleaseType, getStatusReleaseType, getErrorMessageReleaseType } from 'src/core/store/modules/release-type/selectors'
import { TReleaseType } from 'src/core/models/release-type'
import { AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListReleaseType)
	const filters = useSelector(getListFiltersReleaseType)

	useEffect(() => {
		dispatch(fetchReleaseType({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'releaseType',
		getStatus: getStatusReleaseType,
		getErrorMessage: getErrorMessageReleaseType,
		route: '',
		updateInListCallback: () => dispatch(fetchReleaseType({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TReleaseType) => {
		if (!row.id) return
		const { type } = await dispatch(editReleaseType({ ...row, status: !row.status }))
		if (type === 'releaseType/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TReleaseType) => {
		history.push(`/configuracoes/bens-e-garantias/tipo-de-liberacao/${row.id}`)
	}, [history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('goodsAndGuarantees:releaseType.title'), field: 'description' },
		{
			label: t('goodsAndGuarantees:releaseType.status'),
			field: 'status',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleSwitchButton
		},
	], [handleSwitchButton, t])


	const punctuation = (item: TReleaseType) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() =>
		list.slice().sort((x, y) => punctuation(y) - punctuation(x) + (x.description?.localeCompare(y.description ?? "") ?? 0))
		, [list])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:releaseType.title')}>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={rows}
					isLoading={false}
				/>
			</Panel>
			<Pagination />
		</>
	)
}

export default List