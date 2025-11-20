export const circularizationStatusAsOptions = [
	{ label: 'Nenhum', value: -1},
	{ label: 'Pendente', value: 1},
	{ label: 'Aguardando Validação Área Jurídica', value: 2},
	{ label: 'Devolvido Escritório', value: 3},
	{ label: 'Aguardando Aprovação Gestor', value: 4},
	{ label: 'Aprovado Circularização', value: 5},
	{ label: 'Reprovado Circularização', value: 6},
	{ label: 'Não se aplica', value: 20},
];

export const circularizationStatusToShow = [
	...circularizationStatusAsOptions,
	{ label: "Criado", value: 0},
	{ label: "Processando Inclusão de Registros", value: 7},
	{ label: "Processando Atualização de Registros", value: 8},
	{ label: "Não há registros a processar", value: 9},
	{ label: "Aguardando envio", value: 10},
	{ label: "Cancelado", value: 11}
];

export const circularizationStatusFilterAsOptions = [
	{ label: "Pendente", value: 1},
	{ label: "Aguardando Validação Área Jurídica", value: 2},
	{ label: "Devolvido Escritório", value: 3},
	{ label: "Aguardando Aprovação Gestor", value: 4},
	{ label: "Aprovado Circularização", value: 5},
	{ label: "Reprovado Circularização", value: 6},
	{ label: "Removido - Não há registros à processar", value: 9},
];