import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { NumericField } from 'src/components/form';
import SearchInfo from 'src/components/SearchInfo';
import { Clean, Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { getProcessStatus } from 'src/core/store/modules/process/selectors'
import { getFiltersAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/selectors';

const Search = ({ loading }: { loading: boolean }) => {

	const { t } = useTranslation()

	const dispatch = useDispatch();
	const closed = useSelector(getProcessStatus)
	const savedFilters = useSelector(getFiltersAgreementAuthorization)

	const onSubmit = ({ folderNumber }: { folderNumber: string }, { setSubmitting }: any) => {
		dispatch(actions.agreementAuthorization.setFilters({ folderNumber }));
		setSubmitting(false)
	}

	const initialValues = { folderNumber: savedFilters?.folderNumber ?? '' }

	return (
		<Panel title={t('Pagamentos:agreementAuthorization.title')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={10} md={3}>
								<NumericField
									required
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={2}>
								<Submit type="search" disabled={!dirty} submitting={loading} />
							</Grid>
						</Grid>
						<Clean action='agreementAuthorization' />
					</form>
				)
				}
			</Formik>
			<SearchInfo closed={closed} />
		</Panel>
	)
}

export default Search