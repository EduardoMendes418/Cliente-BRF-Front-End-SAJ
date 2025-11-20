import moment from 'moment';
import { Formik } from 'formik';
import FileSaver from 'file-saver';
import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { useTranslation } from 'src/locale/i18n';
import { Button, Box, Grid, CircularProgress } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { AppDispatch } from 'src/core/store';
import { DateField, SelectField } from 'src/components/form';

import { getExecutedInterestUpdates, getReportInterestUpdatesAccounting, getRunInterestDeposit } from 'src/core/store/modules/goods-guarantee/thunks';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import Clean from 'src/components/button/Clean';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useClosingOptions } from 'src/hooks/useProcessFilterOptions';
import { confirm } from 'src/components/modals';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type TReportRequest = {
	reportDate: string | null;
	judicialAreaIds: number[];
	accoutingTypes: number[];
	closureId: number[] | null;
}

type TOptions = {
	label: string,
	value: number
}

const initialValues: TReportRequest = {
	reportDate: null,
	judicialAreaIds: [],
	accoutingTypes: [],
	closureId: [],
}

type Props = {
	setRows: any
}

const Export = ({setRows}: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	
	const { groupedAreasAsOptions } = useGroupedAreas();
	const closingOptions = useClosingOptions();

	const [isDisabled, setisDisabled] = useState<boolean>(false);

	const closingOptionsList = useMemo(() => closingOptions.slice().sort((x, y) => x.label.localeCompare(y.label)).filter((x) => x.label !== ''), [closingOptions]);

	const movementAsOptions: TOptions[] = [
		{label: "Atualização mensal depósitos judiciais", value: 1},
		{label: "Reversão da atualização mensal depósitos judiciais", value: 2},
		{label: "Reversão por prestação de contas", value: 3}
	];

	const onSubmit = async ( { reportDate, judicialAreaIds, accoutingTypes, closureId }: TReportRequest, { setSubmitting }: any) => {

		setSubmitting(true);
		setisDisabled(true);
		const referenceMonth = moment(reportDate).month() + 1;
		const referenceYear = moment(reportDate).year();

		const payload = {
			referenceMonth,
			referenceYear,
			judicialAreaIds,
			accoutingTypes,
			closureId
		}

		const res: PayloadAction<any> = await dispatch(getReportInterestUpdatesAccounting(payload))

		if (res.type.includes('fulfilled')) {
			enqueueSnackbar(
				"Relatório gerado em fila. Consulte no menu opção Relatórios > Relatórios gerados",
				{ variant: 'info' })
		}

		setSubmitting(false);
		setisDisabled(false);
	}

	const onRunInterestDeposit = async (values: any) => {
		const isConfirmed = await confirm("Tem certeza que deseja executar a atualização de depósitos?");
		if (!isConfirmed){
			return;
		}
		setisDisabled(true);
		const payload = {
			closureId: values.closureId,
			date: values.reportDate,
			areaDejur: values.judicialAreaIds.map(String)}

		if(values.judicialAreaIds.length === 0){
			delete payload.areaDejur
		}

		if(values.closureId === null){
			delete payload.closureId
		}

		if(payload.date === null){
			delete payload.date
		}
		
		const res: PayloadAction<any> = await dispatch(getRunInterestDeposit(payload))  

		if(res.hasOwnProperty('error') === true){
			enqueueSnackbar(
				`${res.payload.detail}`,
				{ variant: 'error' }
			);
		} else {
			enqueueSnackbar(
				`${res.payload}`,
				{ variant: 'success' }
			);
			const updatedRows: PayloadAction<any> = await dispatch(getExecutedInterestUpdates({}))
			setRows(updatedRows.payload.items)
		}
		setisDisabled(false);
	}

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, resetForm, values }) => (
				<form noValidate autoComplete="off" onSubmit={handleSubmit}>
					<Panel
						withPadding title={t('goodsAndGuarantees:accountingReport.title')}
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
								name='judicialAreaIds'
								multiple
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<DateField
								required
								label={t('goodsAndGuarantees:accountingReport.date')}
								name="reportDate"
								format='MM/yyyy'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<SelectField
								options={movementAsOptions}
								label={t('goodsAndGuarantees:accountingReport.movement')}
								name='accoutingTypes'
								multiple
							/>
						</Grid>
						<Grid item md={6} xs={6}>
							<Clean onClick={resetForm} />
						</Grid>
				</Grid>
					</Panel>
					<Box gridGap="1rem" sx={{ marginTop: 20, flexDirection: "row-reverse"}} display="flex">
						{!isDisabled && <Button
							type='submit'
							color='primary'
							variant='contained'
							disabled={isDisabled}	
						>
							{t('goodsAndGuarantees:accountingReport.button')}
						</Button>}
						{isDisabled && <CircularProgress />}
						 <Button
							onClick={() => onRunInterestDeposit(values)}
							color='primary'
							variant='contained'
							disabled={isDisabled}
						>
							{t('goodsAndGuarantees:accountingReport.execute')}
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
}
export default Export;