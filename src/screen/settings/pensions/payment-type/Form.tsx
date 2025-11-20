import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import Grid from '@material-ui/core/Grid';

import Form, { SelectField, RadioGroup, AutocompleteField } from 'src/components/form'
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { t, useTranslation } from 'src/locale/i18n';

import {
	addPaymentType,
	editPaymentType,
} from 'src/core/store/modules/payment-type/thunks';
import { getSavingPaymentType, getLoadingPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { AppDispatch } from 'src/core/store';
import { getListAsOptionPaymentMethod } from 'src/core/store/modules/payment-method/selectors';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { TPaymentType } from 'src/core/models/payment-type';
import { Modulos } from 'src/core/models/modules';
import {
	useActionTipoPagamento,
	useTipoPagamentoInitialValues,
} from 'src/hooks/paymentType';
import { numberValidator } from 'src/core/utils/yup-validations';
import { useFinanceChartOfAccountsCategories } from 'src/hooks/fetchLists';
import { approvalProcessTypeOption } from "src/core/utils/constants"

import {
	abaterSaldoProvisaoOptions,
	optionsGenerateGuidesFiles,
} from '../../constants'

const validationSchema = yup.object({
	financeChartOfAccountsCategoryId: numberValidator,
	formasPagamentoIds: yup
		.array()
		.of(yup.number())
		.min(1, t('required'))
		.required(t('required')),
	solicitarPagamentoBaixaProvisoria: yup.bool().required(t('required')),
	cancelamentoAutomatico: yup.bool().required(t('required')),
	abaterSaldoProvisao: yup.number().required(t('required')),
	gerarBensGarantias: yup.bool().required(t('required')),
	alterarStatusProcesso: yup.bool().required(t('required')),
	generateGuideFiles: yup.number(),
	gerarCalculoPagamento: yup.bool().required(t('required')),
	contabilizarPagamentoSap: yup.bool().required(t('required')),
	importarDados: yup.bool().required(t('required')),
	disponibilizarComprovantePagamento: yup.bool().required(t('required')),
	contabilizarCreditoSap: yup.bool().required(t('required')),
});

const PaymentTypeForm = () => {
	useActionTipoPagamento(
		Modulos.Pension,
		'/configuracoes/pensoes/tipo-pagamento'
	);
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const initialValues = useTipoPagamentoInitialValues(Modulos.Pension);
	const isFetching = useSelector(getLoadingPaymentType);
	const formaPagamentoOptions = useSelector(getListAsOptionPaymentMethod);
	const isSubmitting = useSelector(getSavingPaymentType);

	const isNew = id === 'novo';

	const {
		financeChartOfAccountsCategoriesAsOptions,
		isFinanceChartOfAccountsCategoriesLoading
	} = useFinanceChartOfAccountsCategories(Modulos.Pension, initialValues.financeChartOfAccountsCategory);

	useEffect(() => {
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pension }));
	}, [dispatch]);

	const title = t(isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao', {
		title: t('Pagamentos:tipoPagamento').toLowerCase(),
	});

	const onSubmit = (form: TPaymentType) => {
		if (isNew) {
			dispatch(addPaymentType({ ...form, moduloId: Modulos.Pension }));
		} else {
			const values = { ...form, id: Number(id), moduloId: Modulos.Pension };
			dispatch(editPaymentType({ id: Number(id), values }));
		}
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={title}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<AutocompleteField
											label={t('Pagamentos:tipoPagamento')}
											name='financeChartOfAccountsCategoryId'
											options={financeChartOfAccountsCategoriesAsOptions}
											loading={isFinanceChartOfAccountsCategoriesLoading}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('Pagamentos:formaPagamento_plural')}
											name='formasPagamentoIds'
											required
											multiple
											options={formaPagamentoOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name="processType"
											label={t('Pagamentos:tipoPagamentoForm.processType')}
											placeholder={t('form.typeHere')}
											required
											options={approvalProcessTypeOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.solicitarPagamentoBaixaProvisoria'
											)}
											name='solicitarPagamentoBaixaProvisoria'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.cancelamentoAutomatico'
											)}
											name='cancelamentoAutomatico'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.abaterSaldoProvisao'
											)}
											name='abaterSaldoProvisao'
											options={abaterSaldoProvisaoOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.gerarBensGarantias'
											)}
											name='gerarBensGarantias'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.alterarStatusProcesso'
											)}
											name='alterarStatusProcesso'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('Pagamentos:tipoPagamentoForm.generateGuidesFiles')}
											name='generateGuideFiles'
											options={optionsGenerateGuidesFiles}
											number
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.gerarCalculoPagamento'
											)}
											name='gerarCalculoPagamento'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t('Pagamentos:tipoPagamentoForm.contabilizarPagamentoSap')}
											name='contabilizarPagamentoSap'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t('Pagamentos:tipoPagamentoForm.importarDados')}
											name='importarDados'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.disponibilizarComprovantePagamento'
											)}
											name='disponibilizarComprovantePagamento'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t(
												'Pagamentos:tipoPagamentoForm.contabilizarCreditoSap'
											)}
											name='contabilizarCreditoSap'
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

export default PaymentTypeForm;
