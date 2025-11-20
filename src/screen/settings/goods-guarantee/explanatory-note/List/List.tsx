import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { fetchExplanatoryNote, editExplanatoryNote } from 'src/core/store/modules/explanatory-note/thunks'
import { getErrorMessageExplanatoryNote, getListExplanatoryNote, getListFiltersExplanatoryNote, getStatusExplanatoryNote } from 'src/core/store/modules/explanatory-note/selectors'
import { TExplanatoryNote } from 'src/core/models/explanatory-note'
import { AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListExplanatoryNote)
	const filters = useSelector(getListFiltersExplanatoryNote)

	useEffect(() => {
		dispatch(fetchExplanatoryNote({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'explanatoryNote',
		getStatus: getStatusExplanatoryNote,
		getErrorMessage: getErrorMessageExplanatoryNote,
		route: '',
		updateInListCallback: () => dispatch(fetchExplanatoryNote({ ...filters, page, pageSize }))
	})

	const handleSwitchButton = async (row: TExplanatoryNote) => {
		if (!row.id) return
		const { type } = await dispatch(editExplanatoryNote({ ...row, status: !row.status }))
		if (type === 'explanatoryNote/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}

	const handleEdit = (row: TExplanatoryNote) => {
		history.push(`/configuracoes/bens-e-garantias/nota-explicativa/${row.id}`)
	}

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:explanatoryNote.id'), field: 'id' },
		{ label: t('goodsAndGuarantees:explanatoryNote.title'), field: 'description' },
		{ label: t('goodsAndGuarantees:explanatoryNote.reference'), field: 'reference' },
		{
			label: t('goodsAndGuarantees:explanatoryNote.status'),
			field: 'status',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleSwitchButton
		},
	]

	const punctuation = (item: TExplanatoryNote) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() => {
		return list.slice().sort((x, y) => {
			return punctuation(y) - punctuation(x) + (x.description?.localeCompare(y.description ?? "") ?? 0)
		})
	}, [list])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:explanatoryNote.title')}>
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
