import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';

import { usePagination } from 'src/hooks/pagination';
import { useRegisterDefault } from 'src/hooks';
import { fetchEconomicIndices } from 'src/core/store/modules/economic-indices/thunks';
import {
	getListFiltersEconomicIndices,
	getStatusEconomicIndices as getStatus,
	getErrorMessageEconomicIndices as getErrorMessage,
} from 'src/core/store/modules/economic-indices/selectors';

import List from './List'
import Search from './Search'

const EconomicIndices = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersEconomicIndices)

	useRegisterDefault({
		action: 'economicIndices',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchEconomicIndices({ page, pageSize, ...filters }))
	})

	useEffect(() => {
		dispatch(fetchEconomicIndices({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default EconomicIndices;
