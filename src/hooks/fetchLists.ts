import { useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "src/locale/i18n";

import { fetchGuaranteeMethod } from "src/core/store/modules/guarantee-method/thunks";
import {
	getListGuaranteeMethod,
	getListAsOptionsGuaranteeMethod,
} from "src/core/store/modules/guarantee-method/selectors";
import { fetchLicenseType } from "src/core/store/modules/license-type/thunks";
import {
	getListLicenseType,
	getListAsOptionsLicenseType,
} from "src/core/store/modules/license-type/selectors";
import { fetchGuaranteeType } from "src/core/store/modules/guarantee-type/thunks";
import {
	getListGuaranteeType,
	getListAsOptionsGuaranteeType,
} from "src/core/store/modules/guarantee-type/selectors";

import {
	getListGuaranteeModality,
	getLoadingGuaranteeModality,
} from "src/core/store/modules/guarantee-modality/selectors";
import { fetchGuaranteeModality } from "src/core/store/modules/guarantee-modality/thunks";

import {
	getBanks,
	getBanksAsOptions,
} from "src/core/store/modules/banks/selectors";
import { fetchBanks } from "src/core/store/modules/banks/thunks";

import {
	getListProfiles,
	getListProfilesAsOptions,
} from "src/core/store/modules/profiles/selectors";
import { fetchProfiles } from "src/core/store/modules/profiles/thunks";

import {
	getHierarchyListFlow,
	getListHierarchyAsOptions,
} from "src/core/store/modules/hierarchy/selectors";
import { fetchHierarchyList } from "src/core/store/modules/hierarchy/thunks";

import {
	getListUsersActives,
	getListUsersActivesAsOptionsById,
	getListUsersActivesAsOptionsByEmail,
	getListUsersActivesAsOptionsByName,
	getListUsersAsOptionsByBrfId,
} from "src/core/store/modules/users/selectors";
import { fetchActivesUsers } from "src/core/store/modules/users/thunks";

import {
	getStates,
	getStatesAsOptions,
	makeGetCities,
	makeGetCitiesAsOptions,
} from "src/core/store/modules/state-city/selectors";
import {
	fetchCitiesByState,
	fetchStates,
} from "src/core/store/modules/state-city/thunks";

import {
	getListAreasDEJUR,
	getAreasDEJURAsOptions,
	getAreasDEJURWithNamesAsValues,
	getListAreasResponsible,
	getListAreasDEJURbyUser,
	getAreasResponsibleAsOptions,
	getAreasDEJURPathAsOptions,
	getListAreasDEJURGrouped,
	getAreasResponsiblePathAsOptions,
	getListAreasDEJURGroupedByUser,
} from "src/core/store/modules/areas/selectors";
import {
	fetchAreas,
	fetchAreasByUserId,
	fetchAreasWitchGroups,
	fetchGroupedAreas,
	fetchGroupedAreasByUserId,
} from "src/core/store/modules/areas/thunks";

import { fetchCostCenter } from "src/core/store/modules/cost-center/thunks";

import { TModulosId } from "src/core/models/modules";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import {
	getListAsOptionPaymentMethod,
	getListPaymentMethod,
	getSelectedListPaymentMethod,
	getSelectedListAsOptionsPaymentMethod,
	getListAsOptionOfAllPaymentMethods,
} from "src/core/store/modules/payment-method/selectors";
import {
	getListAsOptionPaymentType,
	getListPaymentType,
} from "src/core/store/modules/payment-type/selectors";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { actions } from "src/core/store";
import { fetchPaymentTypeMethod } from "src/core/store/modules/payment-type-method/thunks";
import {
	getItemPaymentTypeMethod,
	getListPaymentTypeMethod,
} from "src/core/store/modules/payment-type-method/selectors";
import { TTypeForm } from "src/core/models/payment";
import { TOptionsSelect } from "src/components/form";
import { TYPE_FLOW } from "src/screen/goods-and-guarantees/constants";
import {
	getListEconomicIndices,
	getListEconomicIndicesAsOptions,
} from "src/core/store/modules/economic-indices/selectors";
import { fetchEconomicIndices } from "src/core/store/modules/economic-indices/thunks";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import {
	getFetchingFinanceChartOfAccountsCategories,
	getListFinanceChartOfAccountsCategories,
	getListFinanceChartOfAccountsCategoriesAsOptions,
} from "src/core/store/modules/finance-chart-of-accounts-categories/selectors";
import { fetchFinanceChartOfAccountsCategoriesList } from "src/core/store/modules/finance-chart-of-accounts-categories/thunks";
import { TFinanceChartOfAccountsCategories } from "src/core/models/finance-chart-of-accounts-categories";
import {
	getListRejectionAndReturnReason,
	getListRejectionReasonsAsOptions,
	getListReturnReasonsAsOptions,
	getListReversalReasonsAsOptions,
	getListCanceledReasonsAsOptions,
} from "src/core/store/modules/rejection-and-return-reason/selectors";
import { fetchRejectionAndReturnReasonList } from "src/core/store/modules/rejection-and-return-reason/thunks";
import {
	getListLitigationNatures,
	getListLitigationNaturesAsOptions,
} from "src/core/store/modules/litigation-natures/selectors";
import { fetchLitigationNatures } from "src/core/store/modules/litigation-natures/thunks";
import {
	getProcessIsFetching,
	getResults,
	getResultsAsOptions,
} from "src/core/store/modules/process/selectors";
import { fetchResults } from "src/core/store/modules/process/thunks";
import {
	getListAccountType,
	getListAccountTypeAsOptions,
} from "src/core/store/modules/account-type/selectors";
import { fetchAccountType } from "src/core/store/modules/account-type/thunks";
import { getListFormulaCorrectionRuleAsOptions } from "src/core/store/modules/formula-correction-rule/selectors";
import { fetchFormulaCorrectionRuleOptions } from "src/core/store/modules/formula-correction-rule/thunks";
import {
	LegalDocumentCoverageEnum,
	LegalDocumentFormTypeEnum,
	LegalDocumentRequestSignatureEnum,
} from "src/core/models/legal-document-request";
import {
	getListOfficeManagementDocumentType,
	getOfficeManagementDocumentTypeAsOptions,
} from "src/core/store/modules/office-management-document-type/selectors";
import { fetchOfficeManagementDocumentType } from "src/core/store/modules/office-management-document-type/thunks";
import {
	getListOfficeManagementResponsible,
	getOfficeManagementResponsibleAsOptions,
} from "src/core/store/modules/office-management-responsible/selectors";
import { fetchOfficeManagementResponsible } from "src/core/store/modules/office-management-responsible/thunks";
import {
	getListOfficeManagementInvoice,
	getOfficeManagementInvoiceAsOptions,
} from "src/core/store/modules/office-management-invoice/selectors";
import { fetchOfficeManagementInvoice } from "src/core/store/modules/office-management-invoice/thunks";
import {
	getListOfficeManagementControl,
	getOfficeManagementControlAsOptions,
} from "src/core/store/modules/office-management-control/selectors";
import { fetchOfficeManagementControl } from "src/core/store/modules/office-management-control/thunks";
import { getListCostCenter } from "src/core/store/modules/cost-center/selectors";
import { TGroupedArea, TUseAreasByUserId } from 'src/core/models/areas';
import { useHistory } from "react-router-dom";
import { getEnvironment } from "src/core/utils/func";
import { fetchCitiesByStateESocialTable, fetchStatesESocialTable } from "src/core/store/modules/e-social-registration-table/thunks";
import { getStatesAsOptionsESocialTable, getStatesESocialTable, makeGetCitiesESocialRegistrationTable, makeGetCitiesESocialRegistrationTableAsOptions } from "src/core/store/modules/e-social-registration-table/selector";


export const useGuaranteeMethod = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const guaranteeMethod = useSelector(getListGuaranteeMethod);
	const guaranteeMethodAsOptions = useSelector(getListAsOptionsGuaranteeMethod);

	useEffect(() => {
		if (!didMount.current && !guaranteeMethod.length) {
			dispatch(fetchGuaranteeMethod({ pageSize: 100, notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, guaranteeMethod.length]);

	return {
		guaranteeMethod,
		guaranteeMethodAsOptions,
	};
};

export const useGuaranteeModality = (isNotAllowedJudicialDeposit = false) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const guaranteeModality = useSelector(getListGuaranteeModality);
	const loading = useSelector(getLoadingGuaranteeModality);

	const guaranteeModalityAsOptions = useMemo(
		() =>
			guaranteeModality.reduce((acc, { id, status, description, typeFlow }) => {
				const isAllowed = !(
					isNotAllowedJudicialDeposit && typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT
				);
				if (id && status && isAllowed)
					acc.push({ label: description, value: id });
				return acc;
			}, [] as TOptionsSelect[]),
		[guaranteeModality, isNotAllowedJudicialDeposit]
	);

	const guaranteeModalityNoJudicialDeposit = guaranteeModality.filter(
		({ typeFlow }) => typeFlow !== 4
	);

	const guaranteeModalityAsOptionsNoJudicialDeposit = useMemo(
		() =>
			guaranteeModalityNoJudicialDeposit.reduce(
				(acc, { id, status, description, typeFlow }) => {
					const isAllowed = !(
						isNotAllowedJudicialDeposit &&
						typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT
					);
					if (id && status && isAllowed)
						acc.push({ label: description, value: id });
					return acc;
				},
				[] as TOptionsSelect[]
			),
		[guaranteeModalityNoJudicialDeposit, isNotAllowedJudicialDeposit]
	);

	const guaranteeModalityTypeFlowAsObject = useMemo(
		() =>
			guaranteeModality.reduce((acc, { id, typeFlow }) => {
				if (id) (acc as any)[id] = typeFlow;
				return acc;
			}, {}) as { [key: number]: TYPE_FLOW },
		[guaranteeModality]
	);

	const guaranteeModalityAsOptionsAll = useMemo<TOptionsSelect[]>(
		() =>
			guaranteeModality.map((x) => ({
				label: x.description,
				value: x.id ?? 0,
			})),
		[guaranteeModality]
	);

	const guaranteeModalityAsOptionsAllNoJudicialDeposit = useMemo<
		TOptionsSelect[]
	>(
		() =>
			guaranteeModality
				.filter((x) => x.typeFlow != TYPE_FLOW.JUDICIAL_DEPOSIT)
				.map((x) => ({
					label: x.description,
					value: x.id ?? 0,
				})),
		[guaranteeModality]
	);

	useEffect(() => {
		if (!didMount.current && !guaranteeModality.length && !loading) {
			dispatch(fetchGuaranteeModality({ pageSize: 100, notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, guaranteeModality.length, loading]);

	return {
		guaranteeModality,
		guaranteeModalityAsOptions,
		guaranteeModalityTypeFlowAsObject,
		guaranteeModalityAsOptionsNoJudicialDeposit,
		guaranteeModalityAsOptionsAll,
		guaranteeModalityAsOptionsAllNoJudicialDeposit
	};
};

export const useLicenseType = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const licenseTypeList = useSelector(getListLicenseType);
	const licenseTypeAsOptions = useSelector(getListAsOptionsLicenseType);

	useEffect(() => {
		if (!didMount.current && !licenseTypeList.length) {
			dispatch(fetchLicenseType({ notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, licenseTypeList.length]);

	return {
		licenseTypeList,
		licenseTypeAsOptions,
	};
};

export const useGuaranteeType = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const guaranteeTypeList = useSelector(getListGuaranteeType);
	const guaranteeTypeAsOptions = useSelector(getListAsOptionsGuaranteeType);

	useEffect(() => {
		if (!didMount.current && !guaranteeTypeList.length) {
			dispatch(fetchGuaranteeType({ pageSize: 100, notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, guaranteeTypeList.length]);

	return {
		guaranteeTypeList,
		guaranteeTypeAsOptions,
	};
};

export const useBanks = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const banks = useSelector(getBanks);
	const banksAsOptions = useSelector(getBanksAsOptions);

	useEffect(() => {
		if (!didMount.current && !banks.length) dispatch(fetchBanks());
		else didMount.current = true;
	}, [dispatch, banks.length]);

	return {
		banks,
		banksAsOptions,
	};
};

export const useAccountTypes = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const accountTypes = useSelector(getListAccountType);
	const accountTypesOptions = useSelector(getListAccountTypeAsOptions);

	useEffect(() => {
		if (!didMount.current && !accountTypes.length)
			dispatch(fetchAccountType({ pageSize: 100, notPaginate: true }));
		else didMount.current = true;
	}, [dispatch, accountTypes.length]);

	return {
		accountTypes,
		accountTypesOptions,
	};
};

export const useStatesAndCities = (selectedState?: number) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const value = Number(selectedState);

	const states = useSelector(getStates);
	const statesAsOptions = useSelector(getStatesAsOptions);
	const getCities = useMemo(() => makeGetCities(value), [value]);
	const getCitiesAsOptions = useMemo(() => makeGetCitiesAsOptions(value), [value]);

	const cities = useSelector(getCities);
	const citiesAsOptions = useSelector(getCitiesAsOptions);

	useEffect(() => {
		if (!didMount.current && !states.length) dispatch(fetchStates());
		else didMount.current = true;
	}, [dispatch, states.length]);
	
	useEffect(() => {
		if (
			value &&
			(cities.length === 0 || !cities.some(({ stateId }) => value === stateId))
		) {
			dispatch(fetchCitiesByState(value));
		}
	}, [dispatch, selectedState, cities, value]);

	return {
		states,
		statesAsOptions,
		cities,
		citiesAsOptions,
	};
};

export const useStatesAndCitiesESocialTable = (selectedState?: any) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const value = Number(selectedState);

	const states = useSelector(getStatesESocialTable);
	const statesAsOptions = useSelector(getStatesAsOptionsESocialTable);
	const getCities = useMemo(() => makeGetCitiesESocialRegistrationTable(value), [value]);
	const getCitiesAsOptions = useMemo(() => makeGetCitiesESocialRegistrationTableAsOptions(value), [value]);

	const cities = useSelector(getCities);
	const citiesAsOptions = useSelector(getCitiesAsOptions);

	useEffect(() => {
		if (!didMount.current && !states.length) dispatch(fetchStatesESocialTable());
		else didMount.current = true;
	}, [dispatch, states.length]);
	
	useEffect(() => {
		if (
			value &&
			(cities.length === 0 || !cities.some(({ stateId }) => value === stateId))
		) { 
			dispatch(fetchCitiesByStateESocialTable(value.toString()));
		}
	}, [dispatch, selectedState, cities, value]);

	return {
		states,
		statesAsOptions,
		cities,
		citiesAsOptions,
	};
};

export const usePaymentType = (modulo: TModulosId, eSocialRestriction?: boolean | undefined) => {
	const dispatch = useDispatch();
	// const didMount = useRef(false);

	const paymentType = useSelector(getListPaymentType);
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentType);

	useEffect(() => {
		dispatch(fetchPaymentType({ 
			pageSize: 100, 
			notPaginate: true,
			modulo,
			eSocialRestriction
		}));
	}, [modulo, eSocialRestriction]);

	return {
		paymentType,
		paymentTypeAsOptions,
	};
};

export const usePaymentMethod = (
	moduloId: TModulosId,
	selectedTypeId?: number
) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const paymentMethod = useSelector(getListPaymentMethod);
	const paymentMethodAsOptions = useSelector(getListAsOptionPaymentMethod);
	const paymentMethodSelected = useSelector(getSelectedListPaymentMethod);
	const paymentMethodSelectedAsOptions = useSelector(
		getSelectedListAsOptionsPaymentMethod
	);
	const allPaymentMethodAsOptions = useSelector(
		getListAsOptionOfAllPaymentMethods
	);

	const paymentType = useSelector(getListPaymentType);

	useEffect(() => {
		if (!didMount.current && !paymentMethod.length) {
			dispatch(
				fetchPaymentMethod({ pageSize: 100, notPaginate: true, moduloId })
			);
		} else didMount.current = true;
	}, [dispatch, paymentMethod.length, moduloId]);

	useEffect(() => {
		if (selectedTypeId) {
			const paymentMethodsIds =
				paymentType.find(({ id }) => id === selectedTypeId)
					?.formasPagamentoIds ?? [];
			const selecteds = paymentMethod.filter(
				({ id }) => id && paymentMethodsIds.includes(id)
			);
			dispatch(actions.paymentMethod.setSelectedList(selecteds));
		}
	}, [dispatch, selectedTypeId, paymentMethod, paymentType]);

	return {
		paymentMethod,
		paymentMethodAsOptions,
		paymentMethodSelected,
		paymentMethodSelectedAsOptions,
		allPaymentMethodAsOptions,
	};
};

export const usePaymentTypeMethod = (
	selectedTypeId?: number,
	selectedMethodId?: number
) => {
	const dispatch = useDispatch();

	const paymentTypeMethod = useSelector(getListPaymentTypeMethod);
	const paymentTypeMethodSelected = useSelector(getItemPaymentTypeMethod);

	useEffect(() => {
		dispatch(fetchPaymentTypeMethod({ notPaginate: true, status: true }));
	}, [dispatch]);

	useEffect(() => {
		if (selectedTypeId) {
			const selected =
				paymentTypeMethod.find(
					({ tipoPagamentoId }) => tipoPagamentoId === selectedTypeId
				) ?? {};
			dispatch(actions.paymentTypeMethod.setItem(selected));
		}
	}, [dispatch, selectedTypeId, paymentTypeMethod]);

	const paymentMethodSelectedAsOptions = useMemo(
		() =>
			paymentTypeMethodSelected.formaPagamentos
				? paymentTypeMethodSelected.formaPagamentos.map(
						({ formaPagamentoId, formaPagamentoDescricao }) => ({
							value: formaPagamentoId,
							label: formaPagamentoDescricao,
						})
				)
				: [],
		[paymentTypeMethodSelected]
	);

	const typeForm = useMemo(() => {
		if (!selectedMethodId) return "";

		return paymentTypeMethodSelected.formaPagamentos
			? paymentTypeMethodSelected.formaPagamentos.find(
					({ formaPagamentoId: id }) => id === selectedMethodId
			)?.formulario ?? "default"
			: "default";
	}, [selectedMethodId, paymentTypeMethodSelected]) as TTypeForm;

	return {
		paymentTypeMethod,
		paymentTypeMethodSelected,
		paymentMethodSelectedAsOptions,
		typeForm,
	};
};

export const useAreasDEJUR = (noFetch = false) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const { dejurAreas } = useSelector(getDataCurrentUser);

	const areas = useSelector(getListAreasDEJUR);
	const areasAsOptions = useSelector(getAreasDEJURAsOptions);
	const areasAsOptionsWithNames = useSelector(getAreasDEJURWithNamesAsValues);
	const areasAsOptionsWithPath = useSelector(getAreasDEJURPathAsOptions);

	const { allowedAreasAsOptions, allowedAreasAsOptionsWithPath } = useMemo(() => {
		if (
			!dejurAreas ||
			!dejurAreas.length ||
			!areasAsOptions ||
			!areasAsOptions.length
		)
			return {
				allowedAreasAsOptions: [],
				allowedAreasAsOptionsWithPath: [],
			};
		
		const uniqueFilter = (array: any[]) => {
			const seenValues = new Set();
			return array.filter(({ value }) => {
				const duplicate = seenValues.has(value);
				seenValues.add(value);
				return !duplicate;
			});
		};
		return {
			allowedAreasAsOptions: uniqueFilter(areasAsOptions.filter(({ value }) => dejurAreas.includes(value))),
			allowedAreasAsOptionsWithPath: uniqueFilter(areasAsOptionsWithPath.filter(({ value }) => dejurAreas.includes(value))),
		};
	}, [dejurAreas, areasAsOptions, areasAsOptionsWithPath]);

	useEffect(() => {
		if (!didMount.current && !areas.length && !noFetch) {
			dispatch(fetchAreas(1));
		} else didMount.current = true;
	}, [dispatch, areas.length, noFetch]);

	return {
		areas,
		areasAsOptions,
		areasAsOptionsWithNames,
		areasAsOptionsWithPath,
		allowedAreasAsOptions,
		allowedAreasAsOptionsWithPath,
	};
};

export const useAreasResponsible = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const { responsibleAreas } = useSelector(getDataCurrentUser);
	const environment = getEnvironment();

	const areas = useSelector(getListAreasResponsible);
	const areasAsOptions = useSelector(getAreasResponsibleAsOptions);

	const allowedAreasAsOptions = useMemo(() => {
		if (
			!responsibleAreas ||
			!responsibleAreas.length ||
			!areasAsOptions ||
			!areasAsOptions.length
		)
			return [];
		return areasAsOptions.filter(({ value }) =>
			responsibleAreas.includes(value)
		);
	}, [responsibleAreas, areasAsOptions]);

	const fetchMultiple = async () => {
		await dispatch(fetchAreas([38, 6484, 6491, 6492, 6544, 6845, 6846]));
	}

	useEffect(() => {
		if (!didMount.current && !areas.length) {
			if(environment === 'PRD'){
				fetchMultiple();
				return
			}
			dispatch(fetchAreas([38, 5612, 5631, 5632]));
		} else didMount.current = true;
	}, [dispatch, areas.length]);

	return {
		areas,
		areasAsOptions,
		allowedAreasAsOptions,
	};
};

export const useAreasResponsiblePath = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const { responsibleAreas } = useSelector(getDataCurrentUser);
	const environment = getEnvironment();

	const areas = useSelector(getListAreasResponsible);
	const areasAsOptions = useSelector(getAreasResponsiblePathAsOptions);

	const allowedAreasAsOptions = useMemo(() => {
		if (
			!responsibleAreas ||
			!responsibleAreas.length ||
			!areasAsOptions ||
			!areasAsOptions.length
		)
			return [];
		return areasAsOptions.filter(({ value }) =>
			responsibleAreas.includes(value)
		);
	}, [responsibleAreas, areasAsOptions]);

	const fetchMultiple = async () => {
		await dispatch(fetchAreas([38, 6484, 6491, 6492, 6544, 6845, 6846]));
	}

	useEffect(() => {
		if (!didMount.current && !areas.length) {
			if(environment === 'PRD'){
				fetchMultiple();
				return
			}
			dispatch(fetchAreas([38, 5612, 5631, 5632]));
		} else didMount.current = true;
	}, [dispatch, areas.length]);

	return {
		areas,
		areasAsOptions,
		allowedAreasAsOptions,
	};
};

export const useAreasResponsibleByUserId = (userId: number) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const listDEJURbyUser = useSelector(getListAreasDEJURbyUser);
	const length = listDEJURbyUser?.responsibleAreaIds?.length;
	const options = listDEJURbyUser?.responsibleAreaIds?.map(({ id, name } : any) => ({ label: name, value: id }))

	useEffect(() => {
		if (!didMount.current && !length && userId) {
			dispatch(fetchAreasByUserId(userId));
		} else didMount.current = true;
	}, [dispatch, userId, length]);

	return { 
		listDEJURbyUser, 
		listDEJURbyUserOptions: options ?? []
	} as TUseAreasByUserId;
};

export const useAreasResponsibleByUserIdPath = (userId: number) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);


	const listDEJURbyUser = useSelector(getListAreasDEJURbyUser);
	const length = listDEJURbyUser?.responsibleAreaIds?.length;
	const options = listDEJURbyUser?.responsibleAreaIds?.map(({ id, path } : any) => ({ label: path, value: id }))
	
	useEffect(() => {
		if (!didMount.current && !length && userId) {
			dispatch(fetchAreasByUserId(userId));
		} else didMount.current = true;
	}, [dispatch, userId, length]);

	return { 
		listDEJURbyUser, 
		listDEJURbyUserOptions: options ?? []
	} as TUseAreasByUserId;
};

export const useProfiles = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const profiles = useSelector(getListProfiles);
	const profilesAsOptions = useSelector(getListProfilesAsOptions);

	useEffect(() => {
		if (!didMount.current && !profiles.length) {
			dispatch(fetchProfiles({ pageSize: 100, notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, profiles.length]);

	return {
		profiles,
		profilesAsOptions,
	};
};

export const useHierarchy = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const hierarchy = useSelector(getHierarchyListFlow);
	const hierarchyAsOptions = useSelector(getListHierarchyAsOptions);

	useEffect(() => {
		if (!didMount.current && !hierarchy.length) {
			dispatch(fetchHierarchyList());
		} else {
			didMount.current = true;
		}
	}, [dispatch, hierarchy.length]);

	return {
		hierarchy,
		hierarchyAsOptions,
	};
};

export const useEconomicIndices = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const economicIndices = useSelector(getListEconomicIndices);
	const economicIndicesAsOptions = useSelector(getListEconomicIndicesAsOptions);

	useEffect(() => {
		if (!didMount.current && !economicIndices.length) {
			dispatch(fetchEconomicIndices({ pageSize: 100, notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, economicIndices.length]);

	return {
		economicIndices,
		economicIndicesAsOptions,
	};
};

export const useUsersActives = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const usersActives = useSelector(getListUsersActives);
	const usersActivesAsOptionsById = useSelector(
		getListUsersActivesAsOptionsById
	);
	const usersActivesAsOptionsByName = useSelector(
		getListUsersActivesAsOptionsByName
	);
	const usersActivesAsOptionsByEmail = useSelector(
		getListUsersActivesAsOptionsByEmail
	);
	const usersActivesAsOptionsByBrfId = useSelector(
		getListUsersAsOptionsByBrfId
	);

	useEffect(() => {
		if (!didMount.current && !usersActives.length) {
			dispatch(fetchActivesUsers());
		} else didMount.current = true;
	}, [dispatch, usersActives.length]);

	return {
		usersActives,
		usersActivesAsOptionsById,
		usersActivesAsOptionsByName,
		usersActivesAsOptionsByEmail,
		usersActivesAsOptionsByBrfId,
	};
};

export const useFinanceChartOfAccountsCategories = (
	moduleId: TModulosId,
	current?: TFinanceChartOfAccountsCategories
) => {
	const dispatch = useDispatch();

	const isFinanceChartOfAccountsCategoriesLoading = useSelector(
		getFetchingFinanceChartOfAccountsCategories
	);

	const financeChartOfAccountsCategories = useSelector(
		getListFinanceChartOfAccountsCategories
	);
	const options = useSelector(getListFinanceChartOfAccountsCategoriesAsOptions);

	const financeChartOfAccountsCategoriesAsOptions = useMemo(
		() =>
			current
				? [{ label: current.name ?? "", value: current.id }, ...options]
				: options,
		[options, current]
	);

	useEffect(() => {
		dispatch(
			fetchFinanceChartOfAccountsCategoriesList({
				pageSize: 100,
				notPaginate: true,
				moduleId,
			})
		);
		
	}, [dispatch]);

	return {
		financeChartOfAccountsCategories,
		financeChartOfAccountsCategoriesAsOptions,
		isFinanceChartOfAccountsCategoriesLoading,
	};
};

export const useEvaluationReasons = (moduloId: number, reasonType?: number) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const rejectionAndReturnReason = useSelector(getListRejectionAndReturnReason);
	const returnReasonsAsOptions = useSelector(getListReturnReasonsAsOptions);
	const rejectionReasonsAsOptions = useSelector(
		getListRejectionReasonsAsOptions
	);
	const canceledReasonsAsOptions = useSelector(getListCanceledReasonsAsOptions);
	const reversalReasonAsOptions = useSelector(getListReversalReasonsAsOptions);

	const reasons = useMemo(
		() => ({
			returned: returnReasonsAsOptions,
			rejected: rejectionReasonsAsOptions,
			reversed: reversalReasonAsOptions,
			cancelled: canceledReasonsAsOptions,
		}),
		[
			returnReasonsAsOptions,
			rejectionReasonsAsOptions,
			reversalReasonAsOptions,
			canceledReasonsAsOptions,
		]
	);

	useEffect(() => {
		if (!didMount.current && !rejectionAndReturnReason.length) {
			dispatch(
				fetchRejectionAndReturnReasonList({
					pageSize: 100,
					notPaginate: true,
					status: true,
					moduloId,
				})
			);
		} else didMount.current = true;
	}, [dispatch, rejectionAndReturnReason.length, moduloId]);

	return {
		reasons,
		rejectionAndReturnReason,
		returnReasonsAsOptions,
		rejectionReasonsAsOptions,
		reversalReasonAsOptions,
		canceledReasonsAsOptions
	};
};

export const useLitigationNatures = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const litigationNatures = useSelector(getListLitigationNatures);
	const litigationNaturesAsOptions = useSelector(
		getListLitigationNaturesAsOptions
	);

	useEffect(() => {
		if (!didMount.current && !litigationNatures.length) {
			dispatch(fetchLitigationNatures({ notPaginate: true }));
		} else didMount.current = true;
	}, [dispatch, litigationNatures.length]);

	return {
		litigationNatures,
		litigationNaturesAsOptions,
	};
};

export const useResults = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const loading = useSelector(getProcessIsFetching);
	const results = useSelector(getResults);
	const resultsAsOptions = useSelector(getResultsAsOptions);

	useEffect(() => {
		if (!didMount.current && !results.length && !loading) {
			dispatch(fetchResults());
		} else didMount.current = true;
	}, [dispatch, results.length, loading]);

	return {
		results,
		resultsAsOptions,
	};
};

export const useFormulaCorrectionRule = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const formulaCorrectionRuleAsOptions = useSelector(
		getListFormulaCorrectionRuleAsOptions
	);

	useEffect(() => {
		if (!didMount.current && !formulaCorrectionRuleAsOptions.length) {
			dispatch(fetchFormulaCorrectionRuleOptions({ isActive: true }));
		} else didMount.current = true;
	}, [dispatch, formulaCorrectionRuleAsOptions.length]);

	return {
		formulaCorrectionRuleAsOptions,
	};
};

export const useOfficeManagementDocuments = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const documents = useSelector(getListOfficeManagementDocumentType);
	const documentsAsOptions = useSelector(
		getOfficeManagementDocumentTypeAsOptions
	);

	useEffect(() => {
		if (!didMount.current && !documents.length) {
			dispatch(fetchOfficeManagementDocumentType({}));
		} else didMount.current = true;
	}, [dispatch, documents.length]);

	return {
		documents,
		documentsAsOptions,
	};
};

