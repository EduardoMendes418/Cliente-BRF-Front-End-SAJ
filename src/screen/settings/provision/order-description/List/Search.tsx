import { Formik, FormikHelpers } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel'
import { TextField, SelectField } from 'src/components/form'
import { Submit, Clean } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { useGroupedAreas } from 'src/hooks/fetchLists'
import { actions } from 'src/core/store'
import { TOrderDescriptionFilter } from 'src/core/models/order-description'
import { rejectNoValues } from 'src/core/utils/func'

import { getListFiltersOrderDescription, getLoadingOrderDescription } from 'src/core/store/modules/order-description/selectors'
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()
	const { groupedAreasAsOptions} = useGroupedAreas();

	const loading = useSelector(getLoadingOrderDescription)
	const savedFilters = useSelector(getListFiltersOrderDescription)

	const onSubmit = ({ ...values }: TOrderDescriptionFilter, { setSubmitting }: FormikHelpers<TOrderDescriptionFilter>) => {
		const filter = rejectNoValues({ ...values, page, pageSize })
		dispatch(actions.orderDescription.setFilters(filter))
		setSubmitting(false)
	}

	const initialValues: TOrderDescriptionFilter = {
		partName: '',
		areaId: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t('provisions:orderDescription.title')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('provisions:orderDescription.areaDejur')}
									name='areaId'
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('provisions:orderDescription.title')}
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
									action='orderDescription'
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