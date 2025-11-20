import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import { useTranslation } from 'src/locale/i18n';
import Pagination from 'src/components/Pagination';
import Table, { ColumnData } from 'src/components/Table';
import { 
	fetchESocialAreasUpdate, 
	fetchESocialAreasDelete,
	fetchESocialAreasGridList 
} from 'src/core/store/modules/e-social-areas/thunks';
import { TESocialRowData } from './types'

const DejurZoneTableList = ({ items, loading }: { items: TESocialRowData[], loading: boolean }) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();

	const handleAlerts = (meta: any, error: any) => {
		if(meta?.requestStatus === "rejected"){
			return enqueueSnackbar(`${error?.message}`, { variant: "error" });
		}
		if(meta?.requestStatus === "fulfilled"){
			return enqueueSnackbar("Cadastro atualizado com sucesso!", { variant: "success" });
		}
	}

	const handleChangeStatus = async ({ id, areaId, isActive }: TESocialRowData) => {
		// @ts-ignore eslint-disable-next-line
		const { meta, error } = await dispatch(fetchESocialAreasUpdate({ id, areaId, isActive: !isActive }));
		handleAlerts(meta, error);
	};

	const handleDelete = async ({ id }: TESocialRowData) => {
		// @ts-ignore eslint-disable-next-line
		const { meta, error } = await dispatch(fetchESocialAreasDelete({ id }));
		dispatch(fetchESocialAreasGridList({}));
		handleAlerts(meta, error);
	};

	const columns: ColumnData[] = [
		{ 
			label: t('settings:eSocialArea.list.id'), 
			field: 'id' 
		},
		{ 
			label: t('settings:eSocialArea.list.description'), 
			field: 'areaName'
		},
		{
			label: t('settings:eSocialArea.list.isActive'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const rows: TESocialRowData[] = items?.map(({ id, areaName, isActive, areaId }) => ({ id, areaName, isActive, areaId }));

	const onEdit = (row: TESocialRowData) => {
		history.push(`/configuracoes/e-social/area-dejur-do-e-social/${row.id}`);
	}; 

	return (
		<>
			<Table
				onEdit={onEdit}
				columns={columns}
				rows={rows}
				isLoading={loading}
				onDelete={handleDelete}
			/>
			<Pagination />
		</>
	);
};

export default DejurZoneTableList;
