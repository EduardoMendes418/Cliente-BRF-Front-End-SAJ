import { Grid, CircularProgress } from '@material-ui/core';
import * as yup from 'yup';
import { t, useTranslation } from 'src/locale/i18n';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Form, { SelectField, RadioGroup, AutocompleteField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import {
	addPaymentType,
	editPaymentType,
} from 'src/core/store/modules/payment-type/thunks';
import { getLoadingPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { AppDispatch } from 'src/core/store';
import {
	useActionTipoPagamento,
	useTipoPagamentoInitialValues,
} from 'src/hooks/paymentType';
import { TPaymentType } from 'src/core/models/payment-type';
import { Modulos } from 'src/core/models/modules';
import { useFinanceChartOfAccountsCategories, usePaymentMethod } from 'src/hooks/fetchLists';
import { numberValidator } from 'src/core/utils/yup-validations';
import {
	abaterSaldoProvisaoOptions,
	optionsGenerateGuidesFiles,
} from '../../../constants';

import ExceptionRulesForm from './ExceptionRules'
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import {approvalProcessTypeOption} from "src/core/utils/constants";

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
	contabilizarCcPorAreaDejur: yup.bool().required(t('required')),
});

const TipoPagamentoForm = () => {
	useActionTipoPagamento(
		Modulos.Pagamento,
		'/configuracoes/pagamentos/tipo-pagamento'
	);
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { resultsAsOptions } = useProcessFilterOptions();
	const { id } = useParams<{ id: string }>();
	const initialValues = useTipoPagamentoInitialValues(Modulos.Pagamento);
	const isFetching = useSelector(getLoadingPaymentType);

	const { paymentMethodAsOptions } = usePaymentMethod(Modulos.Pagamento)
	const {
		financeChartOfAccountsCategoriesAsOptions,
		isFinanceChartOfAccountsCategoriesLoading
	} = useFinanceChartOfAccountsCategories(Modulos.Pagamento, initialValues.financeChartOfAccountsCategory);

	const isNew = id === 'novo';

	useEffect(() => {
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pagamento }))
	}, [dispatch])

	const title = [
		t(isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao', { title: t('Pagamentos:tipoPagamento').toLowerCase() }),
		t('Pagamentos:exceptionRules'),
	]

	const onSubmit = (form: TPaymentType) => {
		if (isNew) {
			dispatch(addPaymentType({ ...form, moduloId: Modulos.Pagamento }));
		} else {
			const values = { ...form, id: Number(id), moduloId: Modulos.Pagamento };
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
				{({ handleSubmit, isSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={title[0]} withPadding>
							{
								isFetching
									? <CircularProgress className='margin-top-16 align-center' />
									: (
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
													options={paymentMethodAsOptions}
													required
													multiple
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<SelectField
													label={t('Pagamentos:tipoPagamentoForm.resultProcessFolder')}
													name='resultProcessFolder'
													options={resultsAsOptions}
													number
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
												<SelectField
													label={t('Pagamentos:tipoPagamentoForm.processType')}
													name='processType'
													required
													options={approvalProcessTypeOption}
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.abaterSaldoProvisao')}
													name='abaterSaldoProvisao'
													options={abaterSaldoProvisaoOptions}
													row
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.gerarBensGarantias')}
													name='gerarBensGarantias'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.alterarStatusProcesso')}
													name='alterarStatusProcesso'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.eSocialRestriction')}
													name='eSocialRestriction'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.uploadESocialPJC')}
													name='uploadESocialPJC'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.cancelamentoAutomatico')}
													name='cancelamentoAutomatico'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t('Pagamentos:tipoPagamentoForm.gerarCalculoPagamento')}
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
													label={t('Pagamentos:tipoPagamentoForm.contabilizarCreditoSap')}
													name='contabilizarCreditoSap'
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
														'Pagamentos:tipoPagamentoForm.solicitarPagamentoBaixaProvisoria'
													)}
													name='solicitarPagamentoBaixaProvisoria'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t(
														'Pagamentos:tipoPagamentoForm.contabilizarCcPorAreaDejur'
													)}
													name='contabilizarCcPorAreaDejur'
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t(
														'Pagamentos:tipoPagamentoForm.eSocialRectification'
													)}
													name='retificacaoESocial'
												/>
											</Grid>
										</Grid>
									)
							}
						</Panel>
						{
							!isFetching && (
								<ExceptionRulesForm
									title={title[1]}
									isNew={isNew}
									disabled={!dirty}
									submitting={isSubmitting}
								/>
							)
						}
					</form>
				)
				}
			</Form>
		</ScreenTemplate>
	);
};


export default TipoPagamentoForm;
