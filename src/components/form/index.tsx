import {
	TextField as MUITextField,
	TextFieldProps as MUITextFieldProps
} from 'formik-material-ui';
import NumberFormat from 'react-number-format'
import InputMask from 'react-input-mask'
import { pathOr } from 'ramda';

import { toCurrency, toPercentage } from 'src/core/utils/func';
import FieldColumn from '../FieldColumn';
import Form from './Form';
export interface FormikContext {
	[key: string]: any;
}

export { default as CurrencyField } from './CurrencyField';
export { default as CurrencyFieldFocus } from './CurrencyFieldFocus';
export { default as PercentageField } from './PercentageField';
export { default as SelectField } from './SelectField';
export { default as TextField } from './TextField';
export { default as RadioGroup } from './RadioGroup';
export { default as DateField } from './DateField';
export { default as DateFieldYearMonth } from './DateFieldYearMonth';
export { default as PhoneField } from './PhoneField';
export { default as NumericField } from './NumericField';
export { default as CPFOrCNPJField } from './CPFOrCNPJField';
export { default as MaskField } from './MaskField';
export { default as Upload } from './Upload';
export { default as AutocompleteField } from './AutocompleteField';
export { default as AutocompleteFieldEsocial } from './AutocompleteFieldEsocialn';
export { default as EmailField } from './EmailField';
export { default as SwitchField } from './SwitchField';
export { default as DateHourField } from './DateHourField';
export { default as CheckboxField } from './CheckboxField';
export { default as CheckboxesAutocompleteField } from './CheckboxesAutocompleteField'
export { default as DecimalField } from './DecimalField'
export { default as ContactsAutocompleteField } from './ContactsAutocompleteField'
export { default as CostCenterField } from './CostCenterField';
export { default as UserField } from './UserField';
export { default as ContactsAutocompleteFieldUnifier } from './ContactsAutocompleteFieldUnifier';

export type Props = {
	name: string;
	label: string,
	maxLength?: string | number;
	minLength?: string | number;
	disabled?: boolean;
	readOnly?: boolean;
	validate?: (v: string | number | boolean) => (boolean | string);
	unlimitedLength?: boolean;
}

export type TOptionsSelect = {
	value: number | string;
	label: string;
	group?: string;
	groupItem?: boolean;
}

export type TGroupedOptionsSelect = {
	id: number;
	name: string;
	group?: string;
	subItems: {
		map(arg0: (subItem: any) => JSX.Element): any;
		groupItem?: boolean,
		value: number,
		label: string
	}
}

export type NumProps = { verbose?: boolean; noSymbol?: boolean, min?: number, max?: number }

export type MaskProps = { mask: string | Array<(string | RegExp)>; maskChar?: string | null }

const normalizeAndFormat = (
	type: 'percentage' | 'currency',
	verbose = false,
	noSymbol = false
) => (value: number) => {
	const normalized = Number(value) / 100
	return type === 'percentage'
		? toPercentage(normalized, verbose, noSymbol)
		: toCurrency(normalized, verbose, noSymbol)
}

const CustomNumberFormat = ({ inputRef, type, verbose, noSymbol, ...props }: any) => (
	<NumberFormat
		format={normalizeAndFormat(type, verbose, noSymbol)}
		getInputRef={inputRef}
		maxLength={type === 'currency' ? 24 : 23}
		{...props}
	/>
)

const CustomDecimalFormat = ({ inputRef, ...props }: any) => (
	<NumberFormat
		getInputRef={inputRef}
		maxLength={23}
		decimalSeparator=","
		displayType="input"
		type="text"
		allowNegative={false}
		decimalScale={10}
		{...props}
	/>
)

export const DecimalNumberField = ({ ...props }: MUITextFieldProps) => (
	<MUITextField
		InputProps={{ inputComponent: CustomDecimalFormat as any }}
		{...props}
	/>
)

export const NumberField = ({ type, verbose, noSymbol, ...props }: NumProps & MUITextFieldProps) => (
	<MUITextField
		InputProps={{ inputComponent: CustomNumberFormat as any }}
		inputProps={{ type, verbose, noSymbol }}
		{...props}
	/>
)

export const MaskFieldMUI = ({ mask, maskChar = null, ...props }: MaskProps & MUITextFieldProps) => (
	<MUITextField
		InputProps={{ inputComponent: InputMask as any }}
		inputProps={{ mask, maskChar }}
		{...props}
	/>
)

export const FieldFormColumn = ({ field, label, type, formatDate, multiline, helperText }: any) => 
	<FieldColumn label={label} value={field.value} type={type} formatDate={formatDate} multiline={multiline} helperText={helperText} />

	export const getNested = (path: string, object: any): any => {
		// Divide o caminho em partes separadas por pontos
		const parts = path.split('.');
	  
		// Função recursiva para percorrer o caminho
		const dive = (parts: string[], obj: any): any => {
		  if (!obj || parts.length === 0) {
			return obj;
		  }
	  
		  // Extrai a próxima parte do caminho
		  let part = parts[0];
	  
		  // Se a parte atual é um índice de array (número entre colchetes)
		  if (part.includes('[') && part.includes(']')) {
			// Extrai o número dentro dos colchetes
			const index = part.match(/\[(\d+)\]/)?.[1];
			if (index) {
			  // Continua a recursão com o elemento do array
			  return dive(parts.slice(1), obj[parseInt(index)]);
			}
		  } else {
			// Continua a recursão com a propriedade do objeto
			return dive(parts.slice(1), obj[part]);
		  }
	  
		  return undefined;
		};
	  
		// Inicia a recursão
		return dive(parts, object);
	  };
	  

export default Form