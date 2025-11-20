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
	getErrorMessageLegalDocReqStatus as getErrorMessage,
	getListFiltersLegalDocReqStatus,
	getListLegalDocReqStatus,
	getLoadingLegalDocReqStatus,
	getStatusLegalDocReqStatus as getStatus,
} from 'src/core/store/modules/legal-document-request-status/selectors'
import { fetchLegalDocReqStatus, editLegalDocReqStatus } from 'src/core/store/modules/legal-document-request-status/thunks'
import { TLegalDocReqStatus } from 'src/core/models/legal-document-request-status'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './Search'

export default function StatusList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocReqStatus)
	const filters = useSelector(getListFiltersLegalDocReqStatus)
	const isLoading = useSelector(getLoadingLegalDocReqStatus)

	useEffect(() => {
		dispatch(fetchLegalDocReqStatus({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocReqStatus',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocReqStatus({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDocReqStatus) => {
		dispatch(actions.legalDocReqStatus.setItem(row))
		history.push(`/configuracoes/documentos-legais/status/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('legalDocs:status.field.status'), field: 'name' },
		{
			label: t('legalDocs:status.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDocReqStatus) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocReqStatus({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:status.listTitle')}>
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