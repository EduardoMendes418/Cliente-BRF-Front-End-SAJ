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
	getErrorMessageLegalDocReqTypes as getErrorMessage,
	getListFiltersLegalDocReqTypes,
	getListLegalDocReqTypes,
	getLoadingLegalDocReqTypes,
	getStatusLegalDocReqTypes as getStatus,
} from 'src/core/store/modules/legal-document-request-types/selectors'
import { fetchLegalDocReqTypes, editLegalDocReqTypes } from 'src/core/store/modules/legal-document-request-types/thunks'
import { TLegalDocRequestType } from 'src/core/models/legal-document-request-types'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './components/Search'
import { legalDocFormTypeDictionary } from '../utils/constants'

export default function CoverageList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocReqTypes)
	const filters = useSelector(getListFiltersLegalDocReqTypes)
	const isLoading = useSelector(getLoadingLegalDocReqTypes)

	useEffect(() => {
		dispatch(fetchLegalDocReqTypes({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocReqTypes',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocReqTypes({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDocRequestType) => {
		dispatch(actions.legalDocReqTypes.setItem(row))
		history.push(`/configuracoes/documentos-legais/tipo-de-solicitacao/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{
			label: t('legalDocs:requestTypes.field.requestType'),
			field: 'name',
		},
		{
			label: t('legalDocs:requestTypes.field.form'),
			field: 'name',
			type: 'custom',
			component: (row: TLegalDocRequestType) => (legalDocFormTypeDictionary as any)[row.formType]
		},
		{
			label: t('legalDocs:requestTypes.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDocRequestType) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocReqTypes({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:requestTypes.listTitle')}>
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
