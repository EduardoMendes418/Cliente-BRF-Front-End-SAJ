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
import { TOrderStatusFilter } from 'src/core/models/order-status'
import { getLoadingOrderStatus } from 'src/core/store/modules/order-status/selectors';
import { getListFiltersOrderDescription, getErrorMessageOrderDescription } from 'src/core/store/modules/order-description/selectors';

const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()
	const loading = useSelector(getLoadingOrderStatus)
	const savedFilters = useSelector(getListFiltersOrderDescription)

	const onSubmit = ({ ...values }: TOrderStatusFilter, { setSubmitting }: FormikHelpers<TOrderStatusFilter>) => {
		const filter = rejectNoValues({ ...values, page, pageSize })
		dispatch(actions.orderStatus.setFilters(filter))
		setSubmitting(false)
	}

	const initialValues: TOrderStatusFilter = {
		partName: '',
		...(savedFilters ?? {})
	};

	return (
		<Panel title={t('provisions:orderStatus.listTitle')} withPadding>
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
									label={t('provisions:orderStatus.statusField')}
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
									action='orderStatus'
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