import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { DateField, SelectField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import UserField from 'src/components/form/UserField';

import { rejectNoValues } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import { getListFiltersEqualization, getLoadingEqualization } from 'src/core/store/modules/equalization/selectors';
import { TEqualizationFilters } from 'src/core/models/equalization';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { useTranslation } from 'src/locale/i18n';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { groupedAreasAsOptions} = useGroupedAreas();

	const loading = useSelector(getLoadingEqualization);
	const savedFilters = useSelector(getListFiltersEqualization);

	const onSubmit = (values: TEqualizationFilters) => {
		const filter = rejectNoValues(values) as TEqualizationFilters;
		dispatch(actions.equalization.setFilters(filter));
	};

	const initialValues: TEqualizationFilters = {
		areaId: '',
		createStart: null,
		createEnd: null,
		userId: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t('closure:runEqualization.titleSearch')} withPadding>
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, isSubmitting, setSubmitting, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('settings:users.form.dejurArea')}
									name='areaId'
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name='createStart'
									label={t('closure:runEqualization.list.requestDateStart')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									name='createEnd'
									label={t('closure:runEqualization.list.requestDateEnd')}
									minDate={values.createStart}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserField
									label={t('closure:runEqualization.list.requestingUser')}
									name='userId'
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems='center'>
							<Grid item md={6} xs={6}>
								<Clean action='equalization' />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
