import { useEffect } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';

import {
	Props,
	NumProps,
	NumberField,
	FieldFormColumn,
	getNested,
	FormikContext,
} from './'
import { t } from 'src/locale/i18n';
import { toCurrency, toNumber } from 'src/core/utils/func';

const CurrencyFieldFocus = ({ required, min, max, readOnly, validate, name, ...props }: NumProps & Props & TextFieldProps) => {

	const { initialValues, setFieldValue, status, touched } = useFormikContext<FormikContext>()

	useEffect(() => {
		const value = getNested(name, initialValues)
		if (value !== undefined && !getNested(name, touched) && value !== "" && value !== null) setFieldValue(name, toCurrency(value))
		
	}, [setFieldValue, initialValues, name])

	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : NumberField}
			type='currency'
			required={required}
			name={name}
			
			validate={(value: string) => {
				const number = toNumber(value)
				if (required && (!/^R\$/.test(value) && number === 0)) return t('required')
				else if (min && number < min) return `Valor deve ser maior ou igual a ${toCurrency(min)}`
				else if (max && number > max) return `Valor deve ser menor ou igual a ${toCurrency(max)}`
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default CurrencyFieldFocus
