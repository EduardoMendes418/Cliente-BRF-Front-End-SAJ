import { Formik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { Grid } from "@material-ui/core"

import Panel from "src/components/Panel"
import { SelectField, TextField } from "src/components/form"
import { Clean, Submit } from "src/components/button"
import { getLoadingLegalDocReqTypes } from "src/core/store/modules/legal-document-request-types/selectors"
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import { legalDocFormTypeOptions } from "../../utils/constants"

const initialValues = {
	name: "",
	formType: ""
}

type TForm = typeof initialValues

const Search = () => {
	const dispatch = useDispatch<AppDispatch>()

	const isLoading = useSelector(getLoadingLegalDocReqTypes)

	const onSubmit = (values: TForm) => dispatch(actions.legalDocReqTypes.setFilters(values))

	return (
		<Panel title={t('legalDocs:requestTypes.title')} withPadding>
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
									label={t('legalDocs:requestTypes.field.requestType')}
									name='name'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('legalDocs:requestTypes.field.form')}
									name="formType"
									options={legalDocFormTypeOptions}
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
								<Clean action="legalDocReqTypes"/>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search