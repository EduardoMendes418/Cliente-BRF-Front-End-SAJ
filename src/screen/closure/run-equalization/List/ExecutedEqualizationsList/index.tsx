import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';

import { getPagination } from 'src/core/store/modules/pagination/selectors';
import { getListFiltersEqualization } from 'src/core/store/modules/equalization/selectors';
import { fetchEqualizationList } from 'src/core/store/modules/equalization/thunks';
import { getSavingEqualizationParameters } from 'src/core/store/modules/equalization-parameters/selectors';

import List from './List'
import Search from './Search'

const ExecutedEqualizationsList = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = useSelector(getPagination);

	const filters = useSelector(getListFiltersEqualization);
	const isRunningEqualization = useSelector(getSavingEqualizationParameters);

	useEffect(() => {
		if (isRunningEqualization) return;
		dispatch(fetchEqualizationList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters, isRunningEqualization])

	return (
		<Box display='flex' flexDirection='column' marginTop={3}>
			<Search />
			<List />
		</Box>
	);
}

export default ExecutedEqualizationsList;
