import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';

import { usePagination } from 'src/hooks/pagination';
import { fetchCivilMassList } from 'src/core/store/modules/civil-mass/thunks';
import {
	getListFiltersCivilMass,
	getStatusCivilMass as getStatus,
	getErrorMessageCivilMass as getErrorMessage,
} from 'src/core/store/modules/civil-mass/selectors';
import { useRegisterDefault } from 'src/hooks';

import List from './List'
import Search from './Search'

const CivilMass = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersCivilMass);

	useRegisterDefault({
		action: 'civilMass',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchCivilMassList({ page, pageSize, ...filters }))
	});

	useEffect(() => {
		dispatch(fetchCivilMassList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default CivilMass;
