
import { Field as FormikField, useFormikContext } from 'formik'
import { TextField as MUITextField } from 'formik-material-ui';
import { TextFieldProps } from '@material-ui/core';

import { Props, FieldFormColumn, FormikContext } from './'
import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';

const TextField = ({
	minLength,
	maxLength = 200,
	readOnly,
	required,
	validate,
	placeholder = t('form.typeHere'),
	unlimitedLength = false,
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : MUITextField}
			type='text'
			required={required}
			placeholder={placeholder}
			inputProps={unlimitedLength ? undefined : { maxLength }}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				else if (minLength && value.length && value.length < minLength) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default TextField