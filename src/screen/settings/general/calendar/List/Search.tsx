import { Formik, FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import { TextField } from 'src/components/form';
import { Submit, Clean } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { TNonWorkingDaysFilters } from 'src/core/models/non-working-days';
import { getListFiltersNonWorkingDays, getLoadingNonWorkingDays } from 'src/core/store/modules/non-working-days/selectors';


type Props = { reset: () => void }

const Search = ({ reset }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	
	const loading = useSelector(getLoadingNonWorkingDays)
	const listFilters = useSelector(getListFiltersNonWorkingDays)
	
	const onSubmit = (
		values: TNonWorkingDaysFilters,
		{ setSubmitting }: FormikHelpers<TNonWorkingDaysFilters>
	) => {
		dispatch(actions.nonWorkingDays.setFilters(values));
		setSubmitting(false)
	}
		
	const initialValues: TNonWorkingDaysFilters = { description: listFilters?.description ?? '' }

	return (
		<>
			<Typography
				variant='h2'
				data-testid='panel-title'
				className='panel-title'
			>
				Pesquise por descrição
			</Typography>
			<br />
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, dirty, resetForm }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<TextField
									name='description'
									label='Descrição'
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={2}>
								<Submit type="search" disabled={!dirty} submitting={loading} />
							</Grid>
						</Grid>
						<Clean onClick={() => {
							reset()
							resetForm()
						}} />
					</form>
				)}
			</Formik>
		</>
	)
}

export default Search;
