import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { TCivilMass } from 'src/core/models/civil-mass';
import { TUser } from 'src/core/models/users';
import { getListCivilMass, getLoadingCivilMass } from 'src/core/store/modules/civil-mass/selectors';
import { editCivilMass } from 'src/core/store/modules/civil-mass/thunks';
import { getOptionsAsObject } from 'src/core/utils/func';
import { useTranslation } from 'src/locale/i18n';
import { useFormulaCorrectionRule, useAreasWitchGroups } from 'src/hooks/fetchLists';
import { optionsCivilMassFolderStatus } from '../../../constants';

const folderStatusAsObject = getOptionsAsObject(optionsCivilMassFolderStatus) as any;

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListCivilMass);
	const loading = useSelector(getLoadingCivilMass);
	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();
	const { areasDEJUROptions } = useAreasWitchGroups();
	const areasDEJURAsObject = useMemo(() => getOptionsAsObject(areasDEJUROptions), [areasDEJUROptions]) as any;

	const rows = useMemo(() => list.map((item) => {

		return {
			...item,
			area: areasDEJURAsObject[item.dejurArea] ?? '',
			status: folderStatusAsObject[item.folderStatus] ?? '',
			formulaCorrectionRuleId: formulaCorrectionRuleAsOptions.find(element => element.value === item.formulaCorrectionRuleId)?.label ?? '',
		}
	}), [list, areasDEJURAsObject, formulaCorrectionRuleAsOptions]);

	const onEdit = ({ id }: TUser) => {
		history.push(`/configuracoes/geral/valor-predefinido-pedido/${id}`);
	};

	const handleChangeStatus = ({ isActive, ...row }: TCivilMass & { id: number }) => {
		const formulaCorrectionRuleId = formulaCorrectionRuleAsOptions.find(item => item.label === row.formulaCorrectionRuleId)?.value ?? ''

		if (row.id) dispatch(editCivilMass({ ...row, formulaCorrectionRuleId, isActive: !isActive }));
	};

	const columns: ColumnData[] = [
		{ label: t('settings:defaultOrderValue.form.dejurArea'), field: 'area' },
		{ label: t('settings:defaultOrderValue.form.folderStatus'), field: 'status' },
		{ label: t('settings:defaultOrderValue.form.orderDescription'), field: 'name' },
		{ label: t('settings:defaultOrderValue.form.provisionAmount'), field: 'value', type: 'currency' },
		{ label: t('settings:defaultOrderValue.form.CorrectionFormulaAndRule'), field: 'formulaCorrectionRuleId', type: 'string' },
		{
			label: t('settings:defaultOrderValue.form.status'),
			field: 'isActive',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},

	];

	return (
		<>
			<Panel title={t('settings:defaultOrderValue.titleList')}>
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
