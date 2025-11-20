
import { getOptionsAsObject } from 'src/core/utils/func';

export enum STATUS_CLOSURE {
	RELEASED,
	CLOSURE,
	BLOKED
};

export const statusClosureAsOptions = [
	{ value: STATUS_CLOSURE.RELEASED, label: 'Liberado' },
	{ value: STATUS_CLOSURE.CLOSURE, label: 'Fechamento' },
	{ value: STATUS_CLOSURE.BLOKED, label: 'Bloqueado' }
];

export const statusClosureText = getOptionsAsObject(statusClosureAsOptions);