export const useOfficeManagementResponsible = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const responsibles = useSelector(getListOfficeManagementResponsible);
	const responsiblesAsOptions = useSelector(
		getOfficeManagementResponsibleAsOptions
	);

	useEffect(() => {
		if (!didMount.current && !responsibles.length) {
			dispatch(fetchOfficeManagementResponsible({}));
		} else didMount.current = true;
	}, [dispatch, responsibles.length]);

	return {
		responsibles,
		responsiblesAsOptions,
	};
};

export const useOfficeManagementInvoices = (areaFilter?: number[]) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const natureInvoices = useSelector(getListOfficeManagementInvoice);
	const natureInvoicesAsOptions = useSelector(
		getOfficeManagementInvoiceAsOptions
	);

	const response = useMemo(() => {
		if (!areaFilter)
			return {
				natureInvoices,
				natureInvoicesAsOptions,
			};

		const natureFilterArea = natureInvoices.filter((x) =>
			areaFilter.includes(x.areaId ?? 0)
		);
		const selectorsFilterArea = natureInvoicesAsOptions.filter((x) =>
			areaFilter.includes(Number(x.group))
		);

		return {
			natureInvoices: natureFilterArea,
			natureInvoicesAsOptions: selectorsFilterArea,
		};
	}, [areaFilter, natureInvoices, natureInvoicesAsOptions]);

	useEffect(() => {
		if (!didMount.current && !natureInvoices.length) {
			dispatch(fetchOfficeManagementInvoice({}));
		} else didMount.current = true;
	}, [dispatch, natureInvoices.length]);

	return response;
};

