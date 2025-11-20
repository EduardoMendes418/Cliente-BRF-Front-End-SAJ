import { t } from 'src/locale/i18n'

export const validateRequiredKeys = (
	obj: Record<string, string | number>,
	setFieldError: (field: string, msg: string) => void,
) => {
	let succeeded = true
	Object.entries(obj).forEach(([key, value]) => {
		if (value === undefined || value === '') {
			setFieldError(key, t('required'))
			succeeded = false
		}
	})
	return succeeded
}
