import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { getListFiltersProfiles, getLoadingProfiles } from 'src/core/store/modules/profiles/selectors';
import { actions } from 'src/core/store';
import { TProfilesFilters } from 'src/core/models/profiles';
import { rejectNoValues } from 'src/core/utils/func';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingProfiles)
	const savedFilters = useSelector(getListFiltersProfiles);

	const onSubmit = (
		values: TProfilesFilters,
		{ setSubmitting }: FormikHelpers<TProfilesFilters>
	) => {
		const filters = rejectNoValues(values)
		dispatch(actions.profiles.setFilters(filters));
		setSubmitting(false)
	}

	const initialValues: TProfilesFilters = { description: '', ...(savedFilters ?? {}) }

	return (
		<Panel title={t('settings:profiles.titleSearch')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('settings:profiles.profile')}
									name='description'
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} disabled={!dirty} />
							</Grid>
						</Grid>
						<Clean action='profiles' />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