export const useOfficeManagementControl = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const control = useSelector(getListOfficeManagementControl);
	const controlAsOptions = useSelector(getOfficeManagementControlAsOptions);

	useEffect(() => {
		if (!didMount.current && !control.length) {
			dispatch(fetchOfficeManagementControl({}));
		} else didMount.current = true;
	}, [dispatch, control.length]);

	return {
		control,
		controlAsOptions,
	};
};

export const useLegalDocOptions = () => {
	const { t } = useTranslation();

	const legalDocsRequestTypesOptions = useMemo(() => {
		return [
			{
				label: t("legalDocs:requestTypesList.prepositionLetter"),
				value: LegalDocumentFormTypeEnum.PrepositionLetter,
			},
			{
				label: t("legalDocs:requestTypesList.replacement"),
				value: LegalDocumentFormTypeEnum.Replacement,
			},
			{
				label: t("legalDocs:requestTypesList.electronicPowerOfAttorney.legal"),
				value: LegalDocumentFormTypeEnum.EletronicProcurationLegal,
			},
			{
				label: t(
					"legalDocs:requestTypesList.electronicPowerOfAttorney.otherAreas"
				),
				value: LegalDocumentFormTypeEnum.EletronicProcurationOtherAreas,
			},
		];
	}, [t]);

	const legalDocsRequestCoverageOptions = useMemo(() => {
		return [
			{
				label: t("legalDocs:request.coverageOpt.generic"),
				value: LegalDocumentCoverageEnum.Generic,
			},
			{
				label: t("legalDocs:request.coverageOpt.specific"),
				value: LegalDocumentCoverageEnum.Specific,
			},
		];
	}, [t]);

	const legalDocsSignatureTypesOptions = useMemo(() => {
		return [
			{
				label: t("legalDocs:request.signatureType.eletronic"),
				value: LegalDocumentRequestSignatureEnum.Electronic,
			},
			{
				label: t("legalDocs:request.signatureType.manual"),
				value: LegalDocumentRequestSignatureEnum.Manual,
			},
		];
	}, [t]);

	return {
		legalDocsRequestTypesOptions,
		legalDocsRequestCoverageOptions,
		legalDocsSignatureTypesOptions,
	};
};

