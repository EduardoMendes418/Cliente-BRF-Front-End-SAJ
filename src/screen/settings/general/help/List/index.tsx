import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { usePagination } from 'src/hooks/pagination';
import { useRegisterDefault } from 'src/hooks';

import {
	getStatusRejectionAndReturnReason as getStatus,
	getErrorMessageRejectionAndReturnReason as getErrorMessage,
} from 'src/core/store/modules/rejection-and-return-reason/selectors';

import List from './List'
import Search from './Search'
import { getListFiltersHelpFiles } from 'src/core/store/modules/HelpFiles/selectors';
import { fetchHelpFiles } from 'src/core/store/modules/HelpFiles/thunks';

const HelpList = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersHelpFiles);

	useRegisterDefault({
		action: 'helpFiles',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchHelpFiles({ page, pageSize, ...filters }))
	});

	useEffect(() => {
		dispatch(fetchHelpFiles({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default HelpList;
