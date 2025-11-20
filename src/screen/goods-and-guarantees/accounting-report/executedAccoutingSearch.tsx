import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { DateField, SelectField } from 'src/components/form';

import { useGroupedAreas } from 'src/hooks/fetchLists';
import Clean from 'src/components/button/Clean';
import Submit from 'src/components/button/Submit';
import {  getExecutedInterestUpdatesWhenPageLoad } from 'src/core/store/modules/goods-guarantee/thunks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import { PayloadAction } from '@reduxjs/toolkit';
import { useClosingOptions } from 'src/hooks/useProcessFilterOptions';
import { useMemo } from 'react';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type TReportRequest = {
	competenceDate : string | null;
	juridicalAreaIds: number[];
	accountingTypeId: number | null;
	statusApprovals: number[];
	closureId: number[] | null;
}

type TOptions = {
	label: string,
	value: number
}

const initialValues: TReportRequest = {
	competenceDate : null,
	juridicalAreaIds: [],
	statusApprovals: [],
	accountingTypeId: null, 
	closureId: [],
}

type Props = {
	onSubmitGetInterest: any
	setRows: any
}

const ExecutedAccoutingSearch = ({onSubmitGetInterest, setRows}: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();

	const { groupedAreasAsOptions } = useGroupedAreas();
	const closingOptions = useClosingOptions();

	const movementAsOptions: TOptions[] = [
		{label: "Atualização mensal de depósitos", value: 1},
		{label: "Reversão da atualização mensal depósitos judiciais", value: 2}
	];

	const statusAsOptions: TOptions[] = [
		{label: "Iniciado ", value: 20},
		{label: "Pendente", value: -1},
		{label: "Aprovado", value: 1},
		{label: "Reprovado", value: 0}
	]

	async function cleanAndSearch(callback: Function){
		const updatedRows: PayloadAction<any> = await dispatch(getExecutedInterestUpdatesWhenPageLoad())
		setRows(updatedRows.payload.items)
		callback()
	} 

	const closingOptionsList = useMemo(() => closingOptions.slice().sort((x, y) => x.label.localeCompare(y.label)).filter((x) => x.label !== ''), [closingOptions]);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmitGetInterest}
		>
			{({ handleSubmit, resetForm, isSubmitting }) => (
				<form noValidate autoComplete="off" onSubmit={handleSubmit}>
					<Panel
						withPadding title={t('goodsAndGuarantees:accountingReport.accoutingReportSearch')}
					>
						<Grid container spacing={3}>
							<Grid item xs={12} md={3}>
							<SelectField 
								options={closingOptionsList}
								label={t('goodsAndGuarantees:depositUpdate.fieldClosure')}
								name="closureId"
								multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
							<GroupedSelectFiledMultiple
								options={groupedAreasAsOptions}
								label={t('goodsAndGuarantees:accountingReport.areaDejur')}
								name='juridicalAreaIds'
								multiple
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<DateField
								label={t('goodsAndGuarantees:accountingReport.date')}
								name="competenceDate"
								format='MM/yyyy'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<SelectField
								options={movementAsOptions}
								label={t('goodsAndGuarantees:accountingReport.movement')}
								name='accountingTypeId'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<SelectField
								options={statusAsOptions}
								label={t('goodsAndGuarantees:accountingReport.status')}
								name='statusApprovals'
								multiple
							/>
						</Grid>
						<Grid container spacing={2} alignItems='center'>
							<Grid item md={6} xs={6}>
							<Clean onClick={() => cleanAndSearch(resetForm)} />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
							<Submit
								type="search"
								submitting={isSubmitting}
							/>
							</Grid>
						</Grid>
				</Grid>
					</Panel>
				</form>
			)}
		</Formik>
	);
}
export default ExecutedAccoutingSearch;