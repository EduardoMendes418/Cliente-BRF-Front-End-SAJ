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
	getErrorMessageLegalDocServiceOpinions as getErrorMessage,
	getListFiltersLegalDocServiceOpinions,
	getListLegalDocServiceOpinions,
	getLoadingLegalDocServiceOpinions,
	getStatusLegalDocServiceOpinions as getStatus,
} from 'src/core/store/modules/legal-document-service-opinions/selectors'
import { fetchLegalDocServiceOpinions, editLegalDocServiceOpinions } from 'src/core/store/modules/legal-document-service-opinions/thunks'
import { TLegalDocServiceOpinion } from 'src/core/models/legal-document-service-opinions'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './Search'

export default function ServiceOpinionsList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocServiceOpinions)
	const filters = useSelector(getListFiltersLegalDocServiceOpinions)
	const isLoading = useSelector(getLoadingLegalDocServiceOpinions)

	useEffect(() => {
		dispatch(fetchLegalDocServiceOpinions({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocServiceOpinions',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocServiceOpinions({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDocServiceOpinion) => {
		dispatch(actions.legalDocServiceOpinions.setItem(row))
		history.push(`/configuracoes/documentos-legais/parecer-do-atendimento/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('legalDocs:serviceOpinion.field.serviceOpinion'), field: 'name' },
		{
			label: t('legalDocs:serviceOpinion.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDocServiceOpinion) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocServiceOpinions({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:serviceOpinion.listTitle')}>
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