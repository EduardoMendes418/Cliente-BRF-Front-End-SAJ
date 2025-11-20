import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import List from 'src/components/List'
import { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { getProcessFolders, getProcessFoldersLoading } from 'src/core/store/modules/process/selectors'

const CalculationList = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const folders = useSelector(getProcessFolders);
	const loading = useSelector(getProcessFoldersLoading);

	const columns: ColumnData[] = [
		{ label: t('form.CTGFolder'), field: 'folderNumber' },
		{ label: t('calculations:id'), field: 'id' },
		{ label: t('form.legalDepartmentArea'), field: 'legalDepartmentArea' },
		{ label: t('form.costCenter'), field: 'costCenter' },
	];

	const onEdit = (row: any) => history.push(`/calculos/${row.folderNumber}`);

	return (
		<List
			title={t('requestList')}
			columns={columns}
			items={folders}
			onEdit={onEdit}
			loading={loading}
		/>
	);
};

export default CalculationList;
