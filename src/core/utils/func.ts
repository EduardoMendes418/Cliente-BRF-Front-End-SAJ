import axios from 'axios';
import moment from "moment"
import { t } from 'src/locale/i18n';
import {
	zipObj,
	values,
	keys,
	pipe,
	always,
	when,
	replace,
	ifElse,
	map,
	cond,
	equals,
	T,
	pathOr,
	sort,
	split,
	head,
	last,
	match,
	length,
	toUpper,
	filter,
	includes,
	prop,
	tryCatch,
	join,
	concat,
	anyPass,
	isNil,
	isEmpty,
	is,
	test,
	mapObjIndexed,
	reject,
	allPass,
	complement,
} from "ramda"
import { TOptionsSelect } from "src/components/form"
import { TOptions } from "../models"
import { STATUS_APPROVALS_FLOW } from "./constants"
import { RADIO_OPTIONS } from 'src/core/models/data-import';

const shallowRenameKeys = (rename: object, back?: boolean) => (data: any) => {

	const reappoint = back && zipObj(values(rename), keys(rename))

	return Object.keys(data).reduce((acc: any, item) => {
		const newKey = (reappoint ? (reappoint as any)[item] : (rename as any)[item]) || item
		acc[newKey] = data[item]
		return acc
	}, {})
}

const deepRenameKeys = (rename: object, back?: boolean): any =>
	mapObjIndexed((value, key) => {
		if ((rename as any)[key] !== undefined) {
			if (is(Array, value))
				return map(renameKeys((rename as any)[key], back), value as any[])
			if (is(Object, value))
				return renameKeys((rename as any)[key], back)(value)
		}
		return value
	})

const normalizeRename = (rename: object, back?: boolean) => {
	const deepRename = {}
	const shallowRename = mapObjIndexed((value, key) => {
		if (is(Array, value)) {
			(deepRename as any)[back ? key : head(value)] = value[1]
			return head(value)
		}
		return value
	}, rename)

	return {
		shallowRename,
		deepRename,
	}
}

export const renameKeys = (rename: object, back?: boolean) => (data: any) => {

	const { shallowRename, deepRename } = normalizeRename(rename, back)

	if (data?.items) {
		const shallowNormalize = map(shallowRenameKeys(shallowRename, back), data.items)
		return {
			...data,
			items: map(deepRenameKeys(deepRename, back), shallowNormalize)
		}
	} else {
		const shallowNormalize = shallowRenameKeys(shallowRename, back)(data)
		return deepRenameKeys(deepRename, back)(shallowNormalize)
	}
}

export const numberToCurrency = (number: number | string) => `${new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
}).format(toNumber(number))}`

const deleteSymbolCurrency = replace(/R\$\s/, '')
const toVerbose = replace(/^0$/, "R$ 0,00")

export const toCurrency = (
	value: number,
	verbose: boolean = true,
	noSymbol: boolean = false,
) => pipe(
	numberToCurrency,
	ifElse(always(verbose), toVerbose, replace(/^0$/, "R$ 0")),
	when(always(noSymbol), deleteSymbolCurrency),
)(value)

export const toNegativeCurrency = (value: number) => {
	const currency = toCurrency(value, true, true)

	return `R$ ${currency}`.replace('-', '–')
}

export const toPercentage = (
	value: number,
	verbose: boolean = true,
	noSymbol: boolean = false,
) => pipe(
	numberToCurrency,
	when(always(verbose), toVerbose),
	deleteSymbolCurrency,
	when(always(!noSymbol), v => `${v} %`),
)(value)

export const getCurrentStatus = pipe<
	{ occurrenceDate: string }[],
	{ occurrenceDate: string }[],
	STATUS_APPROVALS_FLOW
>(
	// @ts-ignore
	sort((a, b) => new Date(b.occurrenceDate) - new Date(a.occurrenceDate)),
	pathOr(-1, [0, 'statusApprovalId']),
)

export const getIdToken = () => {
	const storage = window.sessionStorage
	return pipe<Storage, string, { secret: string }, string>(
		prop(pipe<Storage, string[], string[], string>(
			keys,
			filter(includes('idtoken')),
			head
		)(storage)),
		tryCatch(JSON.parse, always({ secret: '' })),
		prop('secret')
	)(storage)
}

