import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { TOptionsSelect } from 'src/components/form';
import { t } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import {
	getListActivePoliciesGoodsGuaranteesRequest,
	getErrorMessageGoodsGuaranteesRequest,
	getItemGoodsGuaranteesRequest,
	getRedirectUrlGoodsGuaranteesRequest,
	getStatusGoodsGuaranteesRequest,
	getGoodguaranteesCompanies,
	getErrorGoodsGuaranteesRequest,
} from 'src/core/store/modules/goods-guarantee/selectors';
import { fetchGoodGuarantiesCompanies, fetchGoodsGuaranteesRequestById, fetchGoodsGuaranteesRequestList } from 'src/core/store/modules/goods-guarantee/thunks';
import { RECORD_TYPE } from 'src/screen/goods-and-guarantees/constants';

import { useHandleRequestError } from '.';

export const useGoodsAndGuarantees = (route: string) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { showRequestError } = useHandleRequestError()

	const status = useSelector(getStatusGoodsGuaranteesRequest);
	const error = useSelector(getErrorMessageGoodsGuaranteesRequest);
	const errorSap = useSelector(getErrorGoodsGuaranteesRequest) as { detail: string};
	const redirectUrl = useSelector(getRedirectUrlGoodsGuaranteesRequest);

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
			history.push(route);
		}

		if (status === 'failure') {
			if (error === undefined) {
				showRequestError(errorSap.detail, () => dispatch(actions.goodsGuaranteesRequest.clearStatus()));
			} else {
				showRequestError(error, () => dispatch(actions.goodsGuaranteesRequest.clearStatus()));
			}

			if (redirectUrl) history.replace(redirectUrl);
		}
	}, [
		error,
		route,
		status,
		history,
		dispatch,
		getMessage,
		redirectUrl,
		enqueueSnackbar,
		showRequestError
	]);
};

export const useFetchGoodsAndGuaranteesItem = (id: number) => {
	const dispatch = useDispatch();

	const item = useSelector(getItemGoodsGuaranteesRequest);

	useEffect(() => {
		if (id && Number(item.id) !== id) dispatch(fetchGoodsGuaranteesRequestById(id));

		return () => {
			dispatch(actions.goodsGuaranteesRequest.clear());
			dispatch(actions.process.clear());
		};
		
	}, [dispatch, id])

	useEffect(() => {
		if (!!item.id) dispatch(actions.process.setProcess(item.process))
	}, [dispatch, item])
}

const defaultFilters = { page: 1, pageSize: 100 };

export const useActivePolicies = (
	folderNumber: string,
	goodGuaranteeLinked: number | '',
	readOnly: boolean
) => {
	const dispatch = useDispatch();
	const didSearch = useRef(false)

	const activePoliciesList = useSelector(getListActivePoliciesGoodsGuaranteesRequest);
	
	const activePoliciesAsOptions = useMemo(() =>
		activePoliciesList
			.filter(({ policyNumber }) => policyNumber)
			.map(({ id, policyNumber }) => ({ label: policyNumber, value: id })) as TOptionsSelect[],
		[activePoliciesList])
	const filtredActivePoliciesList = activePoliciesList.filter(({goodGuaranteeLinked, isDeleted, requestTypeId}) => requestTypeId !== 2 && !isDeleted)
	const filtredactivePoliciesAsOptions = useMemo(() =>
		filtredActivePoliciesList
			.filter(({ policyNumber }) => policyNumber)
			.map(({ id, policyNumber }) => ({ label: policyNumber, value: id })) as TOptionsSelect[],
		[filtredActivePoliciesList])

	const searchActivePolicies = useCallback(() => {
		if (didSearch.current) return;

		dispatch(fetchGoodsGuaranteesRequestList({
			...defaultFilters,
			folderNumber,
			recordType: RECORD_TYPE.EFFECTIVE,
			isActive: true,
		}));
		didSearch.current = true;
	}, [folderNumber, dispatch]);

	useEffect(() => {
		if (!goodGuaranteeLinked) return;

		if (!readOnly) {
			searchActivePolicies();
			return;
		}

		dispatch(fetchGoodsGuaranteesRequestList({
			id: goodGuaranteeLinked,
			...defaultFilters,
		}));
		
	}, []);

	return {
		activePoliciesList,
		searchActivePolicies,
		activePoliciesAsOptions,
		filtredactivePoliciesAsOptions
	}
}

export const useGoodsAndGuaranteesInsurer = () => {
	const dispatch = useDispatch()

	const companies = useSelector(getGoodguaranteesCompanies)

	useEffect(() => {
		dispatch(fetchGoodGuarantiesCompanies())
	}, [dispatch])

	const companiesOptions = useMemo<TOptionsSelect[]>(() => companies.slice().map(x => ({
			label: x.value,
			value: x.id
	})), [companies])

	return {
		companies, companiesOptions
	}
}