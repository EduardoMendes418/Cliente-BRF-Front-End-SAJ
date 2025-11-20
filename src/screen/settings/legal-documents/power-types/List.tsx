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
	getErrorMessageLegalDocPowerTypes as getErrorMessage,
	getListFiltersLegalDocPowerTypes,
	getListLegalDocPowerTypes,
	getLoadingLegalDocPowerTypes,
	getStatusLegalDocPowerTypes as getStatus,
} from 'src/core/store/modules/legal-document-power-types/selectors'
import { fetchLegalDocPowerTypes, editLegalDocPowerTypes } from 'src/core/store/modules/legal-document-power-types/thunks'
import { TLegalDocPowerType } from 'src/core/models/legal-document-power-types'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import Search from './Search'

export default function PowerTypesList() {
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { page, pageSize } = usePagination()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListLegalDocPowerTypes)
	const filters = useSelector(getListFiltersLegalDocPowerTypes)
	const isLoading = useSelector(getLoadingLegalDocPowerTypes)

	useEffect(() => {
		dispatch(fetchLegalDocPowerTypes({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	useRegisterDefault({
		action: 'legalDocPowerTypes',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchLegalDocPowerTypes({ ...filters, page, pageSize }))
	})

	const handleEdit = (row: TLegalDocPowerType) => {
		dispatch(actions.legalDocPowerTypes.setItem(row))
		history.push(`/configuracoes/documentos-legais/tipo-de-poderes/${row.id}`)
	}

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('legalDocs:powerTypes.field.powerTypes'), field: 'name' },
		{
			label: t('legalDocs:powerTypes.field.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: async (row: TLegalDocPowerType) => {
				if (!row.id) return
				const { type } = await dispatch(editLegalDocPowerTypes({ ...row, isActive: !row.isActive }))
				if (type.endsWith('/rejected'))
					enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
			}
		},
	], [dispatch, enqueueSnackbar])

	return (
		<ScreenTemplate slotTopRight>
			<Search />

			<Panel title={t('legalDocs:powerTypes.listTitle')}>
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