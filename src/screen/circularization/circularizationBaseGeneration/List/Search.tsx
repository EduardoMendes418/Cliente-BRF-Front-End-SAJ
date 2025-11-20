import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { DateField, SelectField} from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { usePagination } from 'src/hooks/pagination';
import { useAreasResponsibleByUserIdPath, useGroupedAreas, useGroupedAreasById } from 'src/hooks/fetchLists';
import { rejectNoValues } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import { getLoadingCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';
import { useCurrentUser } from "src/config/permissions";
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

export const optionsContingencyType = [
	{ value: "Ativa", label: 'Ativa' },
	{ value: "Passiva", label: 'Passiva' },
	{ value: "Sem Contingência", label: 'Sem Contingência' }
]

const Search = () => {
	const dispatch = useDispatch();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingCircularizationBaseGenerationHeader);
	const { groupedAreasAsOptions } = useGroupedAreas();
	const { userId } = useCurrentUser("");

	const initialValues: any = {
		DejurAreaIds: [],
		FolderNumber: '',
		Contingencies: [],
		CircularizationDate: null,
		OfficeIds: []
	}

	const onSubmit = (values: any) => {
		const result = rejectNoValues({ pageSize, ...values})
		dispatch(actions.CircularizationBaseGenerationHeader.setFilters(result));
	};

	const { groupedAreasByIdAsOptions } = useGroupedAreasById();

	return (
		<Panel title={"Buscar Circularização"} withPadding>
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
							<Grid item xs={12} md={3}>
								<DateField
									label={"Mês da competência"}
									name="CircularizationDate"
									views={['year', 'month']}
									provisionReport={true}
									format="MM-YYYY"
								/>
							</Grid>
								<Grid item md={3} xs={12}>
										<SelectField
											label={"Tipo da Contingência"}
											name='Contingencies'
											options={optionsContingencyType}
											multiple
										/>
									</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={"Escritório"}
										name="OfficeIds"
										options={groupedAreasByIdAsOptions}
										multiple
									/>
								</Grid>		
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount } submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='CircularizationBaseGenerationHeader'/>
						{!loading && isSubmitting && setSubmitting(false)} 
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