export const getInitials = pipe(
	split('-'),
	head,
	match(/\b(\w)/g),
	cond<string[], string>([
		[pipe(length, equals(0)), always('')],
		[pipe(length, equals(1)), head],
		[T, v => `${head(v)}${last(v)}`]
	]),
	toUpper
)

export const getEnv = () => cond<string, string>([
	[equals('localhost:3000'), always('development')],
	[equals('brf-app-iuris-dev.azurewebsites.net'), always('development')],
	[equals('sajqas.brf.com'), always('qa')],
	[equals('saj.brf.com'), always('production')]
])(window.location.host)

export const isDevelopment = () => getEnv() === 'development'

export const isProduction = () => getEnv() === 'production'

export const joinPaths = pipe<any[], string[], string, string>(filter(v => !!v), join('/'), concat('/'))

export const getSelectedValuesAsString = (options: TOptionsSelect[], selectedValues: any) => {
	if (!selectedValues && selectedValues !== 0) return '';

	const filterFn = Array.isArray(selectedValues)
		? ({ value }: any) => selectedValues.includes(value)
		: ({ value }: any) => selectedValues === value

	return options
		.filter(filterFn)
		.map(({ label }: any) => label)
		.join(', ');
}

export const isNull = anyPass([isNil, isEmpty])

export const toNumber = cond<any, number>([
	[v => !!Number(v), Number],
	[
		is(String),
		pipe(
			deleteSymbolCurrency,
			replace(/\s|%/g, ''),
			ifElse(
				test(/,(?=\d+$)/),
				pipe(replace(/\./g, ''), replace(/,/g, '.')),
				replace(/,/g, '')
			),
			Number,
			when(equals(NaN), always(0))
		)
	],
	[T, always(0)]
])

export const toNumberNormal = (value: any): number => {
	const deleteSymbolCurrency = (str: string) => str.replace(/[^0-9,.-]/g, '');

	// Checa se o valor pode ser convertido diretamente para um número
	if (!isNaN(Number(value)) && value !== '') {
		return Number(value);
	}

	// Trata o caso de o valor ser uma string
	if (typeof value === 'string') {
		let cleanedValue = deleteSymbolCurrency(value);
		cleanedValue = cleanedValue.replace(/\s|%/g, '');

		// Se encontrar uma vírgula seguida de números (formato decimal), ajusta para o formato padrão
		if (/,(\d+)$/.test(cleanedValue)) {
			cleanedValue = cleanedValue.replace(/\./g, '').replace(/,/g, '.');
		} else {
			cleanedValue = cleanedValue.replace(/,/g, '');
		}

		const numValue = Number(cleanedValue);
		return isNaN(numValue) ? 0 : numValue;
	}

	// Retorna 0 para qualquer outro tipo de valor
	return 0;
};


export function valuesToNumber<T = any>(keys: string[], obj: any): T {
	return mapObjIndexed((v, k) => keys.includes(k) ? toNumber(v) : v)(obj) as T
}

export function valuesToFloat<T = any>(keys: string[], obj: any): T {
	return mapObjIndexed((v, k) => keys.includes(k) ? parseFloat(`${v}`) : v)(obj) as T
}
export const toArray = (value: string) => value ? value.split(',') : [];

export const rejectNoValues = reject(isNull)

export const isNotEmptyArray = allPass([is(Array), complement(isEmpty)])

export const validateNumberKeypress = (event: any) => {
	if (!/[0-9]/.test(event.key)) {
		event.preventDefault();
	}
};

export const numberWithoutMask = (value: string) => value ? value.replace(/\D/g, '') : '';

export function fillIfValue<T>(item: T, defaultItem: T) {
	return mapObjIndexed((value, key) => isNull((item as any)[key]) ? value : (item as any)[key], defaultItem) as T
}

export const getDateWithoutDays = (value: string) => moment(value).format('MM/yyyy');

export const getFullDate = (value: string | null | undefined) => {
	if (!value) return null;
	return moment(value, 'MM/yyyy').format('yyyy-MM-DD');
}

export const getOptionsAsObject = (options: TOptionsSelect[]) => options.reduce((acc, { value, label }) => {
	(acc as any)[value] = label;
	return acc;
}, {}) as { [key: number]: string };

