import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Modulos } from 'src/core/models/modules';
import { TPaymentType } from 'src/core/models/payment-type';
import { actions } from 'src/core/store';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { usePagination } from 'src/hooks/pagination';
import {
	getItemPaymentType,
	getStatusPaymentType,
} from 'src/core/store/modules/payment-type/selectors';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';

export const useActionTipoPagamento = (modulo: Modulos, route: string) => {
	const history = useHistory();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const status = useSelector(getStatusPaymentType);
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
			enqueueSnackbar(getMessage(), {
				variant: 'success',
			});
			dispatch(fetchPaymentType({ page, pageSize, modulo }));
			history.push(route);
		}

		if (status === 'failure') {
			enqueueSnackbar('Ocorreu um erro', {
				variant: 'error',
			});
			dispatch(actions.paymentType.clearStatus());
		}
	}, [
		page,
		getMessage,
		enqueueSnackbar,
		history,
		status,
		dispatch,
		modulo,
		pageSize,
		route,
	]);
};

export const useTipoPagamentoInitialValues = (
	modulo: Modulos
): TPaymentType => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const item = useSelector(getItemPaymentType);
	const [hasItem] = useState(Object.keys(item ?? {}).length > 0);
	const { pageSize } = usePagination()

	useEffect(() => {
		if (isNew) return;
		if (!hasItem) {
			dispatch(fetchPaymentMethod({ moduloId: modulo }));
			dispatch(fetchPaymentType({ id: Number(id), modulo }));
		}

		return () => {
			dispatch(actions.paymentType.setItem({}));
			dispatch(fetchPaymentType({ page: 1, pageSize, modulo }));
		};
	}, [isNew, hasItem, id, dispatch, modulo, pageSize]);
	
	return {
		status: item?.status ?? true,
		financeChartOfAccountsCategoryId: item.financeChartOfAccountsCategoryId,
		financeChartOfAccountsCategory: item.financeChartOfAccountsCategory,
		moduloId: modulo,
		formasPagamentoIds: item?.formasPagamentoIds ?? [],
		solicitarPagamentoBaixaProvisoria: item?.solicitarPagamentoBaixaProvisoria ?? false,
		cancelamentoAutomatico: item?.cancelamentoAutomatico ?? false,
		abaterSaldoProvisao: item?.abaterSaldoProvisao ?? 0,
		gerarBensGarantias: item?.gerarBensGarantias ?? false,
		eSocialRestriction: item?.eSocialRestriction ?? false,
		uploadESocialPJC: item?.uploadESocialPJC ?? false,
		alterarStatusProcesso: item?.alterarStatusProcesso ?? false,
		generateGuideFiles: item?.generateGuideFiles ?? 0,
		gerarCalculoPagamento: item?.gerarCalculoPagamento ?? false,
		contabilizarPagamentoSap: item?.contabilizarPagamentoSap ?? false,
		importarDados: item?.importarDados ?? false,
		disponibilizarComprovantePagamento: item?.disponibilizarComprovantePagamento ?? false,
		contabilizarCreditoSap: item?.contabilizarCreditoSap ?? false,
		processType: item?.processType ?? '',
		resultProcessFolder: item?.resultProcessFolder ?? 0,
		exceptionRules: item?.exceptionRules ?? [],
		contabilizarCcPorAreaDejur: item?.contabilizarCcPorAreaDejur ?? true,
		retificacaoESocial: item?.retificacaoESocial ?? false,
		folderNumberRequired: item?.folderNumberRequired === true ? true : false
	};
};
