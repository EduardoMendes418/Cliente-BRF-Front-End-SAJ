import { useCallback, useState } from 'react';
import { useDispatch } from "react-redux";
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';
import moment from 'moment';
import FileSaver from 'file-saver';
import { useSnackbar } from 'notistack';

import ScreenTemplate from "src/components/Screen";
import Panel from 'src/components/Panel';
import { TDIRF } from 'src/core/models/payment';
import { Submit } from 'src/components/button';
import { NumericField, DateField, TextField } from 'src/components/form';
import CPFField from 'src/screen/payment/DIRF/components/CPFField';
import { AppDispatch } from 'src/core/store';
import { fetchExportDirfDecFile } from "src/core/store/modules/report/thunks";

const DIRF = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false)
	const { enqueueSnackbar } = useSnackbar()

	const initialValues: TDIRF = {
		anoCalendario: '',
		cpf: '',
		nome: '',
		telefoneDDD: '',
		telefone: '',
		telefoneRamal: '',
		corpCeoCPF: '',
	}


	const onSubmit = useCallback(async (values: TDIRF, { setSubmitting }: FormikHelpers<TDIRF>) => {
		const finalValues = {
			...values,
			cpf: values.cpf.replace(/^\D+/g, ''),
			corpCeoCPF: values.corpCeoCPF.replace(/^\D+/g, ''),
			anoCalendario: Number(moment(values.anoCalendario).format("yyyy")),
			telefoneDDD: Number(values.telefoneDDD),
			telefone: Number(values.telefone),
			telefoneRamal: Number(values.telefoneRamal),
		}
		setSubmitting(false)
		setIsLoading(true);
		const { payload, type } = await dispatch(fetchExportDirfDecFile(finalValues))
		setIsLoading(false);

		if (type === 'report/fetchExportDirfDecFile') {
			const hasErrorMessage = typeof payload === 'string'
			enqueueSnackbar(hasErrorMessage ? payload : t('anErrorHasOcurred'), { variant: 'error' })
			return
		}

		FileSaver.saveAs(payload as Blob, `ExportDirfDecFile-${moment().format()}.DEC`)
	}, [dispatch, enqueueSnackbar, t])

	return (
		<ScreenTemplate>
			<Panel title={t('Pagamentos:DIRF.title')} withPadding>
				<Formik
					onSubmit={onSubmit}
					initialValues={initialValues}
					enableReinitialize
				>
					{({ handleSubmit, setSubmitting, isSubmitting, dirty }) => (
						<form onSubmit={handleSubmit} noValidate>
							<Grid container spacing={2} alignItems='flex-start'>
								<Grid item xs={12} md={3}>
									<DateField
										name='anoCalendario'
										label={t('Pagamentos:DIRF.anoCalendario')}
										views={['year']}
										format='yyyy'
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name='nome'
										label={t('Pagamentos:DIRF.nome')}
										maxLength={60}
										required
									/>
								</Grid>
								<CPFField />
								<Grid item xs={12} md={3}>
									<NumericField
										required
										name='telefoneDDD'
										maxLength={2}
										label={t('Pagamentos:DIRF.telefoneDDD')}
										placeholder={t('form.typeHere')}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<NumericField
										required
										name='telefone'
										maxLength={9}
										label={t('Pagamentos:DIRF.telefone')}
										placeholder={t('form.typeHere')}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<NumericField
										name='telefoneRamal'
										maxLength={2}
										label={t('Pagamentos:DIRF.telefoneRamal')}
										placeholder={t('form.typeHere')}
									/>
								</Grid>
								<CPFField
									name='corpCeoCPF'
									label={t('Pagamentos:DIRF.corpCeoCPF')}
									verifyContacts={false}
								/>
								<Grid item xs={2}>
									<Submit
										type="search"
										disabled={isLoading}
										submitting={isLoading}

									/>
								</Grid>
							</Grid>
						</form>
					)}
				</Formik>
			</Panel>
		</ScreenTemplate>
	);
}
export default DIRF;