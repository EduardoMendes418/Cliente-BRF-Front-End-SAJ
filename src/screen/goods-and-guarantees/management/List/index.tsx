import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory,  } from 'react-router-dom';

import { actions } from 'src/core/store';
import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import {
	getLoadingGoodsGuaranteesRequest,
	getFiltersGoodsGuaranteesRequest,
} from 'src/core/store/modules/goods-guarantee/selectors';
import { fetchGoodsGuaranteesRequestListSimplify } from 'src/core/store/modules/goods-guarantee/thunks';
import { usePagination } from 'src/hooks/pagination';

import ScreenTemplate from 'src/components/Screen';
import Search from './Search';
import List from './List';
import { rejectNoValues } from 'src/core/utils/func';
import {RECORD_TYPE} from "src/screen/goods-and-guarantees/constants"

const GoodsAndGuaranteesManagementList = () => {
	const dispatch = useDispatch();
	const { location: { pathname } } = useHistory();

	const { page, pageSize } = usePagination()
	const goodsGuaranteesFilters = useSelector(getFiltersGoodsGuaranteesRequest)

	const loading = useSelector(getLoadingGoodsGuaranteesRequest);

	useEffect(() => {
		const filters = goodsGuaranteesFilters[pathname] ?? {};
		const result = rejectNoValues({
			statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
			...filters,
			page,
			pageSize,
			recordType: RECORD_TYPE.EFFECTIVE
		});
		dispatch(fetchGoodsGuaranteesRequestListSimplify(result));
	}, [dispatch, page, pageSize, goodsGuaranteesFilters, pathname]);

	useEffect(() => {
		return () => { dispatch(actions.goodsGuaranteesRequest.clear()) }
	}, [dispatch]);

	return (
		<ScreenTemplate>
			<Search loading={loading} pathname={pathname} />
			<List loading={loading} />
		</ScreenTemplate>
	);
};

export default GoodsAndGuaranteesManagementList;
