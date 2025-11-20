import React, { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useFormikContext } from 'formik';
import {
	CircularProgress,
	FormControl,
	FormHelperText,
	makeStyles,
	TextField
} from '@material-ui/core';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';

import { t } from 'src/locale/i18n';
import { validateNumberKeypress } from 'src/core/utils/func';

import { FormikContext, Props, getNested } from './';
import FieldColumn from '../FieldColumn';

export type TOptions = {
	label: string;
	value: number | string;
	description?: string;
}

type TAutocompleteField = Props & {
	name: string;
	onlyNumbers?: boolean;
	loading?: boolean;
	options: TOptions[];
	maskType?: 'cpfCnpj' | 'cpf';
	readOnly?: boolean;
	customError?: string;
	onValueChange?: (value: string, reason: AutocompleteInputChangeReason) => void;
	onSelectValue?: (value: TOptions | null) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	minLength?: number;
	required?: boolean;
	onDemand?: boolean;
	valuePropName?: 'label' | 'value';
	initialValue?: TOptions;
	disableField?: boolean;
}

const useStyles = makeStyles(() => ({
	inputRoot: {
		'&[class*="MuiOutlinedInput-root"]': {
			padding: 0
		},
		'&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
			padding: '15px 14px'
		},
	}
}));

const AutocompleteFieldESocial = ({
	options,
	onlyNumbers = false,
	loading = false,
	onValueChange,
	maskType,
	onSelectValue,
	readOnly,
	customError,
	onFocus,
	minLength,
	onDemand = false,
	valuePropName = 'value',
	initialValue,
	disableField,
	onBlur,
	...props
}: TAutocompleteField) => {
	const classes = useStyles();
	const [value, setValue] = useState<TOptions | null>(null);
	const { setFieldValue, setFieldTouched, errors, touched, values, initialValues, status, dirty } = useFormikContext<FormikContext>();

	useEffect(() => {
		if (!dirty) setValue(initialValue ?? initialValues[props.name])
	}, [dirty, initialValues, initialValue, props.name, setValue])


	useEffect(() => {
		if (options.length === 0) return;
		const value = getNested(props.name, values)
		const selectedOption = options.find((op) => op.value === value);
		if (selectedOption) setValue(selectedOption);
		
	}, [initialValues, props.name, options, valuePropName])

	const showError = touched[props.name] && (!!errors[props.name] || !!customError);

	if (readOnly || status === 'readOnly') return <FieldColumn label={props.label} value={initialValues[props.name]} />

	let mask = '';
	if (maskType) {
		const valueLength = values[props.name] && values[props.name].replace(/\D/g, '').length;
		mask = maskType === 'cpf' || valueLength < 12 ? '999.999.999-999' : '99.999.999/9999-99'
	}

	return (
		<FormControl error={showError} required>
			<Autocomplete
				value={value}
				classes={classes}
				disabled={disableField}
				renderOption={(option) => option.description ?? option.label}
				renderInput={(params) => (
					<TextField
						{...params}
						{...props}
						disabled={disableField}
						error={showError}
						inputProps={{ ...params.inputProps, mask, maskChar: null }}
						InputLabelProps={{ shrink: true }}
						InputProps={{
							...params.InputProps,
							inputComponent: ReactInputMask as any,
							endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
				)}
				options={options}
				loading={loading}
				clearOnBlur
				noOptionsText={
					(minLength && values[props.name] && values[props.name].length < minLength)
						? t('form.minCharacters', { minLength })
						: t('form.noOptionFound')
				}
				loadingText={t('form.loadingText')}
				filterOptions={onDemand ? (options) => options : undefined}
				getOptionLabel={(option) => option.label || ''}
				getOptionSelected={(option, selectedItem) => option?.value === selectedItem?.value}
				onInputChange={(event, newInputValue, reason) => {
					if (value && newInputValue === value.label) return;
					valuePropName === 'label' && setFieldValue(props.name, newInputValue);

					if (valuePropName === 'value' && newInputValue === '') {
						setFieldValue(props.name, '');
						setValue(null);
						setFieldTouched(props.name, true);
					}

					onValueChange && onValueChange(newInputValue, reason);
				}}
				onChange={(event, newValue) => {
					setValue(newValue);
					onSelectValue && onSelectValue(newValue)
					valuePropName === 'value' && setFieldValue(props.name, newValue?.value)
				}}
				onKeyPress={(event) => onlyNumbers && validateNumberKeypress(event)}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			{showError && <FormHelperText>{customError ?? errors[props.name]}</FormHelperText>}
		</FormControl>
	)
}

export default AutocompleteFieldESocial;