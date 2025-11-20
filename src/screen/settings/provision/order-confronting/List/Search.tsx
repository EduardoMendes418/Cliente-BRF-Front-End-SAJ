import * as yup from 'yup';
import { Grid } from '@material-ui/core';
import { SelectField, TOptionsSelect } from 'src/components/form';
import { Submit } from 'src/components/button';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'src/locale/i18n';

import { getLoadingOrderConfronting } from 'src/core/store/modules/order-confronting-parameters/selectors';
import { actions } from 'src/core/store';
import { useEffect } from 'react';
import { fetchAreasWitchGroups } from 'src/core/store/modules/areas/thunks';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type TSearch = { idAreaDejur?: string; };

const initialValues: TSearch = { idAreaDejur: '' };

const validationSchema = yup.object({
	idAreaDejur: yup.string(),
});

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { groupedAreasAsOptions } = useGroupedAreas();
	const loading = useSelector(getLoadingOrderConfronting);

	const onSubmit = (areaDejur: TSearch) => {
		dispatch(actions.orderConfrontingParameters.setFilters(areaDejur));
	};

	useEffect(() => {
		dispatch(fetchAreasWitchGroups())
	}, [dispatch])

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, isSubmitting, setSubmitting }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item md={3} xs={12}>
							<GroupedSelectFiledMultiple
								name="idAreaDejur"
								label={t('form.legalDepartmentArea')}
								options={groupedAreasAsOptions}
							/>
						</Grid>
						<Grid item md={1} xs={2}>
							<Submit type="search" />
						</Grid>
					</Grid>
					{!loading && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Formik>
	);
};

export default Search;