import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AddNewButton from 'src/components/button/AddNew';

import ScreenTemplate from 'src/components/Screen';
import {
	getLoadingGuaranteeAccountability,
	getFiltersGuaranteeAccountability,
} from 'src/core/store/modules/guarantee-accountability/selectors';
import { fetchGuaranteeAccountabilityGrid } from 'src/core/store/modules/guarantee-accountability/thunks';
import { usePagination } from 'src/hooks/pagination';
import { getAccountabilityArray } from 'src/core/store/modules/guarantee-accountability/selectors';


import Search from './Search';
import List from './List';
import { ButtonDiv } from './styled';

const GuaranteeAccountability = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation()

	const { page, pageSize } = usePagination()
	const isEvaluation = pathname.includes("prestacao-de-contas-avaliacao")
	const accontabilityArray = useSelector(getAccountabilityArray);

	const accountabilityFilters = useSelector(getFiltersGuaranteeAccountability)
	const loading = useSelector(getLoadingGuaranteeAccountability);

	useEffect(() => {
		const filters = accountabilityFilters[pathname] ?? {};
		dispatch(fetchGuaranteeAccountabilityGrid({
			page,
			pageSize,
			...filters,
		}));
	}, [dispatch, page, pageSize, accountabilityFilters, pathname]);

	return (
		<ScreenTemplate slotTopRight>
			{isEvaluation && accontabilityArray.length !== 0 && (
				<ButtonDiv>
					<AddNewButton to={"/bens-e-garantias/prestacao-de-contas-avaliacao/multipla"} showIcon>
						Avaliação
					</AddNewButton>
				</ButtonDiv>
			)}
			<Search loading={loading} pathname={pathname} />
			<List loading={loading} />
		</ScreenTemplate>
	);
};

export default GuaranteeAccountability;
