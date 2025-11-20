import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { actions } from 'src/core/store';

import { getSapHierarchyStatus, getSapHierarchyErrorMessage } from 'src/core/store/modules/hierarchy-sap/selectors'
import { useHandleRequestError } from '.';

export const useSapHierarchyError = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const status = useSelector(getSapHierarchyStatus);
	const error = useSelector(getSapHierarchyErrorMessage);

	const { showRequestError } = useHandleRequestError()

	useEffect(() => {
		if (status === 'failure') {
			showRequestError(error, () => dispatch(actions.sapHierarchy.clearStatus()))
		}
	}, [history, status, dispatch, error, showRequestError]);
};
