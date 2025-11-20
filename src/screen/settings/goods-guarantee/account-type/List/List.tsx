import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { fetchAccountType, editAccountType } from 'src/core/store/modules/account-type/thunks'
import { getErrorMessageAccountType, getListAccountType, getListFiltersAccountType, getStatusAccountType } from 'src/core/store/modules/account-type/selectors'
import { TAccountType } from 'src/core/models/account-type'
import { AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListAccountType)
	const filters = useSelector(getListFiltersAccountType)

	useEffect(() => {
		dispatch(fetchAccountType({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'accountType',
		getStatus: getStatusAccountType,
		getErrorMessage: getErrorMessageAccountType,
		route: '',
		updateInListCallback: () => dispatch(fetchAccountType({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TAccountType) => {
		if (!row.id) return
		const { type } = await dispatch(editAccountType({ ...row, status: !row.status }))
		if (type === 'accountType/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TAccountType) => {
		history.push(`/configuracoes/bens-e-garantias/tipo-de-conta/${row.id}`)
	}, [history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:accountType.id'), field: 'id' },
		{ label: t('goodsAndGuarantees:accountType.title'), field: 'description' },
		{
			label: t('goodsAndGuarantees:accountType.status'),
			field: 'status',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleSwitchButton
		},
	], [handleSwitchButton, t])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:accountType.title')}>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={list}
					isLoading={false}
				/>
			</Panel>
			<Pagination />
		</>
	)
}

export default List