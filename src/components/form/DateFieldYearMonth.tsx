import { useEffect, useCallback } from 'react';
import { Field as FormikField, useFormikContext } from 'formik'
import moment from 'moment';
import DateFnsUtils from '@date-io/moment';
import { TextFieldProps } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker, KeyboardDatePickerProps } from 'formik-material-ui-pickers';

import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';
import { FieldFormColumn, Props, FormikContext } from './'

const F = {
	default: 'YYYY-MM-DD',
	defaultShow: 'DD/MM/YYYY',
	year: 'YYYY',
	monthYear: 'YYYY-MM',
	provisionReport: 'YYYY-MM-01',
}

type CustomProp = {
	onlyYear?: boolean,
	format?: string;
	monthYear?: boolean,
	provisionReport?: boolean,
	disableDateFunc?: (date: any) => any,
}

const MIN_DATE = new Date('1900-01-01');
const MAX_DATE = new Date('2100-01-01');

const DatePicker = ({
	onlyYear,
	monthYear,
	provisionReport,
	minDateMessage,
	maxDateMessage,
	shouldDisableDate,
	disableDateFunc,
	...props
}: KeyboardDatePickerProps & Props & CustomProp) => {

	const {
		form: { touched, errors, setFieldTouched, setFieldValue, initialValues },
		field: { name },
	} = props

	const onChange = useCallback((value: any) => {
		setFieldTouched(name);
		setFieldValue(name, value ? value.format(monthYear ? F.monthYear : onlyYear ? F.year : provisionReport ? F.provisionReport : F.default) : null);
		if (props.onChange) props.onChange(value);
	}, [setFieldTouched, setFieldValue, name, props, onlyYear, monthYear, provisionReport])

	const helperText = touched[name] && errors[name];

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale='pt-br'>
			<KeyboardDatePicker
				autoOk
				shouldDisableDate={disableDateFunc}
				format={onlyYear ? F.year : F.defaultShow}
				helperText={helperText}
				views={[onlyYear ? 'year' : 'date']}
				minDateMessage={minDateMessage ?? t('validations.invalidDate')}
				maxDateMessage={maxDateMessage ?? t('validations.invalidDate')}
				invalidDateMessage={t('validations.invalidDate')}
				{...props}
				onChange={onChange}
			/>
		</MuiPickersUtilsProvider>
	)
}

const DateFieldYearMonth = ({
	readOnly,
	required,
	validate,
	...props
}: Props & CustomProp & (TextFieldProps | KeyboardDatePickerProps)) => {
	const { status } = useFormikContext<FormikContext>()
	return (
		<FormikField
			component={status === 'readOnly' || readOnly
				? (formikProps: any) => <FieldFormColumn {...formikProps} formatDate={props.format} type='date' />
				: DatePicker
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

export default DateFieldYearMonth