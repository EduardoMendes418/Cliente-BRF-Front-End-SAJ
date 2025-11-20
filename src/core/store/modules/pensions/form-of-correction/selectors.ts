import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { Error } from './index'

const state = (state: RootState) => state.pensions.formOfCorrection;

export const getFormOfCorrectionList = createSelector(
	[state],
	(state) => state.list
);

export const getFormOfCorrectionItem = createSelector(
	[state],
	(state) => state.item
);

export const getFormOfCorrectionStatus = createSelector(
	[state],
	(state) => state.status
);
export const getFormOfCorrectionError = createSelector(
	[state],
	({ error }) => error as Error
);

export const getFormOfCorrectionErrorMessage = createSelector(
	[getFormOfCorrectionList, getFormOfCorrectionError],
	(list, error) => {
		if (!error.error) return {};

		const { detail } = error.error;

		switch (detail) {
			// case 'Existe um ou mais Tipos de Pagamento vinculado a esta Forma de Pagamento':
			// 	return {
			// 		title: 'Não é possível desativar essa forma de pagamento',
			// 		message: `A forma de pagamento ${forma} está vinculada a algum tipo de pagamento e não poderá ser excluída.`,
			// 	};
			default:
				return {
					title: 'Ocorreu um erro',
					message: detail,
				};
		}
	}
);

export const getFormOfCorrectionIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getFormOfCorrectionIsSaving = createSelector(
	[state],
	(state) => state.status === 'saving'
);

export const getFormOfCorrectionIsFailure = createSelector(
	[state],
	(state) => state.status === 'failure'
);

export const getFormOfCorrectionIsEmpty = createSelector(
	[getFormOfCorrectionList, getFormOfCorrectionIsFetching],
	(list, isFetching) => list.length === 0 && !isFetching
);

export const getFormOfCorrectionAsOptions = createSelector(
	[getFormOfCorrectionList],
	(list) =>
		list.map((item) => {
			return { label: item.descricao, value: item.id ?? '' };
		})
);
