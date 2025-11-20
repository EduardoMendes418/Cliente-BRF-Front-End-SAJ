import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePagination } from 'src/hooks/pagination'

import {  fetchInterestUpdate } from 'src/core/store/modules/interest-update/thunks'

import ScreenTemplate from 'src/components/Screen'
import {
	getListFiltersInterestUpdate,
} from 'src/core/store/modules/interest-update/selectors'
import Search from './Search';
import List from './List';

const DepositUpdate = () => {
	const { page, pageSize } = usePagination()
	const dispatch = useDispatch()
	const filters = useSelector(getListFiltersInterestUpdate)


	useEffect(() => {
		dispatch(fetchInterestUpdate({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default DepositUpdate