export function toDefaultValues<T>(keys: string[], obj: object, defaultValue?: any) {
	return mapObjIndexed((v, k) => keys.includes(k) && isNil(v) ? defaultValue ?? '' : v, obj) as T
}

const formatToCep = (value: string) => {
	if (value.length !== 8) return value;

	const match = value.match(/^(\d{2})(\d{3})(\d{3})$/);
	if (match) return `${match[1]}.${match[2]}-${match[3]}`;

	return value;
}

const formatToPhone = (value: string) => {
	if (value.length !== 10 && value.length !== 11) return value;

	const regex = value.length === 10 ? /^(\d{2})(\d{4})(\d{4})$/ : /^(\d{2})(\d{5})(\d{4})$/
	const match = value.match(regex);
	if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;

	return value;
}

export const formatTo = (type: 'cep' | 'phone', value: string) => {
	const valueWithoutMask = numberWithoutMask(value);

	if (type === 'cep') return formatToCep(valueWithoutMask);
	if (type === 'phone') return formatToPhone(valueWithoutMask);

	return value;
}

export const addZeros = (value: string, finalLength: number) => {

	if (value.length === finalLength || value === "") return value;
	return value.padStart(finalLength, '0')

}

type KeyZero = {
	key: string;
	finalLength: number;
}

export const valuesToAddZeroLeft = (keys: KeyZero[], obj: any) => {
	keys.map(({ key, finalLength }) => obj[key] = addZeros(obj[key], finalLength))
	return obj;
}

export const convertArrayBufferToObject = (value: ArrayBuffer) => {
	let message = '';

	if ("TextDecoder" in window) {
		const dataView = new DataView(value);
		const decoder = new TextDecoder("utf8");
		message = decoder.decode(dataView);
	} else {
		message = String.fromCharCode.apply(null, new Uint8Array(value) as any);
	}
	return typeof message === 'string' ? message : JSON.parse(message);
};

export const convertToOptions = (list: TOptions[]) => list.map(item => ({ label: item.name, value: item.id }))

export const textToOptions = (objText: object) => Object.entries(objText).map(([key, value]) => ({ label: value, value: key }));

export const convertToBlobCSV = (value: any) => {
	const csvContentToUTF8 = '\ufeff' + value
	return new Blob([csvContentToUTF8], { type: 'text/csv;charset=utf-8' }
	)
};

export const convertToBlob = (value: any) => new Blob([value], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

export const convertToJson = (csv: string) => {

	const lines = csv?.split("\n");
	const result = [];
	const headers = lines[0].split(",");

	for (let i = 1; i < lines.length; i++) {
		const obj = {};
		const currentline = lines[i].split(",");

		for (let j = 0; j < headers.length; j++) {
			(obj as any)[headers[j]] = currentline[j];
		}

		result.push(obj);
	}

	return result;
};


export const convertRadioOptionToBoolOrNull = (values: any, keys: string[]) => {
	const newValues = { ...values };
	keys.forEach((key) => {
		switch (newValues[key]) {
			case RADIO_OPTIONS.YES:
				newValues[key] = true
				break;
			case RADIO_OPTIONS.NO:
				newValues[key] = false
				break;
			case RADIO_OPTIONS.BOTH:
				newValues[key] = null
				break;
		}
	})
	return newValues
}

export const hasDuplicates = (array: any) => (new Set(array)).size !== array.length

export const handleJSONError = (err: any) => {
	try {
		const errorsJson = JSON.parse(err.response?.data?.detail);
		if (errorsJson.logs && errorsJson.logs.length > 0) {
			let detail: string = '';
			errorsJson.logs.forEach((item: any) => detail += `${item.message}\r\n`);
			return { detail, logs: errorsJson.logs };
		}
	} catch (error: any) {
		return err.response?.data?.detail;
	}

	return err.response?.data?.detail;
}

export const checkLimitSmartSwapRequisition = (settedValues: any) => {
	const baseCheckUrl = `${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}SmartSwap`;

	/// phase 1 - check limit folderNumber => 50
	let folderNumber: string = '';
	if (settedValues?.foldersNumber && settedValues?.foldersNumber !== "" && typeof settedValues?.foldersNumber === "string") {
		const folderNumbers: string[] = settedValues?.foldersNumber.split(";");
		if (folderNumbers.length > 50)
			return { isLimited: true, msg: t('dataImport:smartswap.filter.modal.limitFolders') }

		folderNumbers.forEach((folder: string) => folderNumber += `folderNumber=${folder}&`);
	}

	const newParams = settedValues;
	delete newParams.folderNumber;

	/// phase 2 - check limit characteres from browser => 2048
	const res = axios.getUri({
		url: `${baseCheckUrl}/get-smart-swap?${folderNumber.replace(/.$/, '')}`,
		params: newParams,
	});

	if (res.replace(baseCheckUrl, '').length >= 2048)
		return { isLimited: true, msg: t('dataImport:smartswap.filter.modal.limitQuery') }

	return { isLimited: false, msg: '' };
}

export const handleGender = (gender: number | string | undefined) => {
	if (typeof gender === 'string')
		gender = Number(gender)

	return gender === 0 ? 'Masculino' : (gender === 1 ? 'Feminino' : '');
}

export const genderToNumber = (gender: string) => {
	return gender === 'Masculino' ? 0 : 1;
}

export const accuratelyConvertDecimal = (value: number, fixed: number): number => {
	return parseFloat(value.toFixed(fixed));
}

export const sortArrayObj = (array: any, name: string) => array.sort((a: any, b: any) => (a[name] > b[name]) ? 1 : ((b[name] > a[name]) ? -1 : 0));

export const getAxiosError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		return error;
	}
	return null;
}

