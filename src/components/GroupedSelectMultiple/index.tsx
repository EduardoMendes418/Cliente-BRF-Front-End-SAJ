
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

import { Props, TOptionsSelect, FormikContext } from '../form'
import FieldColumn from '../FieldColumn';
import { t } from 'src/locale/i18n';
import { isNull } from 'src/core/utils/func';

type SelectProps = {
	id?: string;
	options: any[],
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

const GroupedSelectFiledMultiple = ({
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

  const allSubItems = options.reduce((acc, item) => {
    return acc.concat(item.subItems);
  }, []);

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
    
			return allSubItems
				.filter((x: any ) => selected?.includes(x?.value))
				.map((y: any) => y.label)
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
				allSubItems
					.filter(( x: { group: any; } ) => !x.group)
					.map((x: { value: any; } ) => x.value)
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
    <InputLabel htmlFor={name} shrink ref={inputLabel} >
					{label}
				</InputLabel>
			
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
			
				{
					multiple && (
						values[name]?.length < (options?.length / 2)
							? <MenuItem value='all'><em>Marcar todos</em></MenuItem>
							: <MenuItem value='nil'><em>Desmarcar todos</em></MenuItem>
					)
				}
				{options?.map(item => [
          			<ListSubheader color='inherit' disableSticky key={item.id}>{item.name}</ListSubheader>,
		 				item?.subItems?.map((subItem: any) => (
							<MenuItem key={subItem.value} value={subItem.value}>
								{
												multiple && (
													<Checkbox
														color='primary'
														// eslint-disable-next-line eqeqeq
														checked={values[name] && values[name]?.some((item: number | string) => item == subItem.value)}
													/>
												)
											}
              					{subItem.label}
            				</MenuItem>
		 			))
        		])}
			</FormikField>
			{showError && <FormHelperText>{helperText || errors[name]}</FormHelperText>}
		</FormControl>
	)
}

export default GroupedSelectFiledMultiple
