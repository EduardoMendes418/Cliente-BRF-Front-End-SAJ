import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'src/locale/i18n';

import { getListFiltersEqualizationParameters, getLoadingEqualizationParameters } from 'src/core/store/modules/equalization-parameters/selectors';
import { actions } from 'src/core/store';
import { TDejurAreaFilter } from 'src/core/models';
import Panel from 'src/components/Panel';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { Clean, Submit } from 'src/components/button';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { useHistory } from 'react-router-dom';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { location: { pathname } } = useHistory();

	const loading = useSelector(getLoadingEqualizationParameters);
	const savedFilters = useSelector(getListFiltersEqualizationParameters);
	const { groupedAreasAsOptions} = useGroupedAreas();


	const onSubmit = (values: TDejurAreaFilter) => {
		dispatch(actions.equalizationParameters.setFilters({ filters: values, page: pathname }));
	};

	return (
		<Panel title={t('settings:equalizationParameters.titleSearch')} withPadding>
			<Formik initialValues={{ dejurArea: '', ...(savedFilters ?? {})[pathname] }} onSubmit={onSubmit}>
				{({ handleSubmit, isSubmitting, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('settings:users.form.dejurArea')}
									name='dejurArea'
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='equalizationParameters' page={pathname} />
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
