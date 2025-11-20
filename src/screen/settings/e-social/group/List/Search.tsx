import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { NumericField, TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { getListFiltersESocialGroup, getLoadingESocialGroup } from 'src/core/store/modules/e-social-group/selectors';
import { TSearchGroup } from 'src/core/models/e-social-tables';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingESocialGroup)
	const savedFilters = useSelector(getListFiltersESocialGroup);

	const onSubmit = (values: TSearchGroup) => {
		const result = rejectNoValues({ pageSize, ...values, })
		dispatch(actions.eSocialGroup.setFilters(result));
	};

	const initialValues: TSearchGroup = {
		id: '',
		description: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t('eSocial:eSocialGroup.searchTitle')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<NumericField
									label={"Id"}
									name={'id'}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('eSocial:eSocialTables.filter.description')}
									name={'description'}
									maxLength={100}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='eSocialTables'/>
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
