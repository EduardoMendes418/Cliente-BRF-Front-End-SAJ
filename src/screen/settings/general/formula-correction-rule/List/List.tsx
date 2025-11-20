import { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack'

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';

import { getOptionsAsObject } from 'src/core/utils/func';
import {
	getLoadingFormulaCorrectionRule,
	getListFormulaCorrectionRule,
} from 'src/core/store/modules/formula-correction-rule/selectors';
import { editFormulaCorrectionRule } from 'src/core/store/modules/formula-correction-rule/thunks';
import { VALUE_TYPE } from 'src/screen/settings/constants';
import { useEconomicIndices } from 'src/hooks/fetchLists';
import { AppDispatch } from 'src/core/store'
import { TFormulaCorrectionRule } from 'src/core/models/formula-correction-rule';

type TList = {
	id?: number;
	formulaName: string;
	status: boolean;
	formulaCorrectionRule: TFormulaCorrectionRule;
	economicIndicesId?: number | "";
	index?: string;
	correctionStart?: string | null;
	correctionEnd?: string | null;
	feesStart?: string | null;
	feesEnd?: string | null;
	feesValue?: number;
	fineType?: VALUE_TYPE | "";
	fineValue?: number | null;
}

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()

	const { economicIndicesAsOptions } = useEconomicIndices();

	const list = useSelector(getListFormulaCorrectionRule);
	const loading = useSelector(getLoadingFormulaCorrectionRule);

	const economicIndicesAsObject = useMemo(
		() => getOptionsAsObject(economicIndicesAsOptions),
		[economicIndicesAsOptions]) as any;

	const rows = useMemo(() => list.reduce((acc, formulaCorrectionRule) => {
		const { correctionRules, formulaName, status } = formulaCorrectionRule
		if (correctionRules?.length) {
			correctionRules.forEach((correctionRule) => {
				acc.push({
					id: formulaCorrectionRule.id,
					formulaName,
					status: status ?? false,
					formulaCorrectionRule,
					economicIndicesId: correctionRule.economicIndicesId,
					index: economicIndicesAsObject[correctionRule.economicIndicesId] ?? '',
					correctionStart: correctionRule.correctionStart,
					correctionEnd: correctionRule.correctionEnd,
					feesStart: correctionRule.feesStart,
					feesEnd: correctionRule.feesEnd,
					feesValue: correctionRule.feesValue,
					fineType: correctionRule.fineType,
					fineValue: correctionRule.fineType ? correctionRule.fineValue : undefined,
				})
			})
		} else {
			acc.push({
				id: formulaCorrectionRule.id,
				formulaName,
				status: status ?? false,
				formulaCorrectionRule
			})
		}
		return acc
	}, [] as TList[]), [economicIndicesAsObject, list]);

	const onEdit = ({ economicIndicesId, id }: TList) => {
		history.push(`/configuracoes/geral/formula-regra-correcao/${id}?regraCorrecao=${economicIndicesId}`);
	};
	const handleSwitchButton = useCallback(async ({ formulaCorrectionRule }: TList) => {
		if (!formulaCorrectionRule) return
		const { type } = await dispatch(editFormulaCorrectionRule({ ...formulaCorrectionRule, status: !formulaCorrectionRule.status }))
		if (type.endsWith('/rejected'))
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' });
	}, [dispatch, enqueueSnackbar, t])

	const columns: ColumnData[] = [
		{ label: t('settings:formulaCorrectionRule.form.id'), field: 'id' },
		{ label: t('settings:formulaCorrectionRule.form.formulaName'), field: 'formulaName' },
		{ label: t('settings:formulaCorrectionRule.form.index'), field: 'index' },
		{ label: t('settings:formulaCorrectionRule.form.correctionStart'), field: 'correctionStart', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.correctionEnd'), field: 'correctionEnd', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesStart'), field: 'feesStart', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesEnd'), field: 'feesEnd', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesValue'), field: 'feesValue', type: 'percentage' },
		{
			label: t('settings:formulaCorrectionRule.form.fineValue'),
			field: 'fineValue',
			type: 'currency',
			customTypeRule: (row: TList) => (
				row.fineType
					? row.fineType === VALUE_TYPE.PERCENTAGE ? 'percentage' : 'currency'
					: undefined
			)
		},
		{
			label: t('goodsAndGuarantees:explanatoryNote.status'),
			field: 'status',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleSwitchButton
		},
	];

	return (
		<>
			<Panel title={t('settings:formulaCorrectionRule.titleList')}>
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
