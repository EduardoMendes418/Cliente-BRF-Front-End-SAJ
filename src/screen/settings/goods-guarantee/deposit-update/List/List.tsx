import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { useTranslation } from 'src/locale/i18n'
import { editInterestUpdate, fetchInterestUpdate } from 'src/core/store/modules/interest-update/thunks'
import {
	getListInterestUpdate,
	getListFiltersInterestUpdate,
	getErrorMessageInterestUpdate,
	getStatusInterestUpdate,
	getLoadingInterestUpdate
} from 'src/core/store/modules/interest-update/selectors'
import { TInterestUpdate } from 'src/core/models/interest-update'
import { actions, AppDispatch } from 'src/core/store'
import { useRegisterDefault } from 'src/hooks'
import { DEPOSIT_STATUS } from '../constants'
import { useAreasWitchGroups } from 'src/hooks/fetchLists'

const List = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const history = useHistory()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getListInterestUpdate)
	const isLoading = useSelector(getLoadingInterestUpdate)
	const filters = useSelector(getListFiltersInterestUpdate)

	const { areas } = useAreasWitchGroups()

	useRegisterDefault({
		action: 'interestUpdate',
		getStatus: getStatusInterestUpdate,
		getErrorMessage: getErrorMessageInterestUpdate,
		route: '',
		updateInListCallback: () => dispatch(fetchInterestUpdate({ ...filters, page: 1, pageSize: 20 }))
	})


	const handleEdit = useCallback((row: TInterestUpdate) => {
		dispatch(actions.paymentType.setItem(row))
		history.push(`/configuracoes/bens-e-garantias/atualizacao-de-depositos/${row.id}`)
	}, [dispatch, history])

	const handleSwitchButton = useCallback(async (row: TInterestUpdate) => {
		if (!row.id) return
		const { type, payload } = await dispatch(editInterestUpdate({ ...row, status: !row.status }))

		if ('error' in payload)
			enqueueSnackbar(payload.error, { variant: 'error' })

		if (type === 'guaranteeType/edit/rejected')
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })

	}, [dispatch, enqueueSnackbar, t])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:depositUpdate.id'), field: 'id'},
		{ label: t('goodsAndGuarantees:depositUpdate.maintenanceDate'), field: 'updatedDate', type: 'date'},
		{ label: t('goodsAndGuarantees:depositUpdate.name'), field: 'createdBy'? 'createdBy':'updatedBy' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldClosure'), field: 'closureName' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldAreaDejur'), field: 'legalDepartmentAreaName' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldAccountType'), field: 'paymentTypeDescription' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldBank'), field: 'bankName' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldDepositStatus'), field: 'statusDep' },
		{ label: t('goodsAndGuarantees:depositUpdate.columnPaymentFrom'), field: 'paymentDateStart', type: 'date' },
		{ label: t('goodsAndGuarantees:depositUpdate.columnPaymentTo'), field: 'paymentDateEnd', type: 'date' },
		{ label: t('goodsAndGuarantees:depositUpdate.updateMethod'), field: 'currectionFormulaName'},
		{
			label: t('goodsAndGuarantees:depositUpdate.columnStatus'),
			field: 'status',
			type: 'switch-button',
			onChange: handleSwitchButton
		}
	], [handleSwitchButton, t])

	const rows = useMemo(() => list.map((item) => {
		const legalDepartmentArea = areas.find(x => x.id === item.legalDepartmentAreaId);

		return {
			...item,
			legalDepartmentAreaName: legalDepartmentArea?.path ?? "",
			statusDep: item.depositStatus === DEPOSIT_STATUS.ACTIVE ? 'Ativo' : 'Inativo'
		}
	}), [areas, list])

	return (
		<>
			<Panel title={t('goodsAndGuarantees:depositUpdate.listTitle')}>
				<Table
					onEdit={handleEdit}
					columns={columns}
					rows={rows}
					isLoading={isLoading}
				/>
			</Panel>
			<Pagination />
		</>
	)
}

export default List
