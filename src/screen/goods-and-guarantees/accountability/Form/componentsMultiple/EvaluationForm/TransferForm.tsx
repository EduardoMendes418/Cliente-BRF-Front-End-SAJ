import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";

import { NumericField, SelectField, DateField, CurrencyField, TOptionsSelect, FormikContext } from "src/components/form";
import { t } from "src/locale/i18n";

import { valuesToNumber } from "src/core/utils/func";
import { TForm } from "src/screen/goods-and-guarantees/accountability/Form/hooks/useAccountability";
import { Modulos } from "src/core/models/modules";
import { usePaymentType } from "src/hooks/fetchLists";

type Props = {
	isVisible: boolean;
	readOnly: boolean;
	banksAsOptions: TOptionsSelect[];
	isTransferBetweenProcess: boolean;
}

const TransferForm = ({ isVisible, readOnly, banksAsOptions, isTransferBetweenProcess }: Props) => {

	const { values, setFieldValue } = useFormikContext<FormikContext>();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	const calculateTotalAmountWrittenOffTransfer = (event: any, fieldName: string) => {
		const { valueGuarantee, amountWrittenOff } = valuesToNumber([
			'valueGuarantee',
			'amountWrittenOff'
		], { ...values, [fieldName]: event.target.value }) as TForm;


		const creditedAmount = valueGuarantee - amountWrittenOff;

		setFieldValue('creditedAmount', Math.abs(creditedAmount));
		setFieldValue(fieldName, event.target.value);
	}

	if (!isVisible) return null;

	return (
		<>
			<Grid item md={3} xs={12}>
				<SelectField
					name="reasonforoccurrence"
					label={"Tipo da garantia"}
					options={paymentTypeAsOptions}
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<NumericField
					name="ctgTransfered"
					label={t('goodsAndGuarantees:accountability.transferredCtg')}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required={isTransferBetweenProcess}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<NumericField
					name="accountTransferred"
					label={t('goodsAndGuarantees:accountability.transferredAccount')}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<SelectField
					required
					name='bankId'
					label={t('goodsAndGuarantees:accountability.transferredBank')}
					options={banksAsOptions}
					readOnly={readOnly}
				/>
			</Grid>

			<Grid item xs={12} md={3}>
				<DateField
					name="guaranteeDate"
					label={t('goodsAndGuarantees:form.guaranteeDate')}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<CurrencyField
					name='valueGuarantee'
					label={t('goodsAndGuarantees:form.guaranteeAmount')}
					readOnly={readOnly}
					required
					min={0.01}
					onChange={event => {
						calculateTotalAmountWrittenOffTransfer(event, 'valueGuarantee');
					}}
				/>
			</Grid>
		</>
	)
}

export default TransferForm;