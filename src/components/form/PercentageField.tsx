import { useEffect } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';

import { toNumber, toPercentage } from 'src/core/utils/func'
import { t } from 'src/locale/i18n'

import {
	Props,
	NumProps,
	NumberField,
	FieldFormColumn,
	FormikContext,
	getNested,
} from './'

const PercentageField = ({
	required,
	min,
	max,
	readOnly,
	validate,
	name,
	...props
}: TextFieldProps & NumProps & Props) => {
	const { initialValues, setFieldValue, status } = useFormikContext<FormikContext>()

	useEffect(() => {
		const value = getNested(name, initialValues)
		if (value !== undefined) setFieldValue(name, toPercentage(value))
	}, [setFieldValue, initialValues, name])

	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : NumberField}
			type='percentage'
			required={required}
			name={name}
			validate={(value: string) => {
				const number = toNumber(value)
				if (required && number === 0) return t('required')
				else if (min && number < min) return `Valor deve ser maior ou igual a ${min}`
				else if (max && number > max) return `Valor deve ser menor ou igual a ${max}`
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default PercentageField
