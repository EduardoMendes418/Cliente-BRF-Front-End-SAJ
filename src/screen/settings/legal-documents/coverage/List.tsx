import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import ScreenTemplate from 'src/components/Screen'
import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { usePagination } from 'src/hooks/pagination'
import { useRegisterDefault } from 'src/hooks'
import {
	getErrorMessageLegalDocCoverage as getErrorMessage,
	getListFiltersLegalDocCoverage,
	getListLegalDocCoverage,
	getLoadingLegalDocCoverage,
	getStatusLegalDocCoverage as getStatus,
} from 'src/core/store/modules/legal-document-coverages/selectors'
import { fetchLegalDocCoverage, editLegalDocCoverage } from 'src/core/store/modules/legal-document-coverages/thunks'
import { TLegalDoc } from 'src/core/models/legal-document-coverages'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './Search'

export default function CoverageList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocCoverage)
	const filters = useSelector(getListFiltersLegalDocCoverage)
	const isLoading = useSelector(getLoadingLegalDocCoverage)

	useEffect(() => {
		dispatch(fetchLegalDocCoverage({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocCoverage',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocCoverage({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDoc) => {
		dispatch(actions.legalDocCoverage.setItem(row))
		history.push(`/configuracoes/documentos-legais/abrangencia/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('legalDocs:coverage.field.coverage'), field: 'name' },
		{
			label: t('legalDocs:coverage.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDoc) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocCoverage({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:coverage.listTitle')}>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={list}
					isLoading={isLoading}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	)
}