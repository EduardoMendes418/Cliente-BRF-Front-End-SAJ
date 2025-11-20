import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import { AppDispatch } from 'src/core/store'
import { getConfrontingOrdersFilters, getConfrontingOrdersList, getConfrontingOrdersTableList } from 'src/core/store/modules/confronting-orders/selectors'
import { getStatusesAsOptions } from 'src/core/store/modules/process/selectors'
import { setStatusConfrontingOrders } from 'src/core/store/modules/confronting-orders/thunks'
import {
	setFilters,
	setTableList,
	selectAll,
	selectRow,
	startTableLoading,
} from 'src/core/store/modules/confronting-orders'
import { t } from 'src/locale/i18n'

import groupConfrontingOrderRatingByDescription from '../utils/groupConfrontingOrderRatingByDescription'

export default function useManageList() {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()

	const list = useSelector(getConfrontingOrdersList)
	const tableList = useSelector(getConfrontingOrdersTableList)
	const processStatusOptions = useSelector(getStatusesAsOptions)
	const filters = useSelector(getConfrontingOrdersFilters)

	const processStatusDictionary = useMemo(
		() => processStatusOptions.reduce((acc, item) => {
			(acc as any)[item.value] = item.label
			return acc
		}, {} as Record<number, string>),
		[processStatusOptions]
	)

	const { rows, dynamicColumns, totalLoadingRows } = useMemo(() => {
		const { rows, dynamicColumns } = groupConfrontingOrderRatingByDescription(list)
		return {
			rows: rows.map(row => ({
				...row,
				statusProcessoName: processStatusDictionary[row.statusProcess],
				// indicate table's checkbox state
				check: false,
			})),
			dynamicColumns,
			totalLoadingRows: rows.length === 0 ? 1 : rows.length
		}
	}, [list, processStatusDictionary])

	useEffect(() => {
		dispatch(setTableList(rows))
	}, [dispatch, rows])

	const handleSelect = (id: number) => dispatch(selectRow(id))

	const handleSelectAll = (checked: boolean) => dispatch(selectAll(checked))

	const handleSingleRowAssessment = async (assessmentStatus: boolean, reason: string, id: number) => {
		dispatch(startTableLoading())

		const { meta, payload } = await dispatch(setStatusConfrontingOrders({
			status: assessmentStatus,
			ids: [id],
			reason
		}))

		if (meta.requestStatus === 'rejected')
			enqueueSnackbar(payload?.detail ?? t('anErrorHasOcurred'), { variant: 'error' })

		dispatch(setFilters({ ...filters }))
	}

	const handleMultipleRowAssessment = async (assessmentStatus: boolean, reason: string) => {
		dispatch(startTableLoading())

		const ids = tableList.filter(row => row.check).map(item => item.id)
		const { meta, payload } = await dispatch(setStatusConfrontingOrders({ status: assessmentStatus, ids, reason }))

		if (meta.requestStatus === 'rejected')
			enqueueSnackbar(payload?.detail ?? t('anErrorHasOcurred'), { variant: 'error' })

		dispatch(setFilters({ ...filters }))
		handleSelectAll(false)
	}

	return {
		rows: tableList,
		totalLoadingRows,
		dynamicColumns,
		handleSelect,
		handleSelectAll,
		handleSingleRowAssessment,
		handleMultipleRowAssessment,
	}
}
