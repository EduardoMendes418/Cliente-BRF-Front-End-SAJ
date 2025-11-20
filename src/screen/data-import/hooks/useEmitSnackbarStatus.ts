import { useEffect } from 'react';

import { useSnackbar } from 'notistack';
import { getDataImportErrorMessage, getDataImportStatus } from 'src/core/store/modules/data-import/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';

const useEmitSnackbarStatus = (requestCTG?: boolean) => {
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const status = useSelector(getDataImportStatus);
	const errorMessage = useSelector(getDataImportErrorMessage);

	useEffect(() => {
		if (['imported', 'failure'].includes(status)) {
			if(requestCTG && status === 'imported') return;
			let message = t(`dataImport:importErrors.${status === 'imported' ? "importSuccess" : "importFail"}`)
			if (status === 'failure' && errorMessage) message = errorMessage;

			const variant = status === 'imported' ? 'success' : 'error'
			enqueueSnackbar(message, { variant })
			dispatch(actions.dataImport.clearStatus());
		}
	}, [status, enqueueSnackbar, t, dispatch, errorMessage]);

}

export default useEmitSnackbarStatus;