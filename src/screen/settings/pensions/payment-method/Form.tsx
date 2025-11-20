import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import Grid from '@material-ui/core/Grid';

import Form, { TextField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import { Submit } from 'src/components/button';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';

import {
	addPaymentMethod,
	editPaymentMethod,
} from 'src/core/store/modules/payment-method/thunks';
import {
	getLoadingPaymentMethod,
	getSavingPaymentMethod,
	getStatusPaymentMethod,
} from 'src/core/store/modules/payment-method/selectors';
import { AppDispatch } from 'src/core/store';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { Modulos } from 'src/core/models/modules';
import { textValidator } from 'src/core/utils/yup-validations';
import {
	useActionFormaPagamento,
	useFormaPagamentoInitialValues,
} from 'src/hooks/paymentMethod';

const validationSchema = yup.object({
	descricao: textValidator,
});

const PaymentMethodForm = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();

	useActionFormaPagamento(Modulos.Pension, '/configuracoes/pensoes/forma-pagamento');

	const initialValues = useFormaPagamentoInitialValues(Modulos.Pension);
	const isFetching = useSelector(getLoadingPaymentMethod);
	const statusSubmit = useSelector(getStatusPaymentMethod);
	const isSubmitting = useSelector(getSavingPaymentMethod);

	const isNew = id === 'novo';
	const title = t(isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao', {
		title: t('Pagamentos:formaPagamento').toLowerCase(),
	});

	const handleSubmit = (form: TPaymentMethod) => {
		if (isNew) {
			dispatch(addPaymentMethod({ ...form, moduloId: Modulos.Pension }));
		} else {
			const values = { ...form, id: Number(id), moduloId: Modulos.Pension };
			dispatch(editPaymentMethod({ id, values }));
		}
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={title}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('Pagamentos:formaPagamento')}
											name='descricao'
											inputProps={{ maxLength: 200 }}
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default PaymentMethodForm;
