import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { getListFiltersFormulaCorrectionRule } from 'src/core/store/modules/formula-correction-rule/selectors';
import { fetchFormulaCorrectionRuleList } from 'src/core/store/modules/formula-correction-rule/thunks';
import {
	getStatusFormulaCorrectionRule as getStatus,
	getErrorMessageFormulaCorrectionRule as getErrorMessage,
} from 'src/core/store/modules/formula-correction-rule/selectors';
import { usePagination } from 'src/hooks/pagination';
import { useRegisterDefault } from 'src/hooks';

import List from './List';
import Search from './Search';

const FormulaCorrectionRule = () => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersFormulaCorrectionRule);
	

	useRegisterDefault({
		action: 'formulaCorrectionRule',
		getStatus,
		getErrorMessage,
		route: 'noRedirect',
		updateInListCallback() {
			dispatch(fetchFormulaCorrectionRuleList({ page, pageSize, isPage: true, ...filters }));
		},
	});

	useEffect(() => {
		dispatch(fetchFormulaCorrectionRuleList({ page, pageSize, isPage: true, ...filters }));
	}, [dispatch, page, pageSize, filters])

	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default FormulaCorrectionRule;
