
import { Field as FormikField, useFormikContext } from 'formik'
import { TextFieldProps } from '@material-ui/core';
import { TextFieldProps as MUITextFieldProps } from 'formik-material-ui';

import { Props, MaskFieldMUI, FieldFormColumn, FormikContext } from './'
import { t } from 'src/locale/i18n';

const hhMmMaskField = (props: MUITextFieldProps) => {
	
	return <MaskFieldMUI mask={'99:99'} {...props} />
}

const HourMinuteField = ({
	required,
	validate,
	readOnly,
	placeholder = t('form.typeHere'),
	...props
}: Props & TextFieldProps) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly ? FieldFormColumn : hhMmMaskField}
			type="numeric"
			required={required}
			placeholder={placeholder}
			{...props}
		/>
	)
}

export default HourMinuteField
