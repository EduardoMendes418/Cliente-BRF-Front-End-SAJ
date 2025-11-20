import { Modulos } from './modules';

export type TPaymentMethod = {
	id?: number;
	descricao: string;
	status?: boolean;
	moduloId: Modulos;
};
