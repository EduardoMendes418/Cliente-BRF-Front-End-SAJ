import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Box, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { TSearchTable } from 'src/core/models/e-social-tables';
import { getListFiltersESocialWorkerCategory, getLoadingESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/selectors';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingESocialWorkerCategory)
	const savedFilters = useSelector(getListFiltersESocialWorkerCategory);

	const onSubmit = (values: TSearchTable) => {
		const result = rejectNoValues({ pageSize, ...values, })
		dispatch(actions.eSocialWorkerCategory.setFilters(result));
	};

	const initialValues = {
		eSocialTableDescription: '',
		code: '',
		eSocialGroupDescription: '',
		description: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t('eSocial:workerCategory.searchTitle')} withPadding>
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
									label={t('eSocial:workerCategory.filter.eSocialTableDescription')}
									name='eSocialTableDescription'
									maxLength={20}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('eSocial:workerCategory.filter.description')}
									name='description'
									maxLength={100}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('eSocial:workerCategory.filter.eSocialGroupDescription')}
									name='eSocialGroupDescription'
									maxLength={20}
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Clean action='eSocialWorkerCategory'/>
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
