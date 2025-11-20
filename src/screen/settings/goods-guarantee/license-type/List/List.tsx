import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { fetchLicenseType, editLicenseType } from 'src/core/store/modules/license-type/thunks'
import {
	getListLicenseType,
	getListFiltersLicenseType,
	getErrorMessageLicenseType,
	getStatusLicenseType
} from 'src/core/store/modules/license-type/selectors'
import { TLicenseType } from 'src/core/models/license-type'
import { actions, AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLicenseType)
	const filters = useSelector(getListFiltersLicenseType)

	useRegisterDefault({
		action: 'licenseType',
		getStatus: getStatusLicenseType,
		getErrorMessage: getErrorMessageLicenseType,
		route: '',
		updateInListCallback: () => dispatch(fetchLicenseType({ ...filters, page, pageSize }))
	})

	useEffect(() => {
		dispatch(fetchLicenseType({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	const handleSwitchButton = useCallback(async (row: TLicenseType) => {
		if (!row.id) return
		const { type } = await dispatch(editLicenseType({ ...row, status: !row.status }))
		if (type === 'licenseType/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TLicenseType) => {
		dispatch(actions.paymentType.setItem(row))
		history.push(`/configuracoes/bens-e-garantias/tipo-de-alvara/${row.id}`)
	}, [dispatch, history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('goodsAndGuarantees:licenseType.title'), field: 'description' },
		{
			label: t('goodsAndGuarantees:licenseType.fieldStatus'),
			field: 'status',
			type: 'switch-button',
			onChange: handleSwitchButton
		},
	], [handleSwitchButton, t])

	const punctuation = (item: TLicenseType) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() => {
		return list.slice().sort((x, y) => {
			return punctuation(y) - punctuation(x) + x.description.localeCompare(y.description)
		})
	}, [list])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:licenseType.listTitle')}>
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
