import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getPagination } from 'src/core/store/modules/pagination/selectors';
import { fetchEqualizationParametersList } from 'src/core/store/modules/equalization-parameters/thunks';
import { getListFiltersEqualizationParameters } from 'src/core/store/modules/equalization-parameters/selectors';

import List from './List'
import Search from './Search'

const EqualizationParametersList = () => {
	const dispatch = useDispatch()
	const { pageSize } = useSelector(getPagination);
	const { location: { pathname } } = useHistory();

	const equalizationParameterFilters = useSelector(getListFiltersEqualizationParameters);

	useEffect(() => {
		const filters = equalizationParameterFilters[pathname] ?? {};
		dispatch(fetchEqualizationParametersList({ pageSize, notPaginate: true, ...filters, isActive: true }));
	}, [dispatch, pageSize, equalizationParameterFilters, pathname])

	return (
		<>
			<Search pathname={pathname} />
			<List pathname={pathname} />
		</>
	);
}

export default EqualizationParametersList;
