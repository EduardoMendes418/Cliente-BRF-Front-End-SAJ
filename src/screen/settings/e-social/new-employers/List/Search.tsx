import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Box, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { SelectField, TOptionsSelect } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { TSearchTable } from 'src/core/models/e-social-tables';
import { useClosingOptions } from 'src/hooks/useProcessFilterOptions';
import { getListFiltersESocialClosureEmployer, getLoadingESocialClosureEmployer } from 'src/core/store/modules/e-social-new-employers/selectors';
import { useEffect } from 'react';
import { fetchESocialClosureEmployer } from 'src/core/store/modules/e-social-new-employers/thunks';

const Search = () => {

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const filters = useSelector(getListFiltersESocialClosureEmployer);
	const { pageSize, page } = usePagination();

	const closingOptions = useClosingOptions()

	const loading = useSelector(getLoadingESocialClosureEmployer)
	
	const onSubmit = (values: TSearchTable) => {
		const result = rejectNoValues({ pageSize, ...values, })
		dispatch(actions.eSocialClosure.setFilters(result)); 
	};

	const initialValues = {
		closureId: null,
		page: 1
	}

	const sortLabels = (x: TOptionsSelect, y: TOptionsSelect) => {
			return x.label?.localeCompare(y.label ?? "")
		}

	useEffect(()=> {
		dispatch(fetchESocialClosureEmployer({ page, pageSize, ...filters }));
	}, [dispatch])

	return (
		<Panel title={"Buscar empregadores"} withPadding>
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
									label={t('dataImport:processSheet.form.closing')}
									name="closureId"
									options={closingOptions?.slice().sort(sortLabels)}
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Clean action='eSocialClosure'/>
									<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting}/>
								</Box>
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
