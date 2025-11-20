import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

import { t } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { getStatusParameterization } from 'src/core/store/modules/parameterization/selectors';
import { useHandleRequestError } from '.';

export const useActionParameterization = (route?: string) => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { showRequestError } = useHandleRequestError()
	const history = useHistory();

	const status = useSelector(getStatusParameterization);

	useEffect(() => {
		if (status === 'edited') {
			enqueueSnackbar(t('recordEditedSuccessfully'), {
				variant: 'success',
			});
			route && history.push(route)
		}

		if (status === 'failure') {
			showRequestError(undefined)
		}
		dispatch(actions.parameterization.clearStatus());
	}, [enqueueSnackbar, status, dispatch, showRequestError, history, route]);
};
