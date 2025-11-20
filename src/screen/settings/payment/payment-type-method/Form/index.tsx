import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { t, useTranslation } from 'src/locale/i18n';
import Grid from '@material-ui/core/Grid';
import * as yup from 'yup';

import {
	useActionRelacaoTipoFormaPagamento,
	useRelacaoTipoFormaPagamentoInitialValues,
} from 'src/hooks/paymentTypeMethod';
import { useDispatch, useSelector } from 'react-redux';
import {
	getLoadingPaymentTypeMethod,
	getListPaymentTypeMethod,
} from 'src/core/store/modules/payment-type-method/selectors';
import { AppDispatch } from 'src/core/store';
import { useParams } from 'react-router-dom';
import Form, { SelectField } from 'src/components/form';
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { ChangeEvent, useState } from 'react';
import {
	addPaymentTypeMethod,
	editPaymentTypeMethod,
} from 'src/core/store/modules/payment-type-method/thunks';
import { TPaymentTypeMethod } from 'src/core/models/payment-type-method';

import RelacaoTipoFormaPagamentoTable from './table';
import { Submit } from 'src/components/button';

const validationSchema = yup.object({
	tipoPagamentoId: yup.number().required(t('required')),
	tipoPagamentoDescricao: yup.string(),
	formaPagamentos: yup.array().of(
		yup.object({
			formaPagamentoId: yup.number().required(t('required')),
			formaPagamentoDescricao: yup.string(),
			formulario: yup.string().nullable(),
		})
	),
});

type TTable = {
	formulario: string | null
}

const validate = (table: TTable[]) => (values: TPaymentTypeMethod) => {
	const error: { formaPagamentos: { formulario?: string }[] } = { formaPagamentos: [] }
	table.forEach((_, i: number) => {
		if (!values.formaPagamentos[i]?.formulario || values.formaPagamentos[i].formulario === 'NULL') {
			error.formaPagamentos[i] = { formulario: t('required') }
		}
	});

	return error.formaPagamentos.length ? error : {}
}

const RelacaoTipoFormaPagamentoForm = () => {
	useActionRelacaoTipoFormaPagamento();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const initialValues = useRelacaoTipoFormaPagamentoInitialValues();
	const [table, setTable] = useState(initialValues.formaPagamentos);
	const isFetching = useSelector(getLoadingPaymentTypeMethod);
	const list = useSelector(getListPaymentTypeMethod);

	const optionsTiposPagamento = useSelector(getListAsOptionPaymentType);

	const isNew = id === 'novo';

	const handleChangeTipoPagamento = (
		event: ChangeEvent<{
			value: unknown;
		}>
	) => {
		if (!isNew) return;
		const { value } = event.target;
		const item = list.find((fp) => fp.tipoPagamentoId === value);
		if (item) setTable(item.formaPagamentos);
	};

	const onSubmit = (form: any) => {
		if (isNew) {
			dispatch(addPaymentTypeMethod(form));
		} else {
			const values = { ...form, id: Number(id) };
			dispatch(editPaymentTypeMethod({ id, values }));
		}
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				validate={validate(table)}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, values, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('Pagamentos:tipoXFormaPagamento.titulo')}
							slotBottomRight={<Submit disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('Pagamentos:tipoPagamento')}
											name='tipoPagamentoId'
											required
											onChange={handleChangeTipoPagamento}
											readOnly={!isNew}
											options={optionsTiposPagamento}
										/>
									</Grid>
								</Grid>
							)}
							{values.tipoPagamentoId && (
								<RelacaoTipoFormaPagamentoTable table={table} />
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default RelacaoTipoFormaPagamentoForm;
