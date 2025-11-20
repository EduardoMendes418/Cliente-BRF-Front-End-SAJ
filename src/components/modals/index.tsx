import { Typography } from '@material-ui/core';
import { ReactNode } from 'react';
import { v4 } from 'uuid';

import reduxStore, { actions } from 'src/core/store';
import { t } from 'src/locale/i18n';

import Modal, { ModalButton, DialogAllowedProps } from './Modal';

interface MessageBoxParams {
	title: string;
	message: string;
	message2?: string;
	details: string;
	buttons: ModalButton[];
}
interface ModalParams {
	title: string;
	component: ReactNode | string;
	buttons?: ModalButton[];
	dialogProps?: DialogAllowedProps;
	onCloseAction?: () => void;
}

interface ModalInstance {
	id: string;
	component: ReactNode;
}

/// Array de modais ativos
const ActiveModals: ModalInstance[] = [];

// Botões padrão
const OkButton = {
	text: t('ok'),
	value: true,
};
const YesButton = {
	text: t('sim'),
	value: true,
};
const NoButton = {
	text: t('nao'),
	value: false,
};

const CancelButton = {
	text: 'cancelar',
	value: false
}

// Métodos que são equivalentes aos fornecidos pelo Browser
function alert(message: string, title?: string, details?: string) {
	return messageBox({
		title: title ?? window.document.title,
		message,
		details: details ?? '',
		buttons: [OkButton],
	});
}

function confirm(message: string, title?: string, details?: string, cancelButton?: boolean) {
	return messageBox({
		title: title ?? window.document.title,
		message,
		details: details ?? '',
		buttons: cancelButton == true ?  [OkButton, CancelButton] : [YesButton, NoButton],
	});
}

function confirmEsocial(message: string, message2: string, title?: string, details?: string, cancelButton?: boolean) {
	return messageBoxEsocial({
		title: title ?? window.document.title,
		message,
		message2,
		details: details ?? '',
		buttons: cancelButton == true ?  [OkButton, CancelButton] : [YesButton, NoButton],
	});
}

function messageBoxEsocial(opts: MessageBoxParams) {
	const { title, message, buttons, details, message2 } = opts;

	return modal({
		title,
		component: 
			<>
				<Typography paragraph>{ message }</Typography>
				<Typography paragraph>{ message2 }</Typography>
				<Typography paragraph>{ details }</Typography>
			</>,
		buttons,
	});
}

function messageBox(opts: MessageBoxParams) {
	const { title, message, buttons, details } = opts;

	return modal({
		title,
		component: 
			<>
				<Typography paragraph>{ message }</Typography>
				<Typography paragraph>{ details }</Typography>
			</>,
		buttons,
	});
}

/// Método para abrir um modal com um corpo especificado pelo usuário
function modal(opts: ModalParams) {
	const { title, buttons, component, dialogProps } = opts;
	const dispatch = reduxStore.dispatch;

	return new Promise((resolve) => {
		const modalId = v4();
		const onClose = (val: any) => {
			const modalIdx = ActiveModals.findIndex((m) => m.id === modalId);
			if (modalIdx >= 0) ActiveModals.splice(modalIdx, 1);

			dispatch(actions.modal.close({ modalId }));
			opts.onCloseAction && opts.onCloseAction();
			resolve(val);
		};

		const modalInst = (
			<Modal
				{...dialogProps}
				title={title}
				buttons={buttons ?? [OkButton]}
				onClose={onClose}
			>
				{component}
			</Modal>
		);

		ActiveModals.push({
			id: modalId,
			component: modalInst,
		});
		reduxStore.dispatch(actions.modal.open({ modalId }));
	});
}

export { alert, confirm, confirmEsocial, messageBox, modal, ActiveModals };