export const getBitFlagArray = (values: object, target: number) => {
	return Object.keys(values)
		.map((key) => (Number(key) & target ? key : null))
		.filter((x) => x !== null)
		.map(x => x!.toString())
};

export const convertFileToBase64 = (file: any) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export type GenericObject = { [key: string]: any };

export const modifyProperty = (obj: GenericObject, propsToChange: string[], changeFunction: (value: any) => any): void => {
	for (const prop in obj) {
		if (propsToChange.includes(prop)) {
			obj[prop] = changeFunction(obj[prop]);
		}

		if (typeof obj[prop] === 'object' && obj[prop] !== null) {
			modifyProperty(obj[prop], propsToChange, changeFunction);
		}

		if (Array.isArray(obj[prop])) {
			for (let i = 0; i < obj[prop].length; i++) {
				modifyProperty(obj[prop][i], propsToChange, changeFunction);
			}
		}
	}
}

export  const updateNullValuesToZeroS2500 = (array: any) => {
	for (const element of array) {
	  if (element.idePeriodo) {
		for (const period of element.idePeriodo) {
		  period.vrBcCpMensal = period.vrBcCpMensal === null ? 0 : period.vrBcCpMensal;
		  period.vrBcCp13 = period.vrBcCp13 === null ? 0 : period.vrBcCp13;
		  period.perRef = period.perRef?.substring(0, 7)
		}
	  }
	}
  }

  export  const updateNullValuesToZeroS2501 = (array: any) => {
	for (const element of array) {
	  if (element.calcTrib) {
		for (const period of element.calcTrib) {
		  period.vrBcCpMensal = period.vrBcCpMensal === null ? 0 : period.vrBcCpMensal;
		  period.vrBcCp13 = period.vrBcCp13 === null ? 0 : period.vrBcCp13;
		  period.perRef = period.perRef?.substring(0, 7)
		}
	  }
	}
  } 

export const validateProperty = (
	obj: GenericObject,
	propsToValidate: string[],
	validateFunction: (value: any) => boolean,
	currentPath: string = ''
): string[] => {
	let invalidPaths: string[] = [];

	for (const prop in obj) {
		const newPath = currentPath ? `${currentPath}.${prop}` : prop;

		if (propsToValidate.includes(prop) && !validateFunction(obj[prop])) {
			invalidPaths.push(newPath);
		}

		if (typeof obj[prop] === 'object' && obj[prop] !== null) {
			invalidPaths = invalidPaths.concat(validateProperty(obj[prop], propsToValidate, validateFunction, newPath));
		}

		if (Array.isArray(obj[prop])) {
			for (let i = 0; i < obj[prop].length; i++) {
				const itemPath = `${newPath}.${i}`;
				invalidPaths = invalidPaths.concat(validateProperty(obj[prop][i], propsToValidate, validateFunction, itemPath));
			}
		}
	}

	return invalidPaths;
}

