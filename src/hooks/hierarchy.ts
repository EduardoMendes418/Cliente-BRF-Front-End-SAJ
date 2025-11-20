import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions } from 'src/core/store';
import {
	getHierarchyStatus,
	getHierarchyErrorMessage,
	getHierarchyJuridicalArea,
} from 'src/core/store/modules/hierarchy/selectors';
import { fetchHierarchy } from 'src/core/store/modules/hierarchy/thunks';
import { usePagination } from 'src/hooks/pagination';
import { useHandleRequestError } from '.';

export const useFetchHierarchy = () => {
	const dispatch = useDispatch();

	const { page, pageSize } = usePagination()
	const juridicalArea = useSelector(getHierarchyJuridicalArea);

	useEffect(() => {
		dispatch(fetchHierarchy({ page, pageSize, juridicalArea }));	
	}, [page, pageSize, dispatch, juridicalArea]);
};

export const useActionHierarchy = (route: string) => {
	const history = useHistory();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const status = useSelector(getHierarchyStatus);
	const error = useSelector(getHierarchyErrorMessage);

	const { page, pageSize } = usePagination()
	const juridicalArea = useSelector(getHierarchyJuridicalArea);

	const { showRequestError } = useHandleRequestError()

	const getMessage = useCallback(() => {
		switch (status) {
			case 'added':
				return `Hierarquia adicionada com sucesso!`;

			case 'deleted':
				return `Hierarquia deletada com sucesso!`;
		}
	}, [status]);

	useEffect(() => {
		if (status === 'added' || status === 'deleted') {
			enqueueSnackbar(getMessage(), {
				variant: 'success',
			});

			if (status === 'deleted')
				dispatch(fetchHierarchy({ page, pageSize, juridicalArea }));
		}

		if (status === 'added') history.push('/configuracoes/geral/cadastro-aprovadores'); 

		if (status === 'failure') {
			showRequestError(error, () => dispatch(actions.hierarchy.clearStatus()))
		}
	}, [
		getMessage,
		enqueueSnackbar,
		history,
		status,
		dispatch,
		error,
		showRequestError,
		route,
		page,
		pageSize,
		juridicalArea
	]);
};
