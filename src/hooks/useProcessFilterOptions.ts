import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	getClosingAsOptions,
	getContingenciesAsOptions,
	getResultsAsOptions,
	getSpeciesCategoryAsOptions,
	getSpheresAsOptions,
	getStatusesAsOptions,
} from "src/core/store/modules/process/selectors";
import {
	fetchClosing,
	fetchResults,
	fetchSpheres,
	fetchStatuses,
	fetchContingencies,
	fetchSpeciesCategory,
} from "src/core/store/modules/process/thunks";
import { getBusinessAreasAsOptions, getProvisionClassesAsOptions } from "src/core/store/modules/report-options/selectors";
import { fetchBusinessAreas, fetchProvisionClasses } from "src/core/store/modules/report-options/thunks";
import { fetchLitigationActionAppealProceduralIssueType } from "src/core/store/modules/litigation-action-appeal-procedural-issue-type/thunks";
import { fetchLitigationNatures } from "src/core/store/modules/litigation-natures/thunks";
import { getListLitigationActionAppealProceduralIssueTypeAsOptions } from "src/core/store/modules/litigation-action-appeal-procedural-issue-type/selectors";
import { getListLitigationNaturesAsOptions } from "src/core/store/modules/litigation-natures/selectors";
import { useAreasDEJUR, useAreasResponsible, useGroupedAreasById } from "src/hooks/fetchLists";
import { TOptionsSelect } from 'src/components/form';
import { getRequestParametersAsOptions } from "src/core/store/modules/request-parameters/selectors";
import { fetchRequestParameters } from "src/core/store/modules/request-parameters/thunks";

export function useContingencyTypeOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const contingenciesOptions = useSelector(getContingenciesAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!contingenciesOptions.length) dispatch(fetchContingencies());
	}, [contingenciesOptions.length, dispatch])

	return contingenciesOptions
}

export function useSpheresOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const spheresOptions = useSelector(getSpheresAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!spheresOptions.length) dispatch(fetchSpheres());
	}, [spheresOptions.length, dispatch])

	return spheresOptions
}

export function useClosingOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const closingOptions = useSelector(getClosingAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!closingOptions.length) dispatch(fetchClosing());
	}, [closingOptions.length, dispatch])

	return closingOptions
}

export function useProvisionClassesOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const provisionClassesOptions = useSelector(getProvisionClassesAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!provisionClassesOptions.length) dispatch(fetchProvisionClasses());
	}, [provisionClassesOptions.length, dispatch])

	return provisionClassesOptions as TOptionsSelect[]
}

export function useActionClassesOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const actionClassesOptions = useSelector(getListLitigationActionAppealProceduralIssueTypeAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!actionClassesOptions.length) dispatch(fetchLitigationActionAppealProceduralIssueType());
	}, [actionClassesOptions.length, dispatch])

	return actionClassesOptions as TOptionsSelect[]
}

export function useStatusProcessOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const statusesOptions = useSelector(getStatusesAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true
		if (!statusesOptions.length) dispatch(fetchStatuses());
	}, [statusesOptions.length, dispatch])

	return statusesOptions
}

function useProcessFilterOptions() {
	const dispatch = useDispatch();
	const didMount = useRef(false);

	const { allowedAreasAsOptions: areasDEJUROptions } = useAreasDEJUR();
	const { allowedAreasAsOptions: areasResponsibleOptions } = useAreasResponsible();
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();

	const contingenciesOptions = useContingencyTypeOptions()
	const spheresOptions = useSpheresOptions()
	const closingOptions = useClosingOptions()
	const provisionClassesOptions = useProvisionClassesOptions()
	const actionClassesOptions = useActionClassesOptions()
	const statusesOptions = useStatusProcessOptions()

	const resultsAsOptions = useSelector(getResultsAsOptions)
	const businessAreasOptions = useSelector(getBusinessAreasAsOptions)
	const speciesCategoryOptions = useSelector(getSpeciesCategoryAsOptions)
	const natureOptions = useSelector(getListLitigationNaturesAsOptions)
	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions)

	useEffect(() => {
		if (didMount.current) return;
		didMount.current = true

		if (!resultsAsOptions.length) dispatch(fetchResults());
		if (!businessAreasOptions.length) dispatch(fetchBusinessAreas());
		if (!speciesCategoryOptions.length) dispatch(fetchSpeciesCategory());
		if (!natureOptions.length) dispatch(fetchLitigationNatures({ notPaginate: true}));
		if (!requisitionTypesOptions.length) dispatch(fetchRequestParameters({ notPaginate: true}));
	}, [
		dispatch,
		resultsAsOptions.length,
		businessAreasOptions.length,
		speciesCategoryOptions.length,
		natureOptions.length,
		requisitionTypesOptions.length
	]);

	const sortLabels = (x: TOptionsSelect, y: TOptionsSelect) => {
		return x.label?.localeCompare(y.label ?? "")
	}

	const spheresOptionsList = useMemo(() => spheresOptions.slice().filter(x => x.label !== "" && x.label).sort(sortLabels), [spheresOptions])
	const closingOptionsList = useMemo(() => closingOptions.slice().sort(sortLabels), [closingOptions])
	const statusesOptionsList = useMemo(() => statusesOptions.slice().sort(sortLabels), [statusesOptions])
	const resultsAsOptionsList = useMemo(() => resultsAsOptions.slice().sort(sortLabels), [resultsAsOptions])
	const areasDEJUROptionsList = useMemo(() => areasDEJUROptions.slice().sort(sortLabels), [areasDEJUROptions])
	const actionClassesOptionsList = useMemo(() => actionClassesOptions.slice().sort(sortLabels), [actionClassesOptions])
	const businessAreasOptionsList = useMemo(() => businessAreasOptions.slice().sort(sortLabels), [businessAreasOptions])
	const contingenciesOptionsList = useMemo(() => contingenciesOptions.slice().sort(sortLabels), [contingenciesOptions])
	const speciesCategoryOptionsList = useMemo(() => speciesCategoryOptions.slice().sort(sortLabels), [speciesCategoryOptions])
	const areasResponsibleOptionsList = useMemo(() => areasResponsibleOptions.slice().sort(sortLabels), [areasResponsibleOptions])
	const provisionClassesOptionsList = useMemo(() => provisionClassesOptions.slice().sort(sortLabels), [provisionClassesOptions])
	const natureOptionsList = useMemo(() => natureOptions.slice().sort(sortLabels), [natureOptions])
	const requisitionTypesOptionsList = useMemo(() => requisitionTypesOptions.slice().sort(sortLabels), [requisitionTypesOptions])

	return {
		spheresOptions: spheresOptionsList,
		closingOptions: closingOptionsList,
		statusesOptions: statusesOptionsList,
		resultsAsOptions: resultsAsOptionsList,
		areasDEJUROptions: areasDEJUROptionsList,
		actionClassesOptions: actionClassesOptionsList,
		businessAreasOptions: businessAreasOptionsList,
		contingenciesOptions: contingenciesOptionsList,
		speciesCategoryOptions: speciesCategoryOptionsList,
		areasResponsibleOptions: areasResponsibleOptionsList,
		provisionClassesOptions: provisionClassesOptionsList,
		natureOptions: natureOptionsList,
		requisitionTypesOptions: requisitionTypesOptionsList,
		groupedAreasByIdAsOptions
	}
}

export default useProcessFilterOptions
