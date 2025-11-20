import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { TEqualizationParameters } from 'src/core/models/equalization-parameters';
import {
	getLoadingEqualizationParameters,
	getStatusEqualizationParameters as getStatus,
	getErrorMessageEqualizationParameters as getErrorMessage,
	getListFiltersEqualizationParameters,
} from 'src/core/store/modules/equalization-parameters/selectors';
import { editEqualizationParameters, fetchEqualizationParametersList } from 'src/core/store/modules/equalization-parameters/thunks';
import { useTranslation } from 'src/locale/i18n';
import { useRegisterDefault } from 'src/hooks';

import { useEqualizationParametersTable } from 'src/hooks/equalization';
import { usePagination } from 'src/hooks/pagination';

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const { location: { pathname } } = useHistory();

	const { rows, columns: commonColumns } = useEqualizationParametersTable();

	const loading = useSelector(getLoadingEqualizationParameters);

	useRegisterDefault({
		action: 'equalizationParameters',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchEqualizationParametersList({ page, pageSize, ...(equalizationParameterFilters[pathname] ?? {}) }))
	});


	const equalizationParameterFilters = useSelector(getListFiltersEqualizationParameters);

	useEffect(() => {
		const filters = equalizationParameterFilters[pathname] ?? {};
		dispatch(fetchEqualizationParametersList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, equalizationParameterFilters, pathname])

	const onEdit = ({ id }: TEqualizationParameters) => {
		history.push(`/configuracoes/geral/parametros-equalizacao/${id}`);
	};

	const handleChangeStatus = async ({ isActive, area, formulaCorrectionRule, ...row }: TEqualizationParameters & { id: number, area: string, formulaCorrectionRule: string }) => {
		if (row.id) {
			await dispatch(editEqualizationParameters({ ...row, isActive: !isActive }));
		}
	};

	const columns: ColumnData[] = [
		...commonColumns,
		{
			label: t('settings:equalizationParameters.form.runningEqualization'),
			field: 'runEqualizationText'
		},
		{
			label: t('settings:equalizationParameters.form.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	return (
		<>
			<Panel title={t('settings:equalizationParameters.titleList')}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