export type ValidationSettings = { [key: string]: { validateFunction: (value: any) => boolean, type: string } };

export const getInvalidPropertyPaths = (
	obj: GenericObject,
	validationSettings: ValidationSettings,
	currentPath: string = ''
): string[] => {
	let invalidPaths: string[] = [];

	for (const prop in obj) {
		let newPath = currentPath ? `${currentPath}.${prop}` : prop;

		if (validationSettings[prop] && !validationSettings[prop].validateFunction(obj[prop])) {
			newPath = `${newPath}.${validationSettings[prop].type}`;
			invalidPaths.push(newPath);
		}

		if (typeof obj[prop] === 'object' && obj[prop] !== null) {
			invalidPaths = invalidPaths.concat(getInvalidPropertyPaths(obj[prop], validationSettings, newPath));
		}

		if (Array.isArray(obj[prop])) {
			for (let i = 0; i < obj[prop].length; i++) {
				const itemPath = `${newPath}.${i}`;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				invalidPaths = invalidPaths.concat(getInvalidPropertyPaths(obj[prop][i], validationSettings, itemPath));
			}
		}
	}

	return invalidPaths;
}


export const getEnvironment = (): string => {
	const envUrl: string = import.meta.env.REACT_APP_BASE_URL_PAYMENTS;

	if (envUrl.includes("dev")) {
		return "DEV";
	}
	if (envUrl.includes("qas")) {
		return "QAS";
	}
	if (envUrl.includes("brf-api-iuris-pagamentos")) {
		return "PRD";
	}
	return "Unknown";
};


export const toCleanedId = (value: any): string => {
	if (typeof value === 'string') {
		return value.replace(/\D/g, '');
	}
	return value;
};

export const emptyStringToNull = (value: any): any => {
	if (value === "") {
		return null;
	}
	return value;
};

export const emptyStringToNullOrToNumber = (value: any): any => {
	if (value === "" || value === null || value === 0) {
		return null;
	}
	return toNumber(value);
};
export const emptyStringToNullOrToNumberNotValue = (value: any): any => {
	if (value === "" || value === null) {
		return null;
	}
	return toNumber(value);
};

export const nullToZero = (value: any): any => {
	if(value === null){
		return 0
	}
}

export const truncateDate = (value: any): string => {
	if (typeof value === 'string') {
		// Expressão regular para validar o formato de data 'YYYY-MM-DD'
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

		// Verifica se o valor corresponde ao formato de data esperado
		if (dateRegex.test(value)) {
			// Retorna apenas os componentes de ano e mês
			return value.substring(0, 7);
		}
	}
	return value;
};
export const truncateDateYear = (value: any): string => {
	if (typeof value === 'string') {
		// Expressão regular para validar o formato de data 'YYYY-MM-DD'
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

		// Verifica se o valor corresponde ao formato de data esperado
		if (dateRegex.test(value)) {
			// Retorna apenas os componentes de ano e mês
			return value.substring(0, 4);
		}
	}
	return value;
};

export const addFirstDayToDate = (date: string): string => {
	if (typeof date === 'string' && /^\d{4}-\d{2}$/.test(date)) {
		return `${date}-01`;
	}
	return date;
};

export const formatDate = (date: string): string => {
	if (typeof date === 'string') {
		return date.split('T')[0];
	}
	return date;
};

export const stringToCpforCnpj = (value: string) => {
	if(value.length === 11){
		return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
	} else if (value.length === 14){
		return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
	} else {
		return value
	}
}


export const deepCopy = (obj: any): any => {
	return JSON.parse(JSON.stringify(obj));

	// if (obj === null || typeof obj !== 'object') {
	// 	return obj;
	// }

	// if (Array.isArray(obj)) {
	// 	return obj.map(item => deepCopy(item));
	// }

	// const copiedObj = {} as { [key: string]: any };
	// for (const key in obj) {
	// 	copiedObj[key] = deepCopy(obj[key]);
	// }
	// return copiedObj;
};
