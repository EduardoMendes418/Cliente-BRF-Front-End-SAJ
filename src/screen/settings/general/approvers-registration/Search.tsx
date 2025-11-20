import { Grid } from '@material-ui/core';
import { SelectField, TOptionsSelect, TextField } from 'src/components/form';
import { Submit, Clean } from 'src/components/button';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { getHierarchyIsFetching } from 'src/core/store/modules/hierarchy/selectors';
import { useGroupedAreas, useHierarchy } from 'src/hooks/fetchLists';
import { useEffect, useMemo } from 'react';
import { rejectNoValues } from 'src/core/utils/func';
import { usePagination } from 'src/hooks/pagination';
import { fetchAreasWitchGroups } from 'src/core/store/modules/areas/thunks';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Search = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { pageSize } = usePagination();
	const { hierarchyAsOptions } = useHierarchy();

	const loading = useSelector(getHierarchyIsFetching);

	useEffect(() => {
		dispatch(fetchAreasWitchGroups())
	}, [dispatch])

	const { groupedAreasAsOptions} = useGroupedAreas();
	
	const onSubmit = (values: any ) => {
		const result = rejectNoValues({ ...values, page: 1, pageSize });

		dispatch(actions.hierarchy.setFilters(result));
	}

	const initialValues = {
		areaId: [],
		hierarquia: '',
		nomeAprovador: ''
	}

	const optionsField = useMemo<TOptionsSelect[]>(() => {
		return hierarchyAsOptions.map(({ label }) => ({  value:label, label:label  }))
	}, [hierarchyAsOptions])

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, isSubmitting, setSubmitting , resetForm }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item md={3} xs={12}>
							<GroupedSelectFiledMultiple
								name="areaId"
								label={t('approversRegistration:juridicalArea')}
								options={groupedAreasAsOptions}
								multiple
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								name="nomeAprovador"
								label={t('approversRegistration:approverName')}
							/>
						</Grid>
						<Grid item md ={3} xs={12}>
						<SelectField
								name="hierarquia"
								label={t('approversRegistration:hierarchy')}
								options={optionsField}
							/>
						</Grid>
						<Grid item md={1} xs={2}>
							<Submit disabled={isSubmitting} submitting={isSubmitting} type="search" />
						</Grid>
						<Clean
						action='approversRegistration'
						onClick={() =>{
							resetForm()
							onSubmit(initialValues)
						}}
						/>
					</Grid>
					{!loading && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Formik>
	);
};

export default Search;
