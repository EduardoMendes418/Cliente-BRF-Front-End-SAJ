
import { Field as FormikField, useFormikContext } from 'formik'
import { TextField as MUITextField } from 'formik-material-ui';
import { TextFieldProps } from '@material-ui/core';

import { Props, FieldFormColumn, FormikContext } from '.'
import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';

const TextField = ({
	readOnly,
	required,
	validate,
	placeholder = t('form.typeHere'),
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : MUITextField}
			type='text'
			required={required}
			placeholder={placeholder}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				else if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default TextField