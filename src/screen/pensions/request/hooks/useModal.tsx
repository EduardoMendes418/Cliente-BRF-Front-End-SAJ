import { modal } from 'src/components/modals'
import Modal, { Props as SupplierProps } from '../components/UpdateSupplierModalPensions'
import { t } from 'src/locale/i18n';

export const useUpdateSupplierModal = () => {
	const showModal = (props: SupplierProps) => {
		modal({
			title: t("solicitacaoPagamento:dadosFavorecido.supplierChangeButton"),
			component: <Modal {...props} />,
			dialogProps: { maxWidth: 'lg', showCloseButton: false, fullWidth: true },
			buttons: []
		})
	}

	return {
		showModal
	}
}