export const useAreasWitchGroups = (subgroups: boolean = false, getGrouped?: boolean, checkProfile?: boolean) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if(getGrouped === true){
			dispatch(fetchGroupedAreas(true));
			return
		} else {
			dispatch(fetchAreasWitchGroups());

		}
	}, [dispatch]);

	const areas = useSelector(getListAreasDEJUR);

	const areasDEJUROptions = useMemo(
		() =>
			areas.map<TOptionsSelect>((area) => ({
				label: area.path,
				value: area.id,
				groupItem: subgroups ? area.subgroup : undefined,
			})),
		[areas, subgroups]
	);

	return {
		areas,
		areasDEJUROptions,
	};
};

export const useGroupedAreas = (subgroups: boolean = false) => {
	const dispatch = useDispatch();

	useEffect(() => {	
			dispatch(fetchGroupedAreas(true));
	}, [dispatch]);

	const areas = useSelector(getListAreasDEJURGrouped);

	const groupedAreasAsOptions = areas?.map<any>((area: any) => {
			return {
					id: area?.id,
					name: area?.path,
					subItems: area?.subItens?.map((item: any) => {
					return {
							label: item.path,
							value: item.id,
							groupItem: subgroups ? item.subgroup : undefined
					}
			})
		};
	})

	return {
		areas,
		groupedAreasAsOptions
	};
};

