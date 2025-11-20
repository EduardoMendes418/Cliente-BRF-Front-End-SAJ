export enum STATUS_WATSON {
	GENERAL_BASIS = 1,
	GENERAL_BASIS_DEAD = 2,
	GUARANTEE = 3,
	CONVERTED_DEPOSIT = 4,
	COURT_PAYMENT = 5,
	RT = 6,
	RETURN_FILE = 7,
	CLASSIC_PROCESSES = 8,
	LOG_CONTABILIZATION = 9
}

export enum CONTINGENCY_ENUM {
	ATIVA = 1,
	PASSIVA = 2
}

export const contingencyEnumAsOptions = [
	{ value: CONTINGENCY_ENUM.ATIVA, label: 'Ativa' },
	{ value: CONTINGENCY_ENUM.PASSIVA, label: 'Passiva' },
]

export const statusWatsonAsOptions = [
	{ value: STATUS_WATSON.GENERAL_BASIS, label: 'Base_Complemento' },
	{ value: STATUS_WATSON.GENERAL_BASIS_DEAD, label: 'Base_Encerramento' },
	{ value: STATUS_WATSON.GUARANTEE, label: 'Garantia' },
	{ value: STATUS_WATSON.CONVERTED_DEPOSIT, label: 'PrestConta_Despesado' },
	{ value: STATUS_WATSON.COURT_PAYMENT, label: 'Pagamento_Judicial' },
	{ value: STATUS_WATSON.RT, label: 'Índice' },
	{ value: STATUS_WATSON.RETURN_FILE, label: 'Arquivo_Retorno' },
	{ value: STATUS_WATSON.CLASSIC_PROCESSES, label: 'Processos_Classicos' },
	{ value: STATUS_WATSON.LOG_CONTABILIZATION, label: 'Log Contabilização' },
]