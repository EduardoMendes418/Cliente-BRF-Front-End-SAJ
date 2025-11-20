import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from './List'
import Search from './Search'
import ScreenTemplate from 'src/components/Screen';

import { usePagination } from 'src/hooks/pagination';
import { fetchUsersList } from 'src/core/store/modules/users/thunks';
import {
	getListFiltersUsers,
	getStatusUsers as getStatus,
	getErrorMessageUsers as getErrorMessage,
} from 'src/core/store/modules/users/selectors';
import { useRegisterDefault } from 'src/hooks';

const Users = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersUsers)

	useRegisterDefault({
		action: 'users',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchUsersList({ page, pageSize, ...filters }))
	})

	useEffect(() => {
		dispatch(fetchUsersList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default Users;
