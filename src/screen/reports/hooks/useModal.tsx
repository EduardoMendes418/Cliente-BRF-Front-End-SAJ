import { useCallback } from 'react';

import { modal } from 'src/components/modals';
import { t } from 'src/locale/i18n';

import CustomFieldsModal from '../components/CustomFieldsModal'
import NameFilterModal from '../components/NameFilterModal'
import { Props as CustomFieldsProps } from '../components/CustomFieldsModal'
import { Props as NameFilterProps } from '../components/NameFilterModal'

export const useCustomFieldModal = () => {
	const showModal = (props: CustomFieldsProps) => {
		modal({
			title: t('reports:modal.title'),
			component: <CustomFieldsModal {...props} />,
			buttons: [],
			dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true }
		})
	}

	return {
		showModal
	}
}

export const useFieldNameModal = () => {
	const showModal = useCallback(({ onCloseAction, ...props }: NameFilterProps & { onCloseAction: () => void }) => {
		modal({
			title: t('reports:filterName'),
			component: <NameFilterModal {...props} />,
			buttons: [],
			dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
			onCloseAction
		})
	}, [])

	return { showModal }
}