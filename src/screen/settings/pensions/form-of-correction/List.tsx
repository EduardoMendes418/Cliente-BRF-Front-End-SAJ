import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';

import { deleteFormOfCorrection } from 'src/core/store/modules/pensions/form-of-correction/thunks';
import {
	getFormOfCorrectionList,
	getFormOfCorrectionIsFetching,
} from 'src/core/store/modules/pensions/form-of-correction/selectors';
import { TFormOfCorrection } from 'src/core/models/pensions';
import { actions } from 'src/core/store';
import {
	useActionFormOfCorrection,
	useFetchFormOfCorrection,
} from 'src/hooks/formOfCorrection';
import { confirm } from 'src/components/modals';

const FormOfCorrection = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	useFetchFormOfCorrection();
	useActionFormOfCorrection();

	const list = useSelector(getFormOfCorrectionList);
	const isFetching = useSelector(getFormOfCorrectionIsFetching);

	const columns: ColumnData[] = [
		{ label: t('pension:request.configurations.formsOfCorrection'), field: 'descricao' },
	];

	const handleEdit = (row: TFormOfCorrection) => {
		dispatch(actions.pensions.formOfCorrection.setItem(row));
		history.push(`/configuracoes/pensoes/forma-correcao/${row.id}`);
	};

	const handleDelete = async (row: TFormOfCorrection) => {
		if (!row.id) return;
		if (!(await confirm(t('confirmDeletion')))) return;
		dispatch(deleteFormOfCorrection(row.id));
	};

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('pension:request.configurations.formsOfCorrection')}>
				<Table
					onEdit={handleEdit}
					onDelete={handleDelete}
					columns={columns}
					rows={list}
					isLoading={isFetching}
				/>
			</Panel>
		</ScreenTemplate>
	);
};

export default FormOfCorrection;
