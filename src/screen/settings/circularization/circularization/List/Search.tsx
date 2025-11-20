import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { rejectNoValues } from 'src/core/utils/func';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { getLoadingCircularizationConfiguration } from 'src/core/store/modules/circularizationConfiguration/selector';
import { fetchCircularizationConfiguration } from 'src/core/store/modules/circularizationConfiguration/thunks';
import { useSnackbar } from 'notistack';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';


const Search = () => {
	const dispatch = useDispatch();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingCircularizationConfiguration);

	const { groupedAreasAsOptions } = useGroupedAreas();
	const { enqueueSnackbar } = useSnackbar();


	const onSubmit = async (values: any) => {
		const result = rejectNoValues({ pageSize, ...values, })
		const { type } = await dispatch(fetchCircularizationConfiguration(result)) as any;
		if(type === 'circularizationConfiguration/fetch/rejected'){
			return  enqueueSnackbar("Não existe registros para o filtro selecionado.", {
				variant: "error",
			})
		}
	};

	const initialValues: any = {
		DejurAreaIds: []
	}

	return (
		<Panel title={"Parâmetro da circularização"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									options={groupedAreasAsOptions}
									label={"Área DEJUR"}
									name='DejurAreaIds'
									multiple
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='CircularizationConfiguration'/>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
