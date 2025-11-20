import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { t } from 'src/locale/i18n';
import { usePagination } from 'src/hooks/pagination';
import {
	getFiltersJudicialBlocksAndTransfers,
	getLoadingJudicialBlocksAndTransfers
} from 'src/core/store/modules/judicial-blocks-and-transfers/selectors';
import { fetchJudicialBlocksAndTransfersList } from 'src/core/store/modules/judicial-blocks-and-transfers/thunks';

import Search from './Search';
import List from './List';
import { rejectNoValues } from 'src/core/utils/func';
import { useHistory } from "react-router-dom";


const JudicialBlocksAndTransfersList = () => {
	const dispatch = useDispatch();
	const { location } = useHistory();
	const { page, pageSize } = usePagination();

	const filters = useSelector(getFiltersJudicialBlocksAndTransfers);
	const loading = useSelector(getLoadingJudicialBlocksAndTransfers);
	const isSolicitacao = location.pathname.includes("solicitacao")

	useEffect(() => {
		const finalFilters = filters[location.pathname] ?? {};
		const result = rejectNoValues({ ...finalFilters, page: page, pageSize: pageSize});
		dispatch(fetchJudicialBlocksAndTransfersList({...result}));
	}, [dispatch, page, pageSize, filters, location.pathname]);

	return (
		<ScreenTemplate slotTopRight={t('add') && isSolicitacao}>
			<Search loading={loading} />
			<List loading={loading} />
		</ScreenTemplate>
	);
};

export default JudicialBlocksAndTransfersList;
