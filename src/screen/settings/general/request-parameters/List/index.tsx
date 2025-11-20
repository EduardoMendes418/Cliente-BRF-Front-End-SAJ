import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from './List'
import Search from './Search'
import ScreenTemplate from 'src/components/Screen';
import { usePagination } from 'src/hooks/pagination';
import { fetchRequestParameters } from 'src/core/store/modules/request-parameters/thunks';
import {
	getListFiltersRequestParameters,
	getStatusRequestParameters as getStatus,
	getErrorMessageRequestParameters as getErrorMessage,
} from 'src/core/store/modules/request-parameters/selectors';
import { useRegisterDefault } from 'src/hooks';

const RequestParameters = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersRequestParameters);

	useRegisterDefault({
		action: 'requestParameters',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchRequestParameters({ page, pageSize, ...filters }))
	})

	useEffect(() => {
		dispatch(fetchRequestParameters({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default RequestParameters;
