
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';
import { TextFieldProps as MUITextFieldProps } from 'formik-material-ui';

import { Props, MaskFieldMUI, FieldFormColumn, FormikContext } from './';
import { isNull } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';

const DEFAULT_MAX_LENGTH = 20;

const NumericMaskField = ({ maxLength = DEFAULT_MAX_LENGTH, ...props }: Props & MUITextFieldProps) =>
	<MaskFieldMUI mask={Array(maxLength).fill('9').join('')} {...props} />


const NumericField = ({
	minLength,
	maxLength,
	readOnly,
	required,
	validate,
	placeholder = t('form.typeHere'),
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			type="numeric"
			component={status === 'readOnly' || readOnly ? FieldFormColumn : NumericMaskField}
			required={required}
			placeholder={placeholder}
			validate={(value: string) => {
				if (required && isNull(value)) return t('required')
				else if (minLength && value?.length && Number(value?.length) < Number(minLength)) return t('validations.invalidField')
				else if (maxLength && value?.length && Number(value?.length) > Number(maxLength)) return t('validations.invalidField')
				else return validate && validate(value)
			}}
			{...props}
		/>
	)
}

export default NumericField
