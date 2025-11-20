import { FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';

import Form, { TextField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	addPaymentMethod,
	editPaymentMethod,
} from 'src/core/store/modules/payment-method/thunks';
import { getLoadingPaymentMethod } from 'src/core/store/modules/payment-method/selectors';
import { AppDispatch } from 'src/core/store';
import {
	useActionFormaPagamento,
	useFormaPagamentoInitialValues,
} from 'src/hooks/paymentMethod';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { Modulos } from 'src/core/models/modules';

const FormaPagamentoForm = () => {
	useActionFormaPagamento(
		Modulos.Pagamento,
		'/configuracoes/pagamentos/forma-pagamento'
	);
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const initialValues = useFormaPagamentoInitialValues(Modulos.Pagamento);
	const isFetching = useSelector(getLoadingPaymentMethod);

	const isNew = id === 'novo';

	const onSubmit = (
		form: TPaymentMethod,
		{ setSubmitting }: FormikHelpers<TPaymentMethod>,
	) => {
		if (isNew) {
			dispatch(addPaymentMethod({ ...form, moduloId: Modulos.Pagamento }));
		} else {
			const values = { ...form, id: Number(id), moduloId: Modulos.Pagamento };
			dispatch(editPaymentMethod({ id, values }));
		}
		setSubmitting(false)
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t(
								isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao',
								{
									title: t('Pagamentos:formaPagamento').toLowerCase(),
								}
							)}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('Pagamentos:formaPagamento')}
											name='descricao'
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default FormaPagamentoForm;
