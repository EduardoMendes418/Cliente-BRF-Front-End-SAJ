import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { useRegisterDefault } from "src/hooks";

import { fetchBusinessCombinationAccountingList } from 'src/core/store/modules/business-combination-accounting/thunks';
import { actions } from 'src/core/store';
import { getLoadingBusinessCombinationAccounting, getErrorMessageBusinessCombinationAccounting } from 'src/core/store/modules/business-combination-accounting/selectors';
import { usePagination } from 'src/hooks/pagination';
import Search from './Search';
import List from './List'

const BusinessCombination = () => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination()

	const fetchList = useCallback(() => {
		dispatch(fetchBusinessCombinationAccountingList({ page, pageSize }))
	}, [dispatch, page, pageSize]);

	useEffect(() => () => dispatch(actions.businessCombinationAccounting.clear()), [dispatch]);

	useEffect(() => {
		fetchList()
	}, [fetchList]);

	useRegisterDefault({
		action: 'businessCombinationAccounting',
		getStatus: getLoadingBusinessCombinationAccounting,
		getErrorMessage: getErrorMessageBusinessCombinationAccounting,
		route: 'noRedirect',
		updateInListCallback: () => fetchList()
	});

	return (
		<ScreenTemplate>
			<Search fetchList={fetchList} />
			<List />
		</ScreenTemplate>
	)
};

export default BusinessCombination;
