import { modal } from "src/components/modals";
import { useTranslation } from "src/locale/i18n";
import Modal, { ModalProps } from "../Modal";

const useModal = () => {
	const { t } = useTranslation();

	const showModal = (props: ModalProps) => {
		modal({
			title: t("settings:report.modal.title"),
			component: <Modal {...props} />,
			dialogProps: {
				showCloseButton: true,
				maxWidth: "lg",
			},
			buttons: [],
		});
	};

	return { showModal };
};

export default useModal;
