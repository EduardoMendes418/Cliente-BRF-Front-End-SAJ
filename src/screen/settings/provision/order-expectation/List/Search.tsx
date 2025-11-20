import { Formik, FormikHelpers } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form'
import { Submit, Clean } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { actions } from 'src/core/store'
import { rejectNoValues } from 'src/core/utils/func'
import { TOrderExpectationFilter } from 'src/core/models/order-expectation'
import { getListFiltersOrderExpectation, getLoadingOrderExpectation } from 'src/core/store/modules/order-expectation/selectors';


const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()

	const loading = useSelector(getLoadingOrderExpectation)
	const savedFilters = useSelector(getListFiltersOrderExpectation)

	const onSubmit = ({ ...values }: TOrderExpectationFilter, { setSubmitting }: FormikHelpers<TOrderExpectationFilter>) => {
		const filter = rejectNoValues({ ...values, page, pageSize })
		dispatch(actions.orderExpectation.setFilters(filter))
		setSubmitting(false)
	}

	const initialValues: TOrderExpectationFilter = {
		partName: '',
		...(savedFilters ?? {})
	};

	return (
		<Panel title={t('provisions:orderExpectation.listTitle')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('provisions:orderExpectation.title')}
									name='partName'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Submit
									type='search'
									disabled={isSubmitting}
									submitting={loading || isSubmitting}
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<Clean
									action='orderExpectation'
								/>
							</Grid>
						</Grid>
					</form>
				)}

			</Formik>
		</Panel>

	);
};

export default Search;