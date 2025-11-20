import { Grid } from '@material-ui/core';

import { DateField, DateHourField, SelectField } from 'src/components/form';
import { useTranslation } from 'src/locale/i18n';

import { statusClosureAsOptions } from 'src/screen/closure/constants';

type TProps = { form?: boolean, isSchedule?: boolean }
const Fields = ({ form = true, isSchedule = false }: TProps) => {
	const { t } = useTranslation();

	return (
		<>
			<Grid item md={form ? 3 : 6} xs={12}>
				<DateField
					name='period'
					label={t('closure:closingRoutine.list.period')}
					views={['year', 'month']}
					format='MM/yyyy'
					required
					disabled={isSchedule}
				/>
			</Grid>

			<Grid item md={form ? 3 : 6} xs={12}>
				<SelectField
					label={t('closure:closingRoutine.list.status')}
					name='status'
					options={statusClosureAsOptions ?? []}
					disabled={isSchedule}

				/>
			</Grid>
			<Grid item md={form ? 4 : 12} xs={12}>
				<Grid container spacing={3}>
					<Grid item xs={6} md={6}>
						<DateField
							name='startDateCompetence'
							label={t('closure:closingRoutine.list.startDateCompetence')}
							disabled={isSchedule}
						/>
					</Grid>
					<Grid item xs={6} md={6}>
						<DateField
							name='endDateCompetence'
							label={t('closure:closingRoutine.list.endDateCompetence')}
							disabled={isSchedule}
						/>
					</Grid>
				</Grid>
			</Grid>
			{isSchedule && <Grid item md={6} xs={12}>
				<DateHourField
					name='dataHoraAgendamento'
					label={"Data/hora Liberação da Competência"}
					
				/>
			</Grid>}
		</>


	);
};

export default Fields;