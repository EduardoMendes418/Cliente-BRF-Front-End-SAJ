import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { t } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import {
	getErrorMessageGoodsGuaranteesEstimates,
	getStatusGoodsGuaranteesEstimates
} from 'src/core/store/modules/goods-guarantee-estimates/selectors';

import { useHandleRequestError } from '.';

export const useGoodsAndGuaranteesBudgetsRequestResult = (route: string) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { showRequestError } = useHandleRequestError()

	const status = useSelector(getStatusGoodsGuaranteesEstimates);
	const error = useSelector(getErrorMessageGoodsGuaranteesEstimates);

	const getMessage = useCallback(() => {
		switch (status) {
			case 'added':
				return t('goodsAndGuarantees:form.successMessage');
			case 'edited':
				return t('goodsAndGuarantees:form.successEditMessage');
		}
	}, [status]);

	useEffect(() => {
		if (status === 'added' || status === 'edited') {
			enqueueSnackbar(getMessage(), { variant: 'success' });
			setTimeout(() => history.push(route), 1300);
		}

		if (status === 'failure') {
			showRequestError(error, () => dispatch(actions.goodsGuaranteesEstimates.clearStatus()));
		}
	}, [
		error,
		route,
		status,
		history,
		dispatch,
		getMessage,
		enqueueSnackbar,
		showRequestError
	]);
};
