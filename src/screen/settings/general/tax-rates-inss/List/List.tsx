import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { fetchTaxRatesINSS } from 'src/core/store/modules/tax-rates-inss/thunks';
import {
	getListTaxRatesINSS,
	getListFiltersTaxRatesINSS,
	getLoadingTaxRatesINSS,
} from 'src/core/store/modules/tax-rates-inss/selectors';
import { usePagination } from 'src/hooks/pagination';
import { TTaxRatesINSS } from 'src/core/models/tax-rates-inss';
import { useTranslation } from 'src/locale/i18n';
import { rejectNoValues } from 'src/core/utils/func';

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListTaxRatesINSS);
	const filters = useSelector(getListFiltersTaxRatesINSS);
	const loading = useSelector(getLoadingTaxRatesINSS);

	const { page, pageSize } = usePagination();

	useEffect(() => {
		const result = rejectNoValues({ page, pageSize, ...filters });
		dispatch(fetchTaxRatesINSS(result))
	}, [page, pageSize, filters, dispatch]);

	const columns: ColumnData[] = [
		{ label: t('settings:shared.id'), field: 'id' },
		{ label: t('settings:shared.initialDate'), type: 'date', field: 'initialDate' },
		{ label: t('settings:shared.finalDate'), type: 'date', field: 'finalDate' },
	];

	const onEdit = (row: TTaxRatesINSS) => {
		history.push(`parametros-inss/${row.id}`);
	};

	return (
		<>
			<Panel title={t('settings:taxRatesINSS.titleList')}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={list}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