export const useGroupedAreasUserConfig = (subgroups: boolean = false) => {
	const dispatch = useDispatch();

	useEffect(() => {
			dispatch(fetchGroupedAreas(false));
	}, [dispatch]);

	const areas = useSelector(getListAreasDEJURGrouped);

	const groupedAreasAsOptions = areas?.map<any>((area: any) => {
			return {
					id: area?.id,
					name: area?.path,
					subItems: area?.subItens?.map((item: any) => {
					return {
							label: item.path,
							value: item.id,
							groupItem: subgroups ? item.subgroup : undefined
					}
			})
		};
	})

	return {
		areas,
		groupedAreasAsOptions
	};
};

export const useListCostCenter = () => {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const costCenterList = useSelector(getListCostCenter);

	useEffect(() => {
		if (!didMount.current && !costCenterList.length) {
			dispatch(fetchCostCenter(""));
		} else didMount.current = true;
	}, [dispatch, costCenterList.length]);

	return {
		costCenterList,
	};
};

export const useGroupedAreasById = (subgroups: boolean = false) => {
	const dispatch = useDispatch();
	const didMount = useRef(false);
	const environment = getEnvironment();

	const areasById = useSelector(getListAreasDEJURGroupedByUser)

	const fetchMultiple = async () => {
		await dispatch(fetchGroupedAreasByUserId([38, 6484, 6491, 6492, 6544, 6845, 6846]));
	}
	useEffect(() => {
		if (!didMount.current && !areasById.length) {
			if(environment === 'PRD'){
				fetchMultiple();
				return
			}
			dispatch(fetchGroupedAreasByUserId([38, 5612, 5631, 5632]));
		} else didMount.current = true;
	}, [dispatch, areasById.length]);

	const groupedAreasByIdAsOptions = areasById?.map<any>((area: any) => {
		return {
				id: area?.id,
				name: area?.path,
				subItems: area?.subItens?.map((item: any) => {
				return {
						label: item.path,
						value: item.id,
						groupItem: subgroups ? item.subgroup : undefined
				}
		})
	};
})

	return {
		groupedAreasByIdAsOptions
	};
};

