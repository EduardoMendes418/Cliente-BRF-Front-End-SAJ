import Panel from 'src/components/Panel';
import { Grid, Typography } from "@material-ui/core";
import { Formik } from 'formik';

import { NumericField, DateField } from "src/components/form";
import { useTranslation } from "src/locale/i18n";
import { Submit } from "src/components/button";

const initialValues = {
	folderNumber: '',
	monthAndYear: new Date()
};

type TProps = {
	onSubmit: any
	feedback?: string | null
	loading: boolean,
}

const SearchLogOfProvisions = ({ feedback = '', loading, onSubmit }: TProps) => {
	const { t } = useTranslation();

	return (
		<Panel title={t('provisions:provisionLog.searchValues')} withPadding>
			<Formik
				initialValues={initialValues}
				enableReinitialize
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<NumericField
									name='folderNumber'
									label={t('form.CTGFolder')}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name='monthAndYear'
									label={t('closure:closingRoutine.list.period')}
									views={['year', 'month']}
									format='MM/yyyy'
									required
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit
									type="search"
									disabled={!dirty}
									submitting={loading}
								/>
							</Grid>
							{feedback !== '' && (
								<Grid item xs={12}>
									<Typography color="error" style={{ fontSize: '18px' }}>
										{feedback}
									</Typography>
								</Grid>
							)}
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default SearchLogOfProvisions;
