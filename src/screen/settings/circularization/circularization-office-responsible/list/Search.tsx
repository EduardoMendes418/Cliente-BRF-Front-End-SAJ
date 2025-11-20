import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { rejectNoValues } from 'src/core/utils/func';
import { useEffect } from 'react';
import { fetchAreas } from 'src/core/store/modules/areas/thunks';
import { getLoadingCircularizationOfficeResponsibleConfiguration } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/selector';
import { fetchCircularizationOfficeResponsibleConfiguration } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/thunks';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';
import { useGroupedAreas, useGroupedAreasById } from 'src/hooks/fetchLists';
import { useTranslation } from 'react-i18next';
import { t } from 'src/locale/i18n';

const Search = () => {

	const dispatch = useDispatch();
	
	const { pageSize, page } = usePagination();
	const loading = useSelector(getLoadingCircularizationOfficeResponsibleConfiguration);

	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const { groupedAreasAsOptions} = useGroupedAreas();


	const onSubmit = async (values: any) => {
		const result = rejectNoValues({ pageSize, ...values, })
		await dispatch(fetchCircularizationOfficeResponsibleConfiguration(result)) as any;
	};

	const initialValues: any = {
		officeId: "",
		dejurAreaId: null
	}

	useEffect(() => {
		dispatch(fetchAreas(38)); 
	}, [dispatch])

	return (
		<Panel title={"Responsáveis escritório"} withPadding>
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
									options={groupedAreasByIdAsOptions}
									label={"Escritório"}
									name='officeId'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									name="dejurAreaId"
									label={t("legalDocs:smartSwap.dejurAreaId")}
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='CircularizationOfficeResponsibleConfiguration' onClick={() => dispatch(fetchCircularizationOfficeResponsibleConfiguration({ page, pageSize}))}/>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
