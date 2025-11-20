import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { fetchIncomeTaxRates } from 'src/core/store/modules/income-tax-rates/thunks';
import {
	getListIncomeTaxRates,
	getListFiltersIncomeTaxRates,
	getLoadingIncomeTaxRates,
} from 'src/core/store/modules/income-tax-rates/selectors';
import { usePagination } from 'src/hooks/pagination';
import { TIncomeTaxRates } from 'src/core/models/income-tax-rates';
import { useTranslation } from 'src/locale/i18n';
import { rejectNoValues } from 'src/core/utils/func';

const IncomeTaxRates = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListIncomeTaxRates)
	const filters = useSelector(getListFiltersIncomeTaxRates)
	const loading = useSelector(getLoadingIncomeTaxRates)

	const { page, pageSize } = usePagination();

	useEffect(() => {
		const result = rejectNoValues({ page, pageSize, ...filters })
		dispatch(fetchIncomeTaxRates(result))
	}, [page, pageSize, filters, dispatch]);

	const columns: ColumnData[] = [
		{ label: t('Pagamentos:incomeTaxRates.id'), field: 'id' },
		{ label: t('Pagamentos:incomeTaxRates.initialDate'), type: 'date', field: 'initialDate' },
		{ label: t('Pagamentos:incomeTaxRates.finalDate'), type: 'date', field: 'finalDate' },
	];

	const onEdit = (row: TIncomeTaxRates) => {
		history.push(`parametros-ir/${row.id}`);
	};

	return (
		<>
			<Panel title={t('Pagamentos:incomeTaxRates.titleList')}>
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

export default IncomeTaxRates;
