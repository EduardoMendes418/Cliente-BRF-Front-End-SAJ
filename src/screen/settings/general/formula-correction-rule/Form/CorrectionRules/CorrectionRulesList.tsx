import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Grid } from '@material-ui/core';
import * as queryString from 'query-string'

import Table, { ColumnData } from 'src/components/Table';
import { TOptionsSelect } from 'src/components/form';
import { modal } from 'src/components/modals';
import { useTranslation } from 'src/locale/i18n';

import { getOptionsAsObject } from 'src/core/utils/func';
import { optionsValueType, VALUE_TYPE } from 'src/screen/settings/constants';
import { TCorrectionRule, TCorrectionRuleItem } from 'src/core/models/correction-rule';

import CorrectionRulesEditModal from './CorrectionRulesEditModal';

const optionsValueTypeAsObject = getOptionsAsObject(optionsValueType) as any;

type TCorrectionRulesList = {
	economicIndicesAsOptions: TOptionsSelect[];
	correctionRules: TCorrectionRuleItem[];
	onEdit: (item: TCorrectionRuleItem) => void;
	onDelete: (item: TCorrectionRuleItem) => void;
	canEdit: boolean;
}

const CorrectionRulesList = ({ economicIndicesAsOptions, correctionRules, onEdit, onDelete, canEdit }: TCorrectionRulesList) => {
	const location = useLocation();
	const { t } = useTranslation();

	const economicIndicesAsObject = useMemo(
		() => getOptionsAsObject(economicIndicesAsOptions),
		[economicIndicesAsOptions]) as any;

	const rows = useMemo(() => correctionRules
		.filter(({ submitAction }) => submitAction !== 'delete')
		.map(item => ({
			...item,
			fineTypeName: optionsValueTypeAsObject[item.fineType],
			index: economicIndicesAsObject[item.economicIndicesId] ?? '',
		})),
		[correctionRules, economicIndicesAsObject]);

	const onEditItem = (item: TCorrectionRule) => {
		const component = (
			<CorrectionRulesEditModal
				correctionRule={item}
				economicIndicesAsOptions={economicIndicesAsOptions}
				onSave={onEdit}
				canEdit={canEdit}
			/>
		)

		modal({
			title: t('settings:formulaCorrectionRule.form.correctionRule'),
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true, fullWidth: true },
		})
	};

	const columns: ColumnData[] = [
		{ label: t('settings:formulaCorrectionRule.form.index'), field: 'index' },
		{ label: t('settings:formulaCorrectionRule.form.correctionStart'), field: 'correctionStart', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.correctionEnd'), field: 'correctionEnd', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesStart'), field: 'feesStart', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesEnd'), field: 'feesEnd', type: 'date' },
		{ label: t('settings:formulaCorrectionRule.form.feesValue'), field: 'feesValue', type: 'percentage' },
		{ label: t('settings:formulaCorrectionRule.form.fineType'), field: 'fineTypeName' },
		{
			label: t('settings:formulaCorrectionRule.form.fineValue'),
			field: 'fineValue',
			type: 'currency',
			customTypeRule: (row: TCorrectionRule) => (
				row.fineType
					? row.fineType === VALUE_TYPE.PERCENTAGE ? 'percentage' : 'currency'
					: undefined
			)
		},
	];

	useEffect(() => {
		const { regraCorrecao: correctionRuleId } = queryString.parse(location.search) as { regraCorrecao: string };
		if (!correctionRuleId || !economicIndicesAsOptions || !economicIndicesAsOptions.length) return;
		
	}, [location.search, economicIndicesAsOptions])

	return (
		<Grid container className="margin-top-16">
			<Table
				onEdit={onEditItem}
				onDelete={onDelete}
				columns={columns}
				rows={rows}
			/>
		</Grid>
	);
};

export default CorrectionRulesList;
