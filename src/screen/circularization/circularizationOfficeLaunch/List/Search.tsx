import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { DateField, SelectField} from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { getLoadingCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/selector';
import { useEffect } from 'react';
import { circularizationStatusFilterAsOptions } from '../../constants';
import { fetchCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/thunks';
import { useSnackbar } from 'notistack';
import {  getListFiltersCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Search = () => {
	const dispatch = useDispatch();

	const { pageSize, page } = usePagination();
	const { enqueueSnackbar } = useSnackbar();
	const filters = useSelector(getListFiltersCircularizationBaseGenerationHeader); 
	const loading = useSelector(getLoadingCircularizationOfficeLaunch);
	const { groupedAreasAsOptions } = useGroupedAreas();

	const getData = async () => {
		 if(Object.keys(filters)?.length === 2 || JSON.stringify(filters) === "{}"){
			dispatch(actions.CircularizationBaseGenerationHeader.setFilters({Status: [1, 3]}));
			return
		} 

		const { type } = await dispatch(fetchCircularizationBaseGenerationHeader({ page, pageSize, ...filters})) as any;
		 if(type === 'circularizationBaseGenerationHeader/fetch/rejected'){
			return  enqueueSnackbar("Não existe registros para o filtro selecionado.", {
				variant: "error",
			})
		}
	}
	

	const onSubmit = (values: any) => {
		const result = rejectNoValues({ pageSize, page, ...values, })	
		dispatch(actions.CircularizationBaseGenerationHeader.setFilters(result));
	};
	
	useEffect(() => {
		getData();
	}, [dispatch, filters])
	

	const initialValues: any = {
		DejurAreaIds: [],
		CircularizationDate: null,
		Status: [1, 3]
	}

	return (
		<Panel title={"Avaliação do Escritório"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<DateField
									label={"Mês da circularização"}
									name="CircularizationDate"
									views={['year', 'month']}
									provisionReport={true}
									format="MM-YYYY"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									options={groupedAreasAsOptions}
									label={"Área DEJUR"}
									name='DejurAreaIds'
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									options={circularizationStatusFilterAsOptions}
									label={"Status"}
									name='Status'
									multiple
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='CircularizationBaseGenerationHeader' onClick={() => dispatch(actions.CircularizationBaseGenerationHeader.setFilters({}))}/>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
