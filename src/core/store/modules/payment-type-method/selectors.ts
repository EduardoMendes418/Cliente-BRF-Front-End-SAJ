import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from '.';
import { sortArrayObj } from 'src/core/utils/func';

const state = (state: RootState) => state.paymentTypeMethod;

export const getListPaymentTypeMethod = createSelector(
	[state],
	(state: State) => state.list
);

export const getItemPaymentTypeMethod = createSelector(
	[state],
	(state: State) => state.item
);

export const getStatusPaymentTypeMethod = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingPaymentTypeMethod = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

type TableData = {
	id: number;
	tipoPagamentoID: number;
	tipoPagamento: string;
	formasPagamento: string[];
	formularios: string[];
}[];

export const getTablePaymentTypeMethod = createSelector(
	[getListPaymentTypeMethod],
	(list) => {
		const tableData: TableData = [];
		const getFormulario = (formulario: string) => {
			switch (formulario) {
				case 'fgts':
					return 'FGTS';
				case 'guia':
					return 'Guia';
				case 'gps':
					return 'GPS';
				case 'irrf':
					return 'IRRF';
				default:
					return 'Default';
			}
		};

		list.forEach((item) => {
			const formasPagamento: string[] = [];
			const formularios: string[] = [];
			item.formaPagamentos.forEach((formaPagamento) => {
				formasPagamento.push(formaPagamento.formaPagamentoDescricao);
				formularios.push(getFormulario(formaPagamento.formulario));
			});

			tableData.push({
				id: item.tipoPagamentoId,
				tipoPagamentoID: item.tipoPagamentoId,
				tipoPagamento: item.tipoPagamentoDescricao,
				formasPagamento,
				formularios,
			});
		});

		return sortArrayObj(tableData, "tipoPagamento");
	}
);

export const getFormByPaymentMethodByPaymentType = createSelector(
	[getItemPaymentTypeMethod],
	(item) => {
		const arr: {
			[tipoPagamentoID: number]: {
				[formaPagamentoID: number]: string;
			};
		} = {};
		if (item.formaPagamentos) {
			arr[item.tipoPagamentoId] = [];
			item.formaPagamentos.forEach((formaPagamento) => {
				arr[item.tipoPagamentoId][formaPagamento.formaPagamentoId] =
					formaPagamento.formulario;
			});
		}
		return arr;
	}
);
