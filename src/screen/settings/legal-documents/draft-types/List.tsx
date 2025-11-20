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
	getErrorMessageLegalDocDraftTypes as getErrorMessage,
	getListFiltersLegalDocDraftTypes,
	getListLegalDocDraftTypes,
	getLoadingLegalDocDraftTypes,
	getStatusLegalDocDraftTypes as getStatus,
} from 'src/core/store/modules/legal-document-draft-types/selectors'
import { fetchLegalDocDraftTypes, editLegalDocDraftTypes } from 'src/core/store/modules/legal-document-draft-types/thunks'
import { TLegalDocDraftType } from 'src/core/models/legal-document-draft-types'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './Search'
import { legalDocFormTypeDictionary } from '../utils/constants'

export default function CoverageList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocDraftTypes)
	const filters = useSelector(getListFiltersLegalDocDraftTypes)
	const isLoading = useSelector(getLoadingLegalDocDraftTypes)

	useEffect(() => {
		dispatch(fetchLegalDocDraftTypes({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocDraftTypes',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocDraftTypes({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDocDraftType) => {
		dispatch(actions.legalDocDraftTypes.setItem(row))
		history.push(`/configuracoes/documentos-legais/tipo-de-minuta/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('legalDocs:draftTypes.field.draftType'), field: 'name' },
		{
			label: t('legalDocs:draftTypes.field.formType'),
			field: 'legalDocumentFormType',
			type: 'custom',
			component: (row: TLegalDocDraftType) => (legalDocFormTypeDictionary as any)[row.legalDocumentFormType]
		},
		{
			label: t('legalDocs:draftTypes.field.block'),
			field: 'blocks',
			type: 'custom',
			component: (row: TLegalDocDraftType) => {
				const names = row.blocks.map(block => block.name)
				let blockNames = names.slice(0, 2).join(', ')
				if (names.length > 2) blockNames = `${blockNames}...`
				return blockNames
			}
		},
		{
			label: t('legalDocs:draftTypes.field.variables'),
			field: 'variables',
			type: 'custom',
			component: (row: TLegalDocDraftType) => {
				const names = row.variables.map(variable => variable.name)
				let variablesNames = names.slice(0, 4).join(', ')
				if (names.length > 4) variablesNames = `${variablesNames}...`
				return variablesNames
			}
		},
		{
			label: t('legalDocs:draftTypes.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDocDraftType) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocDraftTypes({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:draftTypes.listTitle')}>
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