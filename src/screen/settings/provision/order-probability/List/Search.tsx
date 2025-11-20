import { Formik, FormikHelpers } from 'formik';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField } from 'src/components/form'
import { Submit, Clean } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { actions } from 'src/core/store'
import { rejectNoValues } from 'src/core/utils/func'
import { TOrderProbabilityFilter } from 'src/core/models/order-probability'
import { getListFiltersOrderProbability, getLoadingOrderProbability } from 'src/core/store/modules/order-probability/selectors';
import { fetchByNameOrderProbability } from 'src/core/store/modules/order-probability/thunks';


const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()

	const loading = useSelector(getLoadingOrderProbability)
	const savedFilters = useSelector(getListFiltersOrderProbability)

	const onSubmit = ({ ...values }: TOrderProbabilityFilter, { setSubmitting }: FormikHelpers<TOrderProbabilityFilter>) => {
		const filter = rejectNoValues({ ...values, page, pageSize })
		dispatch(actions.orderProbability.setFilters(filter))
		dispatch(fetchByNameOrderProbability({ ...values, page, pageSize }))
		setSubmitting(false)
	}

	const initialValues: TOrderProbabilityFilter = {
		partName: '',
		...(savedFilters ?? {})
	};

	return (
		<Panel title={t('provisions:orderProbability.listTitle')} withPadding>
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
									label={t('provisions:orderProbability.title')}
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
									action='orderProbability'
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