import { createSelector } from '@reduxjs/toolkit';
import { TOptionsSelect } from 'src/components/form';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { RootState } from 'src/core/store';
import { State, TError } from './index'

const state = (state: RootState) => state.paymentMethod;

export const getListPaymentMethod = createSelector(
	[state],
	(state) => {
		return state.list ?? []
	}
);

export const getItemPaymentMethod = createSelector(
	[state],
	(state) => state.item
);

export const getStatusPaymentMethod = createSelector(
	[state],
	(state) => state.status
);

export const getErrorPaymentMethod = createSelector(
	[state],
	({ error }) => error as TError
);

export const getErrorMessagePaymentMethod = createSelector(
	[getListPaymentMethod, getErrorPaymentMethod],
	(list, error) => {
		if (!error.error) return {};

		const forma = list.find((item) => item.id === error.id)?.descricao;
		const { detail } = error.error;

		switch (detail) {
			case 'Existe um ou mais Tipos de Pagamento vinculado a esta Forma de Pagamento':
				return {
					title: 'Não é possível desativar essa forma de pagamento',
					message: `A forma de pagamento ${forma} está vinculada a algum tipo de pagamento e não poderá ser excluída.`,
				};
			default:
				return {
					title: 'Ocorreu um erro',
					message: detail,
				};
		}
	}
);

export const getLoadingPaymentMethod = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getSavingPaymentMethod = createSelector(
	[state],
	(state) => state.status === 'saving'
);

export const getIsFailurePaymentMethod = createSelector(
	[state],
	(state) => state.status === 'failure'
);

export const getListAsOptionPaymentMethod = createSelector(
	[getListPaymentMethod],
	(list) => {
		const options: {
			label: string;
			value: number;
		}[] = [];

		list.forEach((item) => {
			if (item.id && item.status)
				options.push({ label: item.descricao, value: item.id });
		});

		return options;
	}
);

export const getListAsOptionOfAllPaymentMethods = createSelector(
	[getListPaymentMethod],
	(list) => {
		const options: { label: string;	value: number }[] = [];

		list.forEach((item) => {
			if (item.id) options.push({ label: item.descricao, value: item.id });
		});

		return options;
	}
);

export const getPaymentMethodByID = createSelector(
	[getListPaymentMethod],
	(list) => {
		const a: {
			[key: number]: TPaymentMethod;
		} = {};

		list.forEach((item) => {
			if (!item.id) return;
			a[item.id] = item;
		});

		return a;
	}
);

export const getSelectedListPaymentMethod = createSelector(
	[state],
	({ selectedList }: State) => selectedList
);

export const getSelectedListAsOptionsPaymentMethod = createSelector(
	[state],
	({ selectedList }: State) => selectedList.map(({ id, descricao }) => ({ label: descricao, value: id }) as TOptionsSelect)
);
