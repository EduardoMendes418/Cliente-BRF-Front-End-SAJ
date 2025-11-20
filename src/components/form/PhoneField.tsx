
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';
import { TextFieldProps as MUITextFieldProps } from 'formik-material-ui';

import { Props, MaskFieldMUI, FieldFormColumn, FormikContext } from './'
import { isNull } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';

const PhoneMaskField = (props: MUITextFieldProps) => {
	const l = props.field.value && props.field.value.replace(/\D/g, '').length
	return <MaskFieldMUI mask={l < 11 ? '(99) 9999-99999' : '(99) 99999-9999'} {...props} />
}

const PhoneField = ({
	required,
	validate,
	readOnly,
	placeholder = t('form.typeHere'),
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : PhoneMaskField}
			type="numeric"
			required={required}
			placeholder={placeholder}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				const l = value.replace(/\D/g, '').length
				if (l && l < 10) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default PhoneField
