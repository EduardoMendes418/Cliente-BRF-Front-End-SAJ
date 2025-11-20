export type TPaymentTypeMethod = {
	id?: number;
	tipoPagamentoId: number;
	tipoPagamentoDescricao: string;
	formaPagamentos: {
		formaPagamentoId: number;
		formaPagamentoDescricao: string;
		formulario: string;
	}[];
};

export type TAddPaymentTypeMethod = {
	tipoPagamentoId: number;
	changedPaymentMethod: {
		[key: string]: {
			formaPagamentoId: number;
			formulario: string;
		};
	};
};
