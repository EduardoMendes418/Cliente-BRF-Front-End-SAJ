import { Formik } from 'formik';
import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Submit } from 'src/components/button';
import Panel from 'src/components/Panel';
import SearchInfo from 'src/components/SearchInfo';
import { NumericField, SelectField } from 'src/components/form';

import { useTranslation } from 'src/locale/i18n';
import { getItemAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/selectors';
import {
	getProcessError,
	getProcessStatus
} from 'src/core/store/modules/process/selectors'
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { Modulos } from 'src/core/models/modules';
import {
	getLoadingPaymentType,
	getPaymentTypeWithExceptionRulesAsOptions,
} from 'src/core/store/modules/payment-type/selectors';
import { actions } from 'src/core/store';

type TSearch = {
	loading: boolean;
	disabled: boolean;
	readOnly: boolean;
}

const Search = ({ loading, disabled, readOnly }: TSearch) => {

	const { t } = useTranslation()
	const dispatch = useDispatch();

	const item = useSelector(getItemAgreementAuthorization)

	const closed = useSelector(getProcessStatus)
	const error = useSelector(getProcessError)

	const options = useSelector(getPaymentTypeWithExceptionRulesAsOptions)
	const loadingPaymentType = useSelector(getLoadingPaymentType)

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
	}, [dispatch])

	const onSubmit = (item: { folderNumber: string, paymentTypeId: number }, { setSubmitting }: any) => {
		dispatch(actions.agreementAuthorization.setItem(item));
		dispatch(fetchProcessFolder({ folderNumber: item.folderNumber }))
		setSubmitting(false)
	}

	const initialValues = {
		folderNumber: item.folderNumber ?? '',
		paymentTypeId: item.paymentTypeId ?? ''
	}

	return (
		<Panel title={t('Pagamentos:agreementAuthorization.title')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3}>
								<NumericField
									required
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
									disabled={loading || disabled}
									readOnly={readOnly}
								/>
							</Grid>
							<Grid item md={3}>
								<SelectField
									required
									name='paymentTypeId'
									label={t('Pagamentos:tipoPagamento')}
									options={options}
									disabled={loading || disabled}
									readOnly={readOnly}
								/>
							</Grid>
							{!readOnly && (
								<Grid item xs={2}>
									<Submit type="search" disabled={!dirty || disabled} submitting={loading || loadingPaymentType} />
								</Grid>
							)}
						</Grid>
					</form>
				)}
			</Formik>
			{
				!loading && !loadingPaymentType && (
					<SearchInfo
						closed={closed}
						error={!options.length ? 'Nenhuma regra de exceção cadastrada' : error}
					/>
				)
			}
		</Panel>
	)
}

export default Search
