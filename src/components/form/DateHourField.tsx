import { useEffect, useCallback } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import moment from 'moment';
import DateFnsUtils from '@date-io/moment';
import { TextFieldProps } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
	KeyboardDateTimePicker,
	KeyboardDateTimePickerProps,
} from 'formik-material-ui-pickers';

import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';
import { FieldFormColumn, Props, FormikContext } from '.'

const F = {
	default: 'YYYY-MM-DD HH:mm:ss',
	defaultShow: 'DD/MM/YYYY HH:mm:ss',
	noSecond: 'DD/MM/YYYY HH:mm'
}

type CustomProp = { format?: string; noSecond?: boolean; }

const MIN_DATE = new Date('1900-01-01');
const MAX_DATE = new Date('2100-01-01');

const DateTimePicker = ({
	minDateMessage,
	maxDateMessage,
	noSecond,
	...props
}: KeyboardDateTimePickerProps & Props & CustomProp) => {

	const {
		form: { touched, errors, setFieldTouched, setFieldValue, initialValues },
		field: { name },
	} = props

	useEffect(() => {
		const value = initialValues[name] ? moment(initialValues[name]).format(F.default) : null
		setFieldValue(name, value)
	}, [initialValues, setFieldValue, name])

	const onChange = useCallback((value: any) => {
		setFieldTouched(name);
		setFieldValue(name, value ? value.format(F.default) : null);
		if (props.onChange) props.onChange(value);
	}, [setFieldTouched, setFieldValue, name, props])

	const helperText = touched[name] && errors[name];

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale='pt-br'>
			<KeyboardDateTimePicker
				autoOk
				helperText={helperText}
				minDateMessage={minDateMessage ?? t('validations.invalidDate')}
				maxDateMessage={maxDateMessage ?? t('validations.invalidDate')}
				invalidDateMessage={t('validations.invalidDate')}
				format={noSecond ? F.noSecond : F.defaultShow}
				{...props}
				onChange={onChange}
			/>
		</MuiPickersUtilsProvider>
	)
}

const DateField = ({
	readOnly,
	required,
	validate,
	...props
}: Props & CustomProp & (TextFieldProps | KeyboardDateTimePickerProps)) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly
				? (formikProps: any) => <FieldFormColumn {...formikProps} formatDate={props.format} type='dateHour' />
				: DateTimePicker
			}
			required={required}
			{...props}
			validate={(date: string) => {
				if (date) {
					const currentDate = moment(date);
					const isAfter = currentDate.isSameOrAfter(MIN_DATE);
					const isBefore = currentDate.isBefore(MAX_DATE);
					return (!isAfter || !isBefore) && t('validations.invalidDate');
				} else if (required) return isNull(date) && t('required')
				return !!validate && validate(date)
			}}
		/>
	)
}

export default DateField