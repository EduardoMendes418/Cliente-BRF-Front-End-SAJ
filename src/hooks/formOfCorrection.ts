import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { TFormOfCorrection } from 'src/core/models/pensions';
import { actions } from 'src/core/store';
import {
	getFormOfCorrectionErrorMessage,
	getFormOfCorrectionItem,
	getFormOfCorrectionStatus,
} from 'src/core/store/modules/pensions/form-of-correction/selectors';
import { fetchFormOfCorrection } from 'src/core/store/modules/pensions/form-of-correction/thunks';
import { t } from 'src/locale/i18n';

export const useFetchFormOfCorrection = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchFormOfCorrection());
	}, [dispatch]);
};

export const useActionFormOfCorrection = () => {
	const history = useHistory();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const status = useSelector(getFormOfCorrectionStatus);
	const error = useSelector(getFormOfCorrectionErrorMessage);

	const getMessage = useCallback(() => {
		switch (status) {
			case 'added':
				return t('pension:request.configurations.successAddMessage');
			case 'edited':
				return t('pension:request.configurations.successEditMessage');
			case 'deleted':
				return t('pension:request.configurations.successDeleteMessage');
		}
	}, [status]);

	useEffect(() => {
		if (status === 'added' || status === 'edited' || status === 'deleted') {
			enqueueSnackbar(getMessage(), { variant: 'success' });
			dispatch(fetchFormOfCorrection());
			history.push('/configuracoes/pensoes/forma-correcao');
		}

		if (status === 'failure') {
			enqueueSnackbar(error.message || 'Erro desconhecido', { variant: 'error' });
			dispatch(actions.pensions.formOfCorrection.clearStatus());
		}
	}, [getMessage, enqueueSnackbar, history, status, dispatch, error]);
};

export const useFormOfCorrectionInitialValues = (): TFormOfCorrection => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const item = useSelector(getFormOfCorrectionItem);
	const [hasItem] = useState(Object.keys(item ?? {}).length > 0);

	useEffect(() => {
		if (isNew) return;
		if (!hasItem) dispatch(fetchFormOfCorrection());

		return () => {
			dispatch(actions.pensions.formOfCorrection.setItem({}));
		};
	}, [isNew, hasItem, id, dispatch]);

	return {
		descricao: item.descricao ?? '',
	};
};
