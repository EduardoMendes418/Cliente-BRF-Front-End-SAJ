
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';
import { TextFieldProps as MUITextFieldProps } from 'formik-material-ui';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import { Props, MaskFieldMUI, FieldFormColumn, FormikContext } from './'
import { isNull } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';

const CPFOrCNPJMaskField = ({ type, ...props }: MUITextFieldProps & { type: 'cpf' | 'cnpj' }) => {
	const l = props.field.value && props.field.value.replace(/\D/g, '').length

	return (
		<MaskFieldMUI
			mask={
				(type === 'cpf' || l < 12) && type !== 'cnpj'
					? `999.999.999-99${type !== 'cpf' ? '9' : ''}`
					: '99.999.999/9999-99'
			}
			{...props}
			type="numeric"
		/>
	)
}

const CPFOrCNPJField = ({
	readOnly,
	required,
	validate,
	placeholder = t('form.typeHere'),
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : CPFOrCNPJMaskField}
			required={required}
			placeholder={placeholder}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				else if (value && (!cpf.isValid(value) && !cnpj.isValid(value))) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default CPFOrCNPJField
