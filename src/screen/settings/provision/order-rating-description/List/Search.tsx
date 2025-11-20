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
import { TOrderRatingDescriptionFilter } from 'src/core/models/order-rating-description'

import { getListFiltersOrderRatingDescription, getLoadingOrderRatingDescription } from 'src/core/store/modules/order-rating-description/selectors'
import { fetchByNameOrderRatingDescription } from 'src/core/store/modules/order-rating-description/thunks';

const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()

	const loading = useSelector(getLoadingOrderRatingDescription)
	const savedFilters = useSelector(getListFiltersOrderRatingDescription)

	const onSubmit = ({ ...values }: TOrderRatingDescriptionFilter, { setSubmitting }: FormikHelpers<TOrderRatingDescriptionFilter>) => {
		const filter = rejectNoValues({ ...values, page, pageSize })
		dispatch(actions.orderRatingDescription.setFilters(filter))
		dispatch(fetchByNameOrderRatingDescription({ ...values, page, pageSize }))
		setSubmitting(false)
	}

	const initialValues: TOrderRatingDescriptionFilter = {
		partName: '',
		...(savedFilters ?? {})
	};

	return (
		<Panel title={t('provisions:orderRatingDescription.listTitle')} withPadding>
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
									label={t('provisions:orderRatingDescription.title')}
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
									action='orderRatingDescription'
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