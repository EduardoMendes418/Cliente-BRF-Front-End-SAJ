import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { SelectField, TextField } from 'src/components/form';
import { Submit, Clean } from 'src/components/button';

import { getListFiltersEconomicIndices, getLoadingEconomicIndices } from 'src/core/store/modules/economic-indices/selectors';
import { actions } from 'src/core/store';
import { TEconomicIndicesFilters } from 'src/core/models/economic-indices';

import { periodAsOptions } from '../constants';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingEconomicIndices)
	const savedFilters = useSelector(getListFiltersEconomicIndices)

	const onSubmit = (
		values: TEconomicIndicesFilters,
		{ setSubmitting }: FormikHelpers<TEconomicIndicesFilters>
	) => {
		dispatch(actions.economicIndices.setFilters(values));
		setSubmitting(false)
	}

	const initialValues: TEconomicIndicesFilters = {
		name: '',
		period: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t('settings:economicIndices.searchEconomicIndices')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('settings:economicIndices.name')}
									name='name'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('settings:economicIndices.period')}
									name='period'
									options={periodAsOptions}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} disabled={!dirty} />
							</Grid>
						</Grid>
						<Clean action='economicIndices' />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
