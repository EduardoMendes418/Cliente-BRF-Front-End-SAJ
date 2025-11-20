import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { t } from 'src/locale/i18n';
import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import {
	getLoadingGoodsGuaranteesRequest,
	getFiltersGoodsGuaranteesRequest,
} from 'src/core/store/modules/goods-guarantee/selectors';
import { fetchGoodsGuaranteesRequestList } from 'src/core/store/modules/goods-guarantee/thunks';
import { usePagination } from 'src/hooks/pagination';

import List from './List';
import Search from './Search';
import ScreenTemplate from 'src/components/Screen';
import { rejectNoValues } from 'src/core/utils/func';
import { getDataCurrentUser } from 'src/core/store/modules/currentUser/selectors';

const GoodsAndGuaranteesRequestList = () => {
	const dispatch = useDispatch();
	const { location: { pathname } } = useHistory();

	const inFlow = pathname.includes('fluxo');
	const isSolicitacao = pathname.includes('solicitacao');
	const isApprovalLegalControl = pathname.startsWith('/bens-e-garantias/avaliacao-controle-juridico');
	const isApprovalInternalLawyer = pathname.startsWith('/bens-e-garantias/avaliacao-advogado-interno');

	const { page, pageSize } = usePagination();
	const { idBrf } = useSelector(getDataCurrentUser);
	const loading = useSelector(getLoadingGoodsGuaranteesRequest);
	const goodsGuaranteesFilters = useSelector(getFiltersGoodsGuaranteesRequest);

	useEffect(() => {
		if (!idBrf) return;

		const getStatusFlow = () => {
			if (isApprovalLegalControl) return 3
			if (isApprovalInternalLawyer) return 4
			return undefined
		}

		const getStatusApprovalId = () => {
			if (isSolicitacao) return undefined
			if (inFlow) return STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
			return -1
		}

		const defaultParams = {
			page,
			pageSize,
			statusFlowId: getStatusFlow(),
			statusApprovalId: getStatusApprovalId(),
			typeFlows: [1, 2, 3],
			internalLawyer: isApprovalInternalLawyer ? idBrf : "",
		};

		if (!goodsGuaranteesFilters[pathname]) {
			dispatch(fetchGoodsGuaranteesRequestList(rejectNoValues(defaultParams)));
		} else {
			const filters = goodsGuaranteesFilters[pathname];

			let result = rejectNoValues({
				...defaultParams,
				...filters,
			});
			
			if (filters.statusFlowId && filters.typeFlows) 
				result = { ...result, statusFlowId: filters.statusFlowId, typeFlows: [Number(filters.typeFlows)] };

			dispatch(fetchGoodsGuaranteesRequestList({ ...result }));
		}
	}, [dispatch, idBrf, page, pageSize, goodsGuaranteesFilters, inFlow, pathname, isApprovalInternalLawyer, isApprovalLegalControl, isSolicitacao]);

	return (
		<ScreenTemplate slotTopRight={!inFlow && t('goodsAndGuarantees:buttonNew')}>
			<Search 
				loading={loading} 
				pathname={pathname} 
			/>
			<List
				loading={loading}
				inFlow={inFlow}
				isApprovalLegalControl={isApprovalLegalControl}
				isApprovalInternalLawyer={isApprovalInternalLawyer}
			/>
		</ScreenTemplate>
	);
};

export default GoodsAndGuaranteesRequestList;
