import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { usePagination } from 'src/hooks/pagination';
import { useRegisterDefault } from 'src/hooks';

import {
	getListFiltersRejectionAndReturnReason,
	getStatusRejectionAndReturnReason as getStatus,
	getErrorMessageRejectionAndReturnReason as getErrorMessage,
} from 'src/core/store/modules/rejection-and-return-reason/selectors';
import { fetchRejectionAndReturnReasonList } from 'src/core/store/modules/rejection-and-return-reason/thunks';

import List from './List'
import Search from './Search'

const EvaluationReason = () => {
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersRejectionAndReturnReason);

	useRegisterDefault({
		action: 'rejectionAndReturnReason',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchRejectionAndReturnReasonList({ page, pageSize, ...filters }))
	});

	useEffect(() => {
		dispatch(fetchRejectionAndReturnReasonList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default EvaluationReason;
