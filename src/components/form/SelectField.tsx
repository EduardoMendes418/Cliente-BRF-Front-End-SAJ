
import { ReactNode, useRef, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import {
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	OutlinedInput,
	Checkbox,
	ListSubheader,
	Box,
} from '@material-ui/core';
import { Select as MUISelect } from 'formik-material-ui';

import { Props, TOptionsSelect, FormikContext } from './'
import FieldColumn from '../FieldColumn';
import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';

type SelectProps = {
	id?: string;
	options: TOptionsSelect[],
	required?: boolean;
	multiple?: boolean;
	number?: boolean;
	helperText?: string;
	error?: boolean;
	onChange?: Function;
	placeholder?: string;
	selectLabel?: string;
	overflowed?: boolean;
}

const SelectField = ({
	id,
	name,
	options,
	disabled,
	label,
	required,
	helperText,
	error,
	multiple,
	number,
	readOnly,
	validate,
	onChange,
	selectLabel,
	overflowed,
	placeholder = t('select'),
	...props
}: SelectProps & Props) => {
	const { errors, touched, setFieldValue, values, status } = useFormikContext<FormikContext>();
	const showError = error || (touched[name] && !!errors[name])
	const inputLabel = useRef<HTMLLabelElement>(null);
	const [labelWidth, setLabelWidth] = useState(0);

	useEffect(() => {
		if (inputLabel.current !== null) setLabelWidth(inputLabel.current.offsetWidth);
	}, []);

	useEffect(() => {
		if (required && options.length === 1 && options[0].value && !onChange) {
			const selectedValue = multiple ? [options[0].value] : options[0].value;

			setFieldValue(name, selectedValue)
		}
	}, [options, name, setFieldValue, multiple, required, onChange, selectLabel]);

	const renderValue = useCallback(
		(selected: any): ReactNode => {
			return options
				.filter(({ value }) => selected.includes(value))
				.map(({ label }) => label)
				.join(', ')
		}
		,
		[options]
	)

	const handleChange = (
		event: ChangeEvent<{ value: unknown }>,
		child: ReactNode
	) => {
		const value = event.target.value

		if (multiple && Array.isArray(value) && value.includes('all')) {
			setFieldValue(
				name,
				options
					.filter(({ group }) => !group)
					.map(({ value }) => value)
			)
		} else if (multiple && Array.isArray(value) && value.includes('nil')) {
			setFieldValue(name, [])
		} else if (value !== undefined) {
			setFieldValue(name, value)
			if (selectLabel !== undefined) {
				const lable = [...options].filter(({ value: valueOp }) => value === valueOp).pop()?.label
				setFieldValue(selectLabel, lable)
			}
		}

		if (onChange) onChange(event, child);
	};

	return (
		<FormControl
			error={showError}
			disabled={disabled}
			required={required}
		>
			{!(status === 'readOnly' || readOnly) && (
				<InputLabel htmlFor={name} shrink ref={inputLabel} >
					{label}
				</InputLabel>
			)}
			<FormikField
				component={status === 'readOnly' || readOnly
					? (props: any) => (
						<FieldColumn
							options={options.filter(({ group }) => !group) as TOptionsSelect[]}
							label={label}
							value={options.length ? props.field.value : ''}
							type='list'
						/>
					)
					: MUISelect
				}
				name={name}
				inputProps={{ id: name, multiple }}
				input={<OutlinedInput notched labelWidth={labelWidth} />}
				disabled={disabled}
				renderValue={multiple ? renderValue : undefined}
				required={required}
				validate={(value: string | number) => {
					if (required && isNull(value)) return t('required')
					else return validate && validate(value)
				}}
				onChange={handleChange}
				{...props}
			>
				{!multiple && <MenuItem value={number ? 0 : ''}><em>{placeholder}</em></MenuItem>}
				{
					multiple && (
						values[name]?.length < (options?.length / 2)
							? <MenuItem value='all'><em>Marcar todos</em></MenuItem>
							: <MenuItem value='nil'><em>Desmarcar todos</em></MenuItem>
					)
				}
				{
					options?.map(({ value, label, group, groupItem }, i) => group
						? <ListSubheader color="primary" key={i} disableSticky>{group}</ListSubheader>
						: (
							<MenuItem value={value} key={i}>
								{
									groupItem
										? <Box pl={2}>
											{
												multiple && (
													<Checkbox
														color='primary'
														// eslint-disable-next-line eqeqeq
														checked={values[name] && values[name].some((item: number | string) => item == value)}
													/>
												)
											}
											{label}
										</Box>
										: <Box style={{overflow: overflowed === true ? 'auto' : 'hidden', maxWidth: '800px'}}>
											{
												multiple && (
													<Checkbox
														color='primary'
														// eslint-disable-next-line eqeqeq
														checked={values[name] && values[name]?.some((item: number | string) => item == value)}
													/>
												)
											}
											
											{label}
										</Box>
								}
							</MenuItem>
						))
				}
			</FormikField>
			{showError && <FormHelperText>{helperText || errors[name]}</FormHelperText>}
		</FormControl>
	)
}

export default SelectField
