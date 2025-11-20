import { Formik, FormikHelpers } from 'formik'
import { Grid } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import Panel from 'src/components/Panel'
import { TextField } from 'src/components/form'
import { Submit, Clean } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n'
import { usePagination } from 'src/hooks/pagination'
import { actions } from 'src/core/store'
import { TGuaranteeDescription } from 'src/core/models/guarantee-type'
import { rejectNoValues } from 'src/core/utils/func'

const initialValues: TGuaranteeDescription = {
	description: ''
}

const Search = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()

	const onSubmit = ({ description }: TGuaranteeDescription, { setSubmitting }: FormikHelpers<TGuaranteeDescription>) => {
		const filter = rejectNoValues({ page, pageSize, description })
		dispatch(actions.guaranteeType.setFilters(filter))
		setSubmitting(false)
	}

	const cleanHandler = () => {
		const filter = rejectNoValues({page, pageSize})
		dispatch(actions.guaranteeType.setFilters(filter))
	}

	return (
		<Panel title={t('goodsAndGuarantees:guaranteeType.listtitle')} withPadding>
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
									label={t('goodsAndGuarantees:guaranteeType.title')}
									name='description'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Submit
									type='search'
									disabled={isSubmitting}
									submitting={isSubmitting}
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								<Clean onClick={cleanHandler} />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search
