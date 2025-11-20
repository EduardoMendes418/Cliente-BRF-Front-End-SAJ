import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { fetchGuaranteeType, editGuaranteeType } from 'src/core/store/modules/guarantee-type/thunks'
import {
	getListGuaranteeType,
	getListFiltersGuaranteeType,
	getStatusGuaranteeType,
	getErrorMessageGuaranteeType
} from 'src/core/store/modules/guarantee-type/selectors'
import { TGuaranteeType } from 'src/core/models/guarantee-type'
import { actions, AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListGuaranteeType)
	const filters = useSelector(getListFiltersGuaranteeType)

	useEffect(() => {
		dispatch(fetchGuaranteeType({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'guaranteeType',
		getStatus: getStatusGuaranteeType,
		getErrorMessage: getErrorMessageGuaranteeType,
		route: '',
		updateInListCallback: () => dispatch(fetchGuaranteeType({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = useCallback(async (row: TGuaranteeType) => {
		if (!row.id) return
		const { type } = await dispatch(editGuaranteeType({ ...row, status: !row.status }))
		if (type === 'guaranteeType/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
	}, [dispatch, enqueueSnackbar, t])

	const handleEdit = useCallback((row: TGuaranteeType) => {
		dispatch(actions.paymentType.setItem(row))
		history.push(`/configuracoes/bens-e-garantias/tipo-de-garantia/${row.id}`)
	}, [dispatch, history])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('goodsAndGuarantees:guaranteeType.title'), field: 'description' },
		{
			label: t('goodsAndGuarantees:guaranteeType.status'),
			field: 'status',
			type: 'switch-button',
			onChange: handleSwitchButton
		},
	], [handleSwitchButton, t])

	const punctuation = (item: TGuaranteeType) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() => {
		return list.slice().sort((x, y) => {
			return punctuation(y) - punctuation(x) + x.description.localeCompare(y.description)
		})
	}, [list])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:guaranteeType.listtitle')}>
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
