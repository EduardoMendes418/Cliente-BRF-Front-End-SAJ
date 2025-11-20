import { TYPE_DOCUMENTS, RADIO_OPTIONS, FOLDER_OPTIONS } from 'src/core/models/data-import';
export const typeOptions = [
	{ value: TYPE_DOCUMENTS.PAYMENT, label: 'Pagamento' },
	{ value: TYPE_DOCUMENTS.PENSION, label: 'Pensão' },
	{ value: TYPE_DOCUMENTS.ACCOUNTABILITY, label: 'Prestação de contas garantia' },
	{ value: TYPE_DOCUMENTS.OTHER_LEGAL_ONE_DOCUMENTS, label: 'Documentos Legal One' },
	{ value: TYPE_DOCUMENTS.REQUEST, label: "Requisições" }
];

export const radioOption = [
	{ label: 'Sim', value: RADIO_OPTIONS.YES },
	{ label: 'Não', value: RADIO_OPTIONS.NO },
	{ label: 'Ambos', value: RADIO_OPTIONS.BOTH },
];

export const folderOption = [
	{ label: 'Todas', value: FOLDER_OPTIONS.ALL },
	{ label: 'Principal', value: FOLDER_OPTIONS.MAIN },
	{ label: 'Vinculada', value: FOLDER_OPTIONS.LINKED },
];