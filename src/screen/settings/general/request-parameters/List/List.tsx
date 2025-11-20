import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { editRequestParameters } from 'src/core/store/modules/request-parameters/thunks';
import {
	getListRequestParameters,
	getLoadingRequestParameters
} from 'src/core/store/modules/request-parameters/selectors';
import { TRequestParameters } from 'src/core/models/request-parameters';
import { useTranslation } from 'src/locale/i18n';
import { RESPONSIBLE_TYPE, resposibleAsOptions } from '../constants';

const RequestParameters = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListRequestParameters);
	const loading = useSelector(getLoadingRequestParameters);

	const rows = useMemo(() => list.map(item => {
		const { responsibleType, user, hasDeadline, hoursDeadline } = item;

		const responsible = responsibleType === RESPONSIBLE_TYPE.CUSTOM
			? user?.name
			: resposibleAsOptions.find(({ value }: any) => value === responsibleType)?.label

		const deadline = hasDeadline
			? t('settings:requestParameters.hourDeadline', { hs: hoursDeadline }) + (hoursDeadline > 1 ? 's' : '')
			: t('settings:requestParameters.noDeadline')

		return ({
			...item,
			responsible,
			deadline,
		})
	}), [list, t])

	const handleChangeStatus = ({ status, responsible, deadline, ...row }: TRequestParameters & { responsible: string, deadline: string }) => {
		if (row.id) dispatch(editRequestParameters({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('settings:requestParameters.id'), field: 'id' },
		{ label: t('settings:requestParameters.request'), field: 'requestType' },
		{ label: t('settings:requestParameters.responsible'), field: 'responsible' },
		{ label: t('settings:requestParameters.deadline'), field: 'deadline' },
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = ({ id }: TRequestParameters) => {
		history.push(`/configuracoes/geral/parametros-requisicao/${id}`);
	};

	return (
		<>
			<Panel title={t('settings:titles.requestParameters')}>
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

export default RequestParameters;
