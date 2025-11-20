import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { ColumnData } from "src/components/Table";
import { TEqualizationParameters } from "src/core/models/equalization-parameters";

import { getListEqualizationParameters } from "src/core/store/modules/equalization-parameters/selectors";
import { getListEqualization } from "src/core/store/modules/equalization/selectors";
import { getOptionsAsObject } from "src/core/utils/func";
import { t } from "src/locale/i18n";
import { optionsContingencyType, optionsFolderStatus } from "src/screen/settings/constants";

import { useAreasWitchGroups, useFormulaCorrectionRule } from "./fetchLists";
import moment from "moment";

const folderStatusAsObject = getOptionsAsObject(optionsFolderStatus);
const contingencyTypeAsObject = getOptionsAsObject(optionsContingencyType);

const columns: ColumnData[] = [
	{ label: t('settings:equalizationParameters.form.dejurArea'), field: 'area' },
	{ label: t('settings:equalizationParameters.form.folderStatus'), field: 'status' },
	{ label: t('settings:equalizationParameters.form.contingencyType'), field: 'contingency' },
	{ label: t('settings:equalizationParameters.form.daysNumber'), field: 'days' },
	{ label: t('settings:equalizationParameters.form.monetaryUpdateRule'), field: 'formulaCorrectionRule' },
];

const useNormalizeEqualizationParameters = () => {
	const { areasDEJUROptions } = useAreasWitchGroups(false);

	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();

	const areasDEJURAsObject = useMemo(() => getOptionsAsObject(areasDEJUROptions), [areasDEJUROptions]);
	const formulaCorrectionRuleAsObject = useMemo(() => getOptionsAsObject(formulaCorrectionRuleAsOptions), [formulaCorrectionRuleAsOptions])

	const normalize = useCallback((parameter: TEqualizationParameters) => ({
		...parameter,
		area: (areasDEJURAsObject as any)[parameter.areaId] ?? '',
		status: folderStatusAsObject[parameter.folderStatus] ?? '',
		contingency: contingencyTypeAsObject[parameter.contingencyType] ?? '',
		runEqualizationText: parameter.runEqualization ? t('sim') : t('nao'),
		formulaCorrectionRule: (formulaCorrectionRuleAsObject as any)[parameter.formulaCorrectionRuleId],
	}), [areasDEJURAsObject, formulaCorrectionRuleAsObject]);


	return { normalize }
}

export const useEqualizationParametersTable = () => {

	const { normalize } = useNormalizeEqualizationParameters();

	const list = useSelector(getListEqualizationParameters);

	const rows = useMemo(() => list.map(item => normalize(item)), [list, normalize]);

	return { rows, columns };
}

export const useEqualizationTable = () => {

	const { normalize } = useNormalizeEqualizationParameters();

	const list = useSelector(getListEqualization);

	const rows = useMemo(() => list.map(({ requestingUser, startProcessing, endProcessing, requestingUserObject, ...item }) => ({
		...normalize(item),
		startProcessing,
		endProcessingDate: moment(endProcessing).format('DD/MM/YYYY'),
		endProcessingHour: moment(endProcessing).format('HH:mm'),
		requestingUser,
		requestingUserObject,
		notAllowed: !endProcessing,
		requestingUserName: requestingUserObject?.name ?? ''
	})), [list, normalize]);

	const equalizationColumns: ColumnData[] = [
		...columns,
		{ label: t('closure:runEqualization.list.requestDate'), field: 'createdDate', type: 'date' },
		{ label: t('closure:runEqualization.list.completionDate'), field: 'endProcessingDate' , type: 'date' },
	    { label: t('closure:runEqualization.list.finishingTime'), field: 'endProcessingHour'},
		{ label: t('closure:runEqualization.list.requestingUser'), field: 'requestingUserName' },
	]

	return { rows, columns: equalizationColumns };
}