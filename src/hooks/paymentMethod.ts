import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { actions } from 'src/core/store';
import {
	getErrorMessagePaymentMethod,
	getItemPaymentMethod,
	getStatusPaymentMethod,
} from 'src/core/store/modules/payment-method/selectors';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { Modulos } from 'src/core/models/modules';
import { usePagination } from 'src/hooks/pagination';

export const useFetchFormaPagamento = (moduloId: Modulos) => {
	const dispatch = useDispatch();

	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetchPaymentMethod({ page, pageSize, moduloId }));
	}, [page, pageSize, dispatch, moduloId]);
};

export const useActionFormaPagamento = (moduloId: Modulos, route: string) => {
	const history = useHistory();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const status = useSelector(getStatusPaymentMethod);
	const error = useSelector(getErrorMessagePaymentMethod);
	const { page, pageSize } = usePagination();


	const getMessage = useCallback(() => {
		switch (status) {
			case 'added':
				return `Registro adicionado com sucesso!`;
			case 'edited':
				return `Registro editado com sucesso!`;
			case 'deleted':
				return `Registro deletado com sucesso!`;
		}
	}, [status]);

	useEffect(() => {
		if (status === 'added' || status === 'edited' || status === 'deleted') {
			enqueueSnackbar(getMessage(), { variant: 'success' });
			dispatch(fetchPaymentMethod({ page, pageSize, moduloId }));
			history.push(route);
		}

		if (status === 'failure') {
			enqueueSnackbar(error.message || 'Erro desconhecido', { variant: 'error' });
			dispatch(actions.paymentMethod.clearStatus());
		}
	}, [
		getMessage,
		enqueueSnackbar,
		history,
		status,
		dispatch,
		error,
		moduloId,
		page,
		pageSize,
		route,
	]);
};

export const useFormaPagamentoInitialValues = (
	moduloId: Modulos
): TPaymentMethod => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const item = useSelector(getItemPaymentMethod);
	const [hasItem] = useState(Object.keys(item ?? {}).length > 0);

	useEffect(() => {
		if (isNew) return;
		if (!hasItem) dispatch(fetchPaymentMethod({ id: Number(id), moduloId }));

		return () => {
			dispatch(actions.paymentMethod.setItem({}));
		};
	}, [isNew, hasItem, id, dispatch, moduloId]);

	return {
		descricao: item.descricao ?? '',
		moduloId,
		status: item.status ?? true,
	};
};
