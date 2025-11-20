import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { getListFiltersReportConfiguration } from 'src/core/store/modules/report-configuration/selectors';

const Search = ({ loading, pathname }: { loading: boolean, pathname: string }) => {

	const { t } = useTranslation()
	const dispatch = useDispatch();

	const savedFilters = useSelector(getListFiltersReportConfiguration);

	const onSubmit = ({ filterName }: { filterName: string }, { setSubmitting }: any) => {
		dispatch(actions.reportConfiguration.setFilters({ filters: { filterName }, page: pathname }));
		setSubmitting(false)
	}

	const initialValues = {
		filterName: '',
		...(savedFilters[pathname] ?? {})
	}

	return (
		<Panel title={t('reports:titleFilter')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={10} md={3}>
								<TextField
									required
									name='filterName'
									label={t('reports:filterName')}
								/>
							</Grid>
							<Grid item xs={2}>
								<Submit type="search" disabled={!dirty} submitting={loading} />
							</Grid>
						</Grid>
						<Clean action='reportConfiguration' page={pathname} />
					</form>
				)
				}
			</Formik>
		</Panel>
	)
}

export default Search