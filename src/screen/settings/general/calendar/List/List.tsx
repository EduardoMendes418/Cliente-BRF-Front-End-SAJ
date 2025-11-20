import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom"

import Table, { ColumnData } from 'src/components/Table';

import { useTranslation } from 'src/locale/i18n';
import { deleteNonWorkingDays } from 'src/core/store/modules/non-working-days/thunks';
import { TNonWorkingDays } from 'src/core/models/non-working-days';
import { getLoadingNonWorkingDays } from 'src/core/store/modules/non-working-days/selectors';

type Props = { items: TNonWorkingDays[] }

const List = ({ items }: Props) => {
	const history = useHistory();

	const { t } = useTranslation()
	const dispatch = useDispatch()

	const loading = useSelector(getLoadingNonWorkingDays)

	const onDelete = ({ id }: { id: number }) => dispatch(deleteNonWorkingDays(id))

	const onEdit = ({ id }: { id: number }) => history.push(`/configuracoes/geral/calendario/${id}`)

	const columns: ColumnData[] = [
		{ label: t('settings:calendary.date'), type: 'date', field: 'date', },
		{ label: t('settings:calendary.description'), field: 'description' },
	];

	return (
		<Table
			columns={columns}
			rows={items}
			onDelete={onDelete}
			onEdit={onEdit}
			isLoading={loading}
			numItemsLoading={3}
		/>
	)
}

export default List