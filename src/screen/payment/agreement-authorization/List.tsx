import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import List from 'src/components/List'
import { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { fetchAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/thunks'
import {
	getListAgreementAuthorization,
	getFiltersAgreementAuthorization,
} from 'src/core/store/modules/agreement-authorization/selectors'
import { usePagination } from 'src/hooks/pagination'
import { rejectNoValues } from 'src/core/utils/func';

const AgreementAuthorizationList = ({ loading }: { loading: boolean }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListAgreementAuthorization);
	const filters = useSelector(getFiltersAgreementAuthorization);

	const { page, pageSize } = usePagination()

	useEffect(() => {
		const result = rejectNoValues({ ...filters, page, pageSize })
		dispatch(fetchAgreementAuthorization(result))
	}, [dispatch, page, pageSize, filters]);

	const columns: ColumnData[] = [
		{ label: t('form.CTGFolder'), field: 'folderNumber' },
		{ label: t('processInformation.processNumber'), field: 'processNumber' },
		{ label: t('form.legalDepartmentArea'), field: 'legalDepartmentArea' },
		{ label: t('form.costCenter'), field: 'costCenter' },
		{ label: t('status'), field: 'status' },
	];

	const onVisualize = ({ id }: any) => {
		history.push(`/pagamentos/autorizar-acordo/${id}`);
	};

	return (
		<List
			title={t('requestList')}
			columns={columns}
			items={list}
			onVisualize={onVisualize}
			loading={loading}
		/>
	);
};

export default AgreementAuthorizationList;
