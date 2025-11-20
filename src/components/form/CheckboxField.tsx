import { Field as FormikField, useFormikContext } from 'formik';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import {
	FormGroup,
	FormHelperText,
	FormControl,
	FormLabel,
	makeStyles,
} from '@material-ui/core';
import { CheckboxWithLabel } from 'formik-material-ui';

import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';
import FieldColumn from '../FieldColumn';
import { FormikContext, getNested, TOptionsSelect, Props } from '.';

type CheckboxFieldProps = {
	options?: TOptionsSelect[],
	row?: boolean;
	hideFormLabel?: boolean;
	hideCheckBoxLable?: boolean;
};

const useStyles = makeStyles({ label: { fontSize: '12px' } });

const CheckboxField = ({
	label,
	name,
	required,
	disabled,
	readOnly,
	row = true,
	validate,
	options,
	hideFormLabel,
	hideCheckBoxLable = false,
	...props
}: Props & CheckboxFieldProps & CheckboxProps) => {

	const classes = useStyles();
	const { touched, errors, status, initialValues } = useFormikContext<FormikContext>();

	const showError = touched[name] && !!errors[name]

	if (readOnly || status === 'readOnly') return (
		<FieldColumn
			label={label}
			value={getNested(name, initialValues)}
			options={options}
			type={options ? 'list' : undefined}
		/>
	)

	return (
		<FormControl
			error={showError}
			disabled={disabled}
			required={required}
		>
			{!(status === 'readOnly' || readOnly || hideFormLabel) && (
				<FormLabel className={classes.label}>
					{label}
				</FormLabel>
			)}
			{
				options
					? (
						<FormGroup row={row}>
							{options.map(({ value, label }, idx) => (
								<FormikField
									type="checkbox"
									color='primary'
									component={CheckboxWithLabel}
									key={name + idx}
									name={name}
									value={value}
									Label={{ label }}
									disabled={disabled}
									validate={(value: string | number) => {
										if (required && isNull(value)) return t('required')
										else return validate && validate(value)
									}}
									{...props}
								/>
							))}
						</FormGroup>
					) : (
						<FormikField
							type="checkbox"
							color='primary'
							component={CheckboxWithLabel}
							name={name}
							Label={{ label: hideCheckBoxLable ? " " : label }}
							disabled={disabled}
							validate={(value: string | number | boolean) => {
								if (required && isNull(value)) return t('required')
								else return validate && validate(value)
							}}
							{...props}
						/>
					)
			}
			{showError && <FormHelperText>{errors[name]}</FormHelperText>}
		</FormControl>
	);
};

export default CheckboxField;
