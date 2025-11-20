import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { DateField, SelectField} from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { usePagination } from 'src/hooks/pagination';
import { rejectNoValues } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import { getLoadingCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';

const processingStatusesAsOptions = [
	{ label: 'Solicitado', value: 0 },
	{ label: 'Processando', value: 1 },
	{ label: 'Concluído', value: 2 },
	{ label: 'Concluído com Erros', value: 3 },
	{ label: 'Erro Legal One', value: 4 },
	{ label: 'Cancelado', value: 5 }
]

const Search = () => {

	const dispatch = useDispatch();
	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingCircularizationBaseGenerationHeader);

	const initialValues: any = {
		ProcessingStatuses: 3,
		CreatedDate: null
	}

	const onSubmit = (values: any) => {
		const result = rejectNoValues({ pageSize, ...values})
		dispatch(actions.ApprovationFlowManagement.setFilters(result));
	};

	return (
		<Panel title={"Buscar Contabilização"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<SelectField
									options={processingStatusesAsOptions}
									label={"Status"}
									name='ProcessingStatuses'
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={"Data Contabilização"}
									name="CreatedDate"
									views={['year', 'month', 'date']}
									format="DD-MM-YYYY"
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount } submitting={isSubmitting} />
							</Grid>
						</Grid>
						 <Clean action='ApprovationFlowManagement'/> 
						{!loading && isSubmitting && setSubmitting(false)} 
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
