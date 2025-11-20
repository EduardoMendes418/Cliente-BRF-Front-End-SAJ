import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { getListEconomicIndices, getLoadingEconomicIndices } from 'src/core/store/modules/economic-indices/selectors';
import { editEconomicIndices } from 'src/core/store/modules/economic-indices/thunks';
import { TEconomicIndices } from 'src/core/models/economic-indices';
import { useTranslation } from 'src/locale/i18n';

import { periodAsOptions, typeAsOptions } from '../constants'

const EconomicIndices = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const history = useHistory();

	const list = useSelector(getListEconomicIndices);
	const loading = useSelector(getLoadingEconomicIndices);

	const rows = useMemo(()=>{
		return list.map(economicIndice => {
			return {
				...economicIndice,
				typeName: typeAsOptions.find(type => economicIndice.type === type.value)?.label,
				periodName: periodAsOptions.find(period => economicIndice.period === period.value)?.label
			}
		})
	},[list])

	const handleChangeStatus = ({ status, periodName, typeName, ...row }: TEconomicIndices & { id: number, typeName: string, periodName: string }) => {
		if (row.id) dispatch(editEconomicIndices({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('settings:economicIndices.id'), field: 'id' },
		{ label: t('settings:economicIndices.name'), field: 'name' },
		{ label: t('settings:economicIndices.period'), field: 'periodName' },
		{ label: t('settings:economicIndices.type'), field: 'typeName' },
		{ label: t('settings:economicIndices.description'), field: 'description' },
		{ label: t('settings:economicIndices.updatedDate'), field: 'updatedDate', type: 'date' },
		{
			label: t('settings:economicIndices.status'),
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = ({ id }: TEconomicIndices) => {
		history.push(`/configuracoes/geral/indices-economicos/${id}`);
	};

	return (
		<>
			<Panel title={t('settings:titles.economicIndices')}>
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

export default EconomicIndices;
