
import { ChangeEvent } from 'react'
import { Field as FormikField, useFormikContext } from 'formik'
import {
	FormControl,
	FormLabel,
	FormHelperText,
	Radio,
	makeStyles,
	FormControlLabel,
} from '@material-ui/core';
import { RadioGroup as MUIRadioGroup } from 'formik-material-ui';

import { booleanOptions } from 'src/screen/settings/constants';
import { Props, TOptionsSelect, FormikContext } from '.'
import { isNull } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';
import FieldColumn from '../FieldColumn';

type RadioGroupProps = {
	options?: (TOptionsSelect | { value: boolean; label: string })[],
	row?: boolean;
	required?: boolean;
	onChange?: (result: string | number | boolean) => void;
	isDeselectable?: boolean;
}

const useStyles = makeStyles({ label: { fontSize: '12px' } });

const boolToNumber = (v: boolean) => v ? 1 : 0

const RadioGroup = ({
	name,
	row = true,
	options = booleanOptions,
	disabled,
	label,
	required,
	validate,
	readOnly,
	onChange,
	isDeselectable,
	...props
}: Props & RadioGroupProps) => {
	const classes = useStyles();

	const { values, errors, touched, setFieldValue, status } = useFormikContext<FormikContext>()
	const showError = touched[name] && !!errors[name]

	const handleRadioChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
		const result =
			typeof options[0].value === 'boolean'
				? value === 'false' ? false : Boolean(value)
				: typeof options[0].value === 'number'
					? Number(value)
					: value;

		setFieldValue(name, result);
		if (onChange) onChange(result);
	};

	const handleDeselect =  (value: any) => {
		const currentValue = values[name];
		if (value === currentValue) setFieldValue(name, '');
	}

	return (
		<FormControl
			error={showError}
			disabled={disabled}
			onChange={handleRadioChange}
			required={required}
		>
			{!(status === 'readOnly' || readOnly) && (
				<FormLabel className={classes.label}>
					{label}
				</FormLabel>
			)}
			<FormikField
				component={status === 'readOnly' || readOnly
					? ({ field }: any) => (
						<FieldColumn
							options={
								options
									.map(({ value, ...item }) => ({
										...item,
										value: typeof value === 'boolean' ? boolToNumber(value) : value
									}))
							}
							label={label}
							value={
								options.length
									? typeof field.value === 'boolean'
										? boolToNumber(field.value)
										: field.value
									: ''
							}
							type='list'
						/>
					)
					: MUIRadioGroup
				}
				name={name}
				disabled={disabled}
				row={row}
				required={required}
				validate={(value: string | number) => {
					if (required && isNull(value)) return t('required')
					else return validate && validate(value)
				}}
				{...props}
			>
				{options.map(({ value, label }, i) => (
					<FormControlLabel
						onClick={isDeselectable ? () => handleDeselect(value) : undefined}
						key={name + i}
						control={<Radio color='primary' value={value} />}
						label={label}
					/>
				))}
			</FormikField>
			{showError && <FormHelperText>{errors[name]}</FormHelperText>}
		</FormControl>
	)
}

export default RadioGroup