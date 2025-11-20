
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';

import { Props, MaskFieldMUI, FieldFormColumn, MaskProps, FormikContext } from '.'
import { isNull } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';

const MaskField = ({
	required,
	validate,
	minLength,
	readOnly,
	...props
}: TextFieldProps & MaskProps & Props) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : MaskFieldMUI}
			type="numeric"
			required={required}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				else if (minLength && value.length && value.length < minLength) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default MaskField
