import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { TPaymentTypeMethod } from '../core/models/payment-type-method';
import { actions } from 'src/core/store';
import {
	getItemPaymentTypeMethod,
	getStatusPaymentTypeMethod,
} from 'src/core/store/modules/payment-type-method/selectors';
import { fetchPaymentTypeMethod } from 'src/core/store/modules/payment-type-method/thunks';
import { Modulos } from 'src/core/models/modules';

export const useActionRelacaoTipoFormaPagamento = () => {
	const history = useHistory();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const status = useSelector(getStatusPaymentTypeMethod);

	const getMessage = useCallback(() => {
		switch (status) {
			case 'added':
				return `Registro adicionado com sucesso!`;
			case 'edited':
				return `Registro editado com sucesso!`;
		}
	}, [status]);

	useEffect(() => {
		if (status === 'added' || status === 'edited') {
			enqueueSnackbar(getMessage(), {
				variant: 'success',
			});
			history.push('/configuracoes/pagamentos/relacao-tipo-forma');
		}

		if (status === 'failure') {
			enqueueSnackbar('Ocorreu um erro', {
				variant: 'error',
			});
			dispatch(actions.paymentMethod.clearStatus());
		}
	}, [getMessage, enqueueSnackbar, history, status, dispatch]);
};

export const useRelacaoTipoFormaPagamentoInitialValues =
	(): TPaymentTypeMethod => {
		const dispatch = useDispatch();
		const { id } = useParams<{ id: string }>();
		const isNew = id === 'novo';
		const item = useSelector(getItemPaymentTypeMethod);
		const [hasItem] = useState(Object.values(item ?? {}).length > 0);

		useEffect(() => {
			dispatch(fetchPaymentMethod({ moduloId: Modulos.Pagamento }));
			dispatch(fetchPaymentType({ modulo: Modulos.Pagamento, status: true }));

			if (isNew) {
				dispatch(fetchPaymentTypeMethod({ status: true }));
				return;
			}

			if (!hasItem) {
				dispatch(
					fetchPaymentTypeMethod({ tipoPagamentoID: Number(id), status: true })
				);
				return;
			}

			return () => {
				dispatch(actions.paymentTypeMethod.setItem({}));
			};
		}, [isNew, hasItem, id, dispatch]);

		return {
			tipoPagamentoId: item?.tipoPagamentoId ?? '',
			tipoPagamentoDescricao: item?.tipoPagamentoDescricao ?? '',
			formaPagamentos: item?.formaPagamentos ?? [],
		};
	};
