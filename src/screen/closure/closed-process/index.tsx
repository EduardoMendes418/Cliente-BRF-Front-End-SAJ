import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Box, Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import FileSaver from 'file-saver';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { DateField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n';
import { generateReport } from 'src/core/store/modules/closed-process/thunks';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { TClosedProcessReport } from 'src/core/models/closed-process';
import { AppDispatch } from 'src/core/store';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const initialValues: TClosedProcessReport = {
	areaDejurIds: [],
	periodStart: null,
	periodEnd: null
}

const ClosedProcessReport = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const [isLoading, setIsLoading] = useState(false)
	const { groupedAreasAsOptions } = useGroupedAreas();

	const onSubmit = useCallback(async (values: TClosedProcessReport) => {
		setIsLoading(true);
		const { payload, type } = await dispatch(generateReport(values)) as any;
		setIsLoading(false);

		if (type === 'closed-process/generateClosedProcessReport/rejected') {
			const hasErrorMessage = typeof payload === 'string'
			const errorMessage = JSON.parse(payload)
			enqueueSnackbar(hasErrorMessage ? errorMessage?.detail : t('anErrorHasOcurred'), { variant: 'error' })
			return
		}

		FileSaver.saveAs(payload as Blob, `relatorio_honorarios_exito.xlsx`)
	}, [dispatch, enqueueSnackbar, t])

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, isValid, resetForm, dirty }) => (
					<form
						noValidate
						onSubmit={handleSubmit}
						autoComplete="off"
					>
						<Panel withPadding title={t("closure:closedProcess.filter.title")}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<GroupedSelectFiledMultiple
										required
										multiple
										label={t('closure:closedProcess.filter.dejurArea')}
										name="areaDejurIds"
										options={groupedAreasAsOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										required
										label={t('closure:closedProcess.filter.period')}
										views={['year', 'month']}
										monthYear={true}
										format="MM-YYYY"
										name="periodStart"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										label={t('closure:closedProcess.filter.period')}
										views={['year', 'month']}
										monthYear={true}
										format="MM-YYYY"
										name="periodEnd"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<Clean onClick={resetForm} />
								</Grid>
							</Grid>
						</Panel>
						<Box mt="20px" textAlign="right">
							<Submit
								disabled={isLoading || !isValid || !dirty}
								submitting={isLoading || isSubmitting}
								text={t('closure:closedProcess.generateReport')}
							/>
						</Box>
					</form>
				)}
			</Formik>
		</ScreenTemplate>
	)
}

export default ClosedProcessReport