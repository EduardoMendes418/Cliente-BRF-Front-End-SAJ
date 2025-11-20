import { useState } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import { Switch as MUISwitch } from 'formik-material-ui';
import { TextFieldProps } from '@material-ui/core';

import { FormikContext, getNested } from '.';

type Props = {
	name: string;
	disabled?: boolean;
	readOnly?: boolean;
	defaultChecked?: boolean;
}

const Switch = (props: any) => <MUISwitch color='primary' {...props} />

const SwitchField = ({
	readOnly,
	name,
	defaultChecked,
	disabled,
	...props
}: Props & TextFieldProps) => {
	const { values, status } = useFormikContext<FormikContext>()
	const [checked] = useState(defaultChecked || getNested(name, values))

	return (
		<FormikField
			component={Switch}
			type="checkbox"
			name={name}
			defaultChecked={!!checked}
			{...props}
			disabled={disabled || readOnly || status === 'readOnly'}
		/>
	)
}

export default SwitchField