import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { getListFiltersRequestParameters, getLoadingRequestParameters } from 'src/core/store/modules/request-parameters/selectors';
import { actions } from 'src/core/store';
import { TRequestParametersFilters } from 'src/core/models/request-parameters';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingRequestParameters)
	const savedFilters = useSelector(getListFiltersRequestParameters);

	const onSubmit = (
		values: TRequestParametersFilters,
		{ setSubmitting }: FormikHelpers<TRequestParametersFilters>
	) => {
		dispatch(actions.requestParameters.setFilters(values));
		setSubmitting(false)
	}

	const initialValues: TRequestParametersFilters = { requestType: savedFilters?.requestType ?? '' }

	return (
		<Panel title={t('settings:titles.requestParameters')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<TextField
									label={t('settings:requestParameters.form.requestType')}
									name='requestType'
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='requestParameters' />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
