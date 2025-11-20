import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from './List'
import Search from './Search'
import ScreenTemplate from 'src/components/Screen';

import { usePagination } from 'src/hooks/pagination';
import { fetchProfiles } from 'src/core/store/modules/profiles/thunks';
import {
	getListFiltersProfiles,
	getStatusProfiles as getStatus,
	getErrorMessageProfiles as getErrorMessage
} from 'src/core/store/modules/profiles/selectors';
import { useRegisterDefault } from 'src/hooks';

const Profile = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersProfiles);

	useRegisterDefault({
		action: 'profiles',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchProfiles({ page, pageSize, ...filters }))
	});

	useEffect(() => {
		dispatch(fetchProfiles({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default Profile;
