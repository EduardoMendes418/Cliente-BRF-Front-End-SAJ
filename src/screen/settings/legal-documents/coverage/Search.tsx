import { Formik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { Grid } from "@material-ui/core"

import Panel from "src/components/Panel"
import { TextField } from "src/components/form"
import { Clean, Submit } from "src/components/button"
import { getLoadingLegalDocCoverage } from "src/core/store/modules/legal-document-coverages/selectors"
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

const initialValues = { name: "" }

type TForm = typeof initialValues

const Search = () => {
	const dispatch = useDispatch<AppDispatch>()

	const isLoading = useSelector(getLoadingLegalDocCoverage)

	const onSubmit = (values: TForm) => dispatch(actions.legalDocCoverage.setFilters(values))

	return (
		<Panel title={t('legalDocs:coverage.listTitle')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('legalDocs:coverage.title')}
									name='name'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Submit
									type="search"
									disabled={isLoading}
									submitting={isLoading}
								/>
							</Grid>
							<Grid container item md={12} xs={12} justifyContent="space-between" alignItems="center">
								<Clean action="legalDocCoverage"/>
								
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search