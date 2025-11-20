import { useEffect } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';

import {
	Props,
	NumProps,
	FieldFormColumn,
	getNested,
	FormikContext,
	DecimalNumberField,
} from './'
import { t } from 'src/locale/i18n';
import { toNumber } from 'src/core/utils/func';

const DecimalField = ({ required, min, max, readOnly, validate, name, ...props }: NumProps & Props & TextFieldProps) => {

	const { initialValues, setFieldValue, status, touched } = useFormikContext<FormikContext>()

	useEffect(() => {
		const value = getNested(name, initialValues)
		if (value !== undefined && !getNested(name, touched)) setFieldValue(name, toNumber(value))
		
	}, [setFieldValue, initialValues, name])

	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : DecimalNumberField}
			type='text'
			required={required}
			name={name}
			validate={(value: string) => {
				const number = toNumber(value)
				if (required && number === 0) return t('required')
				else if (min && number < min) return `Valor deve ser maior ou igual a ${toNumber(min)}`
				else if (max && number > max) return `Valor deve ser menor ou igual a ${toNumber(max)}`
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default DecimalField
