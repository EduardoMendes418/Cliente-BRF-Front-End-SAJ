import * as yup from 'yup';

import { t } from 'src/locale/i18n';

export const currencyValidator = yup
	.number()
	.min(0.01, t('required'))
	.required(t('required'))
	.typeError(t('required'));

export const numberValidator = yup
	.number()
	.required(t('required'))
	.typeError(t('required'));

export const textValidator = yup
	.string()
	.required(t('required'));

export const dateValidator = yup
	.date()
	.required(t('required'))
	.nullable();