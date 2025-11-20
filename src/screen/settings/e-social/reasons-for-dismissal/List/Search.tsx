import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { TSearchTable } from 'src/core/models/e-social-tables';
import { getListFiltersESocialReasonsForDismissal, getLoadingESocialReasonsForDismissal } from 'src/core/store/modules/e-social-reasons-for-dismissal/selectors';

const Search = () => {
	 const dispatch = useDispatch();
	const { t } = useTranslation();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingESocialReasonsForDismissal)
	const savedFilters = useSelector(getListFiltersESocialReasonsForDismissal);

	const onSubmit = (values: TSearchTable) => {
		const result = rejectNoValues({ pageSize, ...values, })
		dispatch(actions.eSocialReasonsForDismissal.setFilters(result));
	}; 

	 const initialValues = {
		description: '',
		...(savedFilters ?? {})
	} 

	return (
		<Panel title={t('eSocial:reasonsForDismissal.searchTitle')} withPadding>
			 <Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						 <Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('eSocial:workerCategory.filter.description')}
									name='description'
									maxLength={100}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting}/>
							</Grid>
						</Grid>
						<Clean action='eSocialReasonsForDismissal'/>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik> 
		</Panel>
	);
};

export default Search